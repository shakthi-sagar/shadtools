import fs from 'fs';
import path from 'path';
import { pathToFileURL } from 'url';
import { getToolUrl, getNamespaceUrl, getVariantUrl } from '../src/lib/routing';
import type { ToolModule } from '../src/tools/tool-module';

interface ValidationIssue {
  type: 'error' | 'warning';
  message: string;
  context?: string;
}

const issues: ValidationIssue[] = [];

console.log('🔍 Running ShadTools Production SEO, Indexability & Route Integrity Validator...\n');

const canonicalUrls = new Map<string, string>(); // url -> source
const titles = new Map<string, string>(); // title -> source
const generatedRoutes = new Set<string>(); // path

// 1. Discover all tool modules dynamically from src/tools
const srcToolsDir = path.join(process.cwd(), 'src', 'tools');
const toolModules: Array<{ key: string; module: ToolModule }> = [];

function findToolIndices(dir: string): string[] {
  const results: string[] = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory() && !entry.name.startsWith('_')) {
      results.push(...findToolIndices(fullPath));
    } else if (entry.isFile() && entry.name === 'index.ts' && dir !== srcToolsDir) {
      results.push(fullPath);
    }
  }
  return results;
}

async function loadAllToolModules() {
  const indexFiles = findToolIndices(srcToolsDir);
  for (const file of indexFiles) {
    const fileUrl = pathToFileURL(file).href;
    const mod = await import(fileUrl);
    if (mod.toolModule) {
      toolModules.push({ key: mod.toolModule.key, module: mod.toolModule });
    }
  }
}

await loadAllToolModules();

// Register primary static pages (homepage, search, legal, etc.)
const staticSitePages = ['/', '/search', '/privacy', '/terms', '/disclaimer', '/contact'];
for (const p of staticSitePages) {
  generatedRoutes.add(p);
  canonicalUrls.set(`https://shadtools.com${p === '/' ? '' : p}`, `Static Page: ${p}`);
}

// Register tool main pages and namespaces
for (const { key } of toolModules) {
  const [namespace, toolSlug] = key.split('/');
  const toolUrl = getToolUrl(namespace, toolSlug);
  const nsUrl = getNamespaceUrl(namespace);

  if (canonicalUrls.has(`https://shadtools.com${toolUrl}`)) {
    issues.push({
      type: 'error',
      message: `Duplicate tool URL: ${toolUrl}`,
      context: `Tool ${key} conflicts with ${canonicalUrls.get(`https://shadtools.com${toolUrl}`)}`,
    });
  } else {
    canonicalUrls.set(`https://shadtools.com${toolUrl}`, `Tool: ${key}`);
    generatedRoutes.add(toolUrl);
  }

  generatedRoutes.add(nsUrl);
}

// 2. Validate all SEO-enabled tools & variant pages
const seoTools = toolModules.filter(({ module }) => module.seoPages != null);
let indexableRouteCount = 0;
let nonIndexableRouteCount = 0;

for (const { key, module } of seoTools) {
  if (!module.seoPages) continue;

  const [namespace, toolSlug] = key.split('/');
  const staticPages = module.seoPages.getStaticPages();
  const providerSlugs = new Set<string>();

  for (const variantData of staticPages) {
    const variantSlug = module.seoPages.getSlug(variantData);
    const meta = module.seoPages.getMetadata(variantData);
    const result = module.seoPages.compute(variantData);
    const isIndexable = module.seoPages.isIndexable(variantData);
    const variantPath = getVariantUrl(namespace, toolSlug, variantSlug);
    const canonical = `https://shadtools.com${variantPath}`;

    if (isIndexable) {
      indexableRouteCount++;
    } else {
      nonIndexableRouteCount++;
    }

    if (!variantSlug) {
      issues.push({ type: 'error', message: `Empty variant slug in tool ${key}` });
      continue;
    }

    // Canonical Hardening Checks
    if (canonical.includes('?') || canonical.includes('#')) {
      issues.push({
        type: 'error',
        message: `Canonical URL contains query parameter or hash: '${canonical}'`,
        context: `Tool ${key}:${variantSlug}`,
      });
    }

    if (!canonical.startsWith('https://shadtools.com')) {
      issues.push({
        type: 'error',
        message: `Canonical URL does not use production domain origin: '${canonical}'`,
        context: `Tool ${key}:${variantSlug}`,
      });
    }

    if (!meta || !meta.title || !meta.description || !meta.h1) {
      issues.push({
        type: 'error',
        message: `Missing title, description, or H1 for variant '${variantSlug}' in tool ${key}`,
      });
    }

    if (!result || !result.answer) {
      issues.push({
        type: 'error',
        message: `SEO compute() returned invalid result for variant '${variantSlug}' in tool ${key}`,
      });
    }

    // Title length check
    if (meta.title && meta.title.length > 75) {
      issues.push({
        type: 'warning',
        message: `Title long (${meta.title.length} chars): "${meta.title}"`,
        context: variantPath,
      });
    }

    // Description length check
    if (meta.description && meta.description.length > 220) {
      issues.push({
        type: 'warning',
        message: `Description wildly oversized (${meta.description.length} chars): "${meta.description}"`,
        context: variantPath,
      });
    }

    // Duplicate check within same tool
    if (providerSlugs.has(variantSlug)) {
      issues.push({
        type: 'error',
        message: `Tool ${key} produced duplicate variant slug: '${variantSlug}'`,
      });
    }
    providerSlugs.add(variantSlug);

    // Duplicate canonical URL
    if (canonicalUrls.has(canonical)) {
      issues.push({
        type: 'error',
        message: `Duplicate canonical URL '${canonical}'`,
        context: `Conflict between ${key}:${variantSlug} and ${canonicalUrls.get(canonical)}`,
      });
    } else {
      canonicalUrls.set(canonical, `${key}:${variantSlug}`);
      generatedRoutes.add(variantPath);
    }

    // Duplicate titles (warn if duplicate titles among indexable pages)
    if (isIndexable) {
      if (titles.has(meta.title)) {
        issues.push({
          type: 'warning',
          message: `Duplicate indexable title: "${meta.title}"`,
          context: `${key}:${variantSlug} and ${titles.get(meta.title)}`,
        });
      } else {
        titles.set(meta.title, `${key}:${variantSlug}`);
      }
    }
  }

  // 3. Deterministic Sampling Check for each SEO-enabled provider
  const pairVariants = staticPages.filter((p: any) => p.type === 'pair' || p.value === undefined);
  const exactVariants = staticPages.filter((p: any) => p.type === 'exact' && p.value !== undefined);

  const sampleTargets = [
    ...pairVariants.slice(0, 1),
    ...exactVariants.filter((e: any) => e.value === 1).slice(0, 1),
    ...exactVariants.filter((e: any) => e.value === 25).slice(0, 1),
    ...exactVariants.filter((e: any) => e.value === 1000).slice(0, 1),
  ];

  for (const sampled of sampleTargets) {
    const sSlug = module.seoPages.getSlug(sampled);
    const sMeta = module.seoPages.getMetadata(sampled);
    const sResult = module.seoPages.compute(sampled);
    const sCanonical = `https://shadtools.com${getVariantUrl(namespace, toolSlug, sSlug)}`;

    if (!sMeta.title || !sMeta.description || !sMeta.h1 || !sResult.answer) {
      issues.push({
        type: 'error',
        message: `Sampled SEO route '${sSlug}' failed metadata/result integrity check in ${key}`,
      });
    }

    if (!sCanonical.startsWith('https://shadtools.com/units/')) {
      issues.push({
        type: 'error',
        message: `Sampled SEO canonical '${sCanonical}' format invalid in ${key}`,
      });
    }
  }

  // 4. Check nearby variants, breadcrumb parents, and compositional section links
  for (const variantData of staticPages) {
    const currentSlug = module.seoPages.getSlug(variantData);

    // Nearby variants links
    const nearby = module.seoPages.getNearbyVariants
      ? module.seoPages.getNearbyVariants(variantData)
      : [];

    for (const nv of nearby) {
      const nvSlug = module.seoPages.getSlug(nv);
      const nvPath = getVariantUrl(namespace, toolSlug, nvSlug);
      if (!generatedRoutes.has(nvPath)) {
        issues.push({
          type: 'error',
          message: `Nearby link points to nonexistent generated route: '${nvPath}'`,
          context: `From ${key}:${currentSlug}`,
        });
      }
    }

    // Breadcrumb parent link
    if (module.seoPages.getBreadcrumbParent) {
      const bp = module.seoPages.getBreadcrumbParent(variantData);
      if (bp) {
        const bpPath = getVariantUrl(namespace, toolSlug, bp.slug);
        if (!generatedRoutes.has(bpPath)) {
          issues.push({
            type: 'error',
            message: `Breadcrumb parent link points to nonexistent generated route: '${bpPath}'`,
            context: `From ${key}:${currentSlug}`,
          });
        }
      }
    }

    // Compositional section links (table rows & link pills)
    if (module.seoPages.getSections) {
      const sections = module.seoPages.getSections(variantData);
      if (sections) {
        for (const sec of sections) {
          if (sec.type === 'table' && sec.table) {
            for (const row of sec.table.rows) {
              if (row.slug) {
                const rowPath = getVariantUrl(namespace, toolSlug, row.slug);
                if (!generatedRoutes.has(rowPath)) {
                  issues.push({
                    type: 'error',
                    message: `Section table row link points to nonexistent generated route: '${rowPath}'`,
                    context: `From ${key}:${currentSlug}`,
                  });
                }
              }
            }
          } else if (sec.type === 'links' && sec.links) {
            for (const link of sec.links) {
              if (link.slug) {
                const linkPath = getVariantUrl(namespace, toolSlug, link.slug);
                if (!generatedRoutes.has(linkPath)) {
                  issues.push({
                    type: 'error',
                    message: `Section link pill points to nonexistent generated route: '${linkPath}'`,
                    context: `From ${key}:${currentSlug}`,
                  });
                }
              }
            }
          }
        }
      }
    }
  }
}

// Print results
const errors = issues.filter((i) => i.type === 'error');
const warnings = issues.filter((i) => i.type === 'warning');

if (warnings.length > 0) {
  console.warn(`⚠️  SEO Warnings (${warnings.length}):`);
  warnings.forEach((w) => {
    console.warn(`  - ${w.message}${w.context ? ` (${w.context})` : ''}`);
  });
  console.log('');
}

if (errors.length > 0) {
  console.error(`❌ SEO Integrity Validation Failed with ${errors.length} error(s):`);
  errors.forEach((e) => {
    console.error(`  - ${e.message}${e.context ? ` (${e.context})` : ''}`);
  });
  process.exit(1);
} else {
  console.log(
    `✅ SEO & Indexing Validation passed cleanly!\n` +
      `   - Checked ${generatedRoutes.size} total static routes across ${toolModules.length} tools.\n` +
      `   - ${indexableRouteCount} indexable SEO routes verified.\n` +
      `   - Deterministic route sampling passed across all SEO page providers.`
  );
}

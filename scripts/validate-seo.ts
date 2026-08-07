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

console.log('🔍 Running ShadTools SEO & Route Integrity Validator...\n');

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

// Register tool main pages and namespaces
for (const { key } of toolModules) {
  const [namespace, toolSlug] = key.split('/');
  const toolUrl = getToolUrl(namespace, toolSlug);
  const nsUrl = getNamespaceUrl(namespace);

  if (canonicalUrls.has(toolUrl)) {
    issues.push({
      type: 'error',
      message: `Duplicate tool URL: ${toolUrl}`,
      context: `Tool ${key} conflicts with ${canonicalUrls.get(toolUrl)}`,
    });
  } else {
    canonicalUrls.set(toolUrl, `Tool: ${key}`);
    generatedRoutes.add(toolUrl);
  }

  generatedRoutes.add(nsUrl);
}

// 2. Validate all SEO-enabled tools & variant pages
const seoTools = toolModules.filter(({ module }) => module.seoPages != null);

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

    if (!variantSlug) {
      issues.push({ type: 'error', message: `Empty variant slug in tool ${key}` });
      continue;
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

  // Check nearby variants links
  for (const variantData of staticPages) {
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
          context: `From ${key}:${module.seoPages.getSlug(variantData)}`,
        });
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
  console.log(`✅ SEO Validation passed cleanly! Checked ${generatedRoutes.size} routes across ${toolModules.length} tools.`);
}

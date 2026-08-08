import fs from 'fs';
import path from 'path';

/**
 * Automated Sitemap Integrity Validator
 * Inspects dist/sitemap-index.xml and dist/sitemap-0.xml after build
 * to ensure sitemap matches production indexability requirements.
 */

console.log('🔍 Running ShadTools Production Sitemap Validator...\n');

const distDir = path.join(process.cwd(), 'dist');
if (!fs.existsSync(distDir)) {
  console.warn('⚠️  dist/ directory does not exist yet. Run `npm run build:astro` before validating sitemap.');
  process.exit(0);
}

// Find all sitemap XML files inside dist
function findSitemaps(dir: string): string[] {
  const results: string[] = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...findSitemaps(fullPath));
    } else if (entry.isFile() && entry.name.endsWith('.xml') && entry.name.includes('sitemap')) {
      results.push(fullPath);
    }
  }
  return results;
}

const sitemapFiles = findSitemaps(distDir);
if (sitemapFiles.length === 0) {
  console.error('❌ No sitemap files found in dist/');
  process.exit(1);
}

const sitemapUrls = new Set<string>();
const duplicateUrls: string[] = [];
const invalidOriginUrls: string[] = [];
const queryParamUrls: string[] = [];
const nonIndexableFound: string[] = [];

for (const file of sitemapFiles) {
  const content = fs.readFileSync(file, 'utf-8');
  const matches = content.match(/<loc>(.*?)<\/loc>/g) || [];

  for (const match of matches) {
    const url = match.replace(/<\/?loc>/g, '').trim();

    // Ignore nested sitemap-index references to other xml files
    if (url.endsWith('.xml')) continue;

    if (sitemapUrls.has(url)) {
      duplicateUrls.push(url);
    } else {
      sitemapUrls.add(url);
    }

    if (!url.startsWith('https://shadtools.com')) {
      invalidOriginUrls.push(url);
    }

    if (url.includes('?') || url.includes('#')) {
      queryParamUrls.push(url);
    }

    if (url.includes('/404') || url.includes('/draft') || url.includes('localhost')) {
      nonIndexableFound.push(url);
    }
  }
}

const errors: string[] = [];

if (duplicateUrls.length > 0) {
  errors.push(`Found ${duplicateUrls.length} duplicate URL(s) in sitemap, e.g.: ${duplicateUrls[0]}`);
}

if (invalidOriginUrls.length > 0) {
  errors.push(`Found ${invalidOriginUrls.length} URL(s) with invalid origin in sitemap, e.g.: ${invalidOriginUrls[0]}`);
}

if (queryParamUrls.length > 0) {
  errors.push(`Found ${queryParamUrls.length} URL(s) containing query params/hash in sitemap, e.g.: ${queryParamUrls[0]}`);
}

if (nonIndexableFound.length > 0) {
  errors.push(`Found ${nonIndexableFound.length} non-indexable/internal URL(s) in sitemap, e.g.: ${nonIndexableFound[0]}`);
}

if (errors.length > 0) {
  console.error('❌ Sitemap Validation Failed:');
  errors.forEach((err) => console.error(`  - ${err}`));
  process.exit(1);
} else {
  console.log(`✅ Sitemap Validation passed cleanly! Verified ${sitemapUrls.size} sitemap URLs across ${sitemapFiles.length} sitemap files.`);
}

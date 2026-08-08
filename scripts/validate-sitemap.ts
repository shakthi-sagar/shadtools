import fs from 'fs';
import path from 'path';
import {
  getSitemapGroup,
  isIndexablePath,
  normalizeSitePath,
} from '../src/lib/seo/indexability.js';
import {
  SITE_ORIGIN,
  extractLocs,
  findFiles,
  hasNoindexMeta,
  htmlFileToRoute,
} from './sitemap-helpers';

console.log('Running ShadTools Production Sitemap Validator...\n');

const distDir = path.join(process.cwd(), 'dist');
const indexPath = path.join(distDir, 'sitemap-index.xml');
const errors: string[] = [];

if (!fs.existsSync(indexPath)) {
  console.error('Missing dist/sitemap-index.xml. Run `npm run build:sitemaps` first.');
  process.exit(1);
}

const htmlFiles = findFiles(distDir, (name) => name.endsWith('.html'));
const htmlRoutes = new Set<string>();
const noindexRoutes = new Set<string>();

for (const file of htmlFiles) {
  const route = htmlFileToRoute(file, distDir);
  htmlRoutes.add(route);

  if (hasNoindexMeta(fs.readFileSync(file, 'utf8'))) {
    noindexRoutes.add(route);
  }
}

const childUrls = extractLocs(fs.readFileSync(indexPath, 'utf8'));
const childFiles = new Set<string>();

for (const childUrl of childUrls) {
  try {
    const parsed = new URL(childUrl);
    const fileName = path.posix.basename(parsed.pathname);

    if (parsed.origin !== SITE_ORIGIN || parsed.search || parsed.hash) {
      errors.push(`Invalid child sitemap URL in index: ${childUrl}`);
    }
    if (!/^sitemap-(?!index\.xml$).+\.xml$/.test(fileName)) {
      errors.push(`Invalid child sitemap filename in index: ${fileName}`);
    }
    if (childFiles.has(fileName)) {
      errors.push(`Duplicate child sitemap in index: ${fileName}`);
    }

    childFiles.add(fileName);
  } catch {
    errors.push(`Malformed child sitemap URL in index: ${childUrl}`);
  }
}

const actualChildFiles = new Set(
  fs.readdirSync(distDir).filter((name) => /^sitemap-(?!index\.xml$).+\.xml$/.test(name))
);

for (const fileName of childFiles) {
  if (!actualChildFiles.has(fileName)) errors.push(`Referenced child sitemap is missing: ${fileName}`);
}
for (const fileName of actualChildFiles) {
  if (!childFiles.has(fileName)) errors.push(`Child sitemap is not referenced by the index: ${fileName}`);
}

const sitemapUrls = new Set<string>();
const sitemapRoutes = new Set<string>();
const groupCounts = new Map<string, number>();

for (const fileName of childFiles) {
  const filePath = path.join(distDir, fileName);
  if (!fs.existsSync(filePath)) continue;

  const group = fileName.slice('sitemap-'.length, -'.xml'.length);
  const urls = extractLocs(fs.readFileSync(filePath, 'utf8'));
  groupCounts.set(group, urls.length);

  if (urls.length > 50_000) errors.push(`${fileName} exceeds Google's 50,000 URL limit.`);

  for (const url of urls) {
    if (sitemapUrls.has(url)) errors.push(`Duplicate sitemap URL: ${url}`);
    sitemapUrls.add(url);

    let parsed: URL;
    try {
      parsed = new URL(url);
    } catch {
      errors.push(`Malformed sitemap URL in ${fileName}: ${url}`);
      continue;
    }

    if (parsed.origin !== SITE_ORIGIN) errors.push(`Invalid origin in ${fileName}: ${url}`);
    if (parsed.search || parsed.hash) errors.push(`Query or hash in ${fileName}: ${url}`);

    const route = normalizeSitePath(parsed.pathname);
    sitemapRoutes.add(route);

    if (!isIndexablePath(route) || noindexRoutes.has(route)) {
      errors.push(`Noindex route appears in ${fileName}: ${route}`);
    }
    if (getSitemapGroup(route) !== group) {
      errors.push(`Route is in the wrong sitemap (${fileName}): ${route}`);
    }
  }
}

const indexableHtmlRoutes = new Set(
  [...htmlRoutes].filter((route) => isIndexablePath(route) && !noindexRoutes.has(route))
);
const missingRoutes = [...indexableHtmlRoutes].filter((route) => !sitemapRoutes.has(route));
const unknownRoutes = [...sitemapRoutes].filter((route) => !htmlRoutes.has(route));

if (childFiles.size === 0) errors.push('Sitemap index does not reference any child sitemaps.');
if (missingRoutes.length > 0) {
  errors.push(`Sitemaps are missing ${missingRoutes.length} indexable route(s), e.g. ${missingRoutes[0]}`);
}
if (unknownRoutes.length > 0) {
  errors.push(`Sitemaps contain ${unknownRoutes.length} route(s) without built HTML, e.g. ${unknownRoutes[0]}`);
}
if (sitemapRoutes.size !== indexableHtmlRoutes.size) {
  errors.push(
    `Sitemaps have ${sitemapRoutes.size} routes, but the build has ${indexableHtmlRoutes.size} indexable HTML routes.`
  );
}

if (errors.length > 0) {
  console.error('Sitemap validation failed:');
  errors.forEach((error) => console.error(`  - ${error}`));
  process.exit(1);
}

console.log(
  `Sitemap validation passed: ${sitemapRoutes.size} indexable routes across ` +
    `${childFiles.size} grouped sitemaps; ${noindexRoutes.size} noindex routes excluded.`
);
for (const [group, count] of [...groupCounts].sort()) {
  console.log(`  - ${group}: ${count}`);
}

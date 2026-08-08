import fs from 'fs';
import path from 'path';
import { isIndexablePath, normalizeSitePath } from '../src/lib/seo/indexability.js';

console.log('Running ShadTools Production Sitemap Validator...\n');

const distDir = path.join(process.cwd(), 'dist');

if (!fs.existsSync(distDir)) {
  console.error('Sitemap validation requires dist/. Run `npm run build:astro` first.');
  process.exit(1);
}

function findFiles(dir: string, predicate: (name: string) => boolean): string[] {
  const results: string[] = [];

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      results.push(...findFiles(fullPath, predicate));
    } else if (entry.isFile() && predicate(entry.name)) {
      results.push(fullPath);
    }
  }

  return results;
}

function htmlFileToRoute(file: string): string {
  const relative = path.relative(distDir, file).split(path.sep).join('/');

  if (relative === 'index.html') return '/';
  if (relative.endsWith('/index.html')) {
    return normalizeSitePath(`/${relative.slice(0, -'/index.html'.length)}`);
  }

  return normalizeSitePath(`/${relative.slice(0, -'.html'.length)}`);
}

function hasNoindexMeta(html: string): boolean {
  const metaTags = html.match(/<meta\s+[^>]*>/gi) ?? [];

  return metaTags.some((tag) => {
    const name = tag.match(/\bname=["']([^"']*)["']/i)?.[1]?.toLowerCase();
    const content = tag.match(/\bcontent=["']([^"']*)["']/i)?.[1]?.toLowerCase();
    return name === 'robots' && content?.split(',').some((value) => value.trim() === 'noindex');
  });
}

const sitemapFiles = findFiles(
  distDir,
  (name) => name.endsWith('.xml') && name.includes('sitemap')
);

if (sitemapFiles.length === 0) {
  console.error('No sitemap files found in dist/.');
  process.exit(1);
}

const htmlFiles = findFiles(distDir, (name) => name.endsWith('.html'));
const htmlRoutes = new Set<string>();
const noindexRoutes = new Set<string>();

for (const file of htmlFiles) {
  const route = htmlFileToRoute(file);
  htmlRoutes.add(route);

  if (hasNoindexMeta(fs.readFileSync(file, 'utf8'))) {
    noindexRoutes.add(route);
  }
}

const sitemapUrls = new Set<string>();
const duplicateUrls: string[] = [];
const invalidOriginUrls: string[] = [];
const queryParamUrls: string[] = [];
const nonIndexableUrls: string[] = [];
const sitemapRoutes = new Set<string>();

for (const file of sitemapFiles) {
  const content = fs.readFileSync(file, 'utf8');
  const matches = content.match(/<loc>(.*?)<\/loc>/g) ?? [];

  for (const match of matches) {
    const url = match.replace(/<\/?loc>/g, '').trim();

    if (url.endsWith('.xml')) continue;

    if (sitemapUrls.has(url)) duplicateUrls.push(url);
    sitemapUrls.add(url);

    let parsed: URL;
    try {
      parsed = new URL(url);
    } catch {
      invalidOriginUrls.push(url);
      continue;
    }

    if (parsed.origin !== 'https://shadtools.com') invalidOriginUrls.push(url);
    if (parsed.search || parsed.hash) queryParamUrls.push(url);

    const route = normalizeSitePath(parsed.pathname);
    sitemapRoutes.add(route);
    if (!isIndexablePath(route) || noindexRoutes.has(route)) {
      nonIndexableUrls.push(url);
    }
  }
}

const indexableHtmlRoutes = new Set(
  [...htmlRoutes].filter((route) => isIndexablePath(route) && !noindexRoutes.has(route))
);
const missingRoutes = [...indexableHtmlRoutes].filter((route) => !sitemapRoutes.has(route));
const unknownRoutes = [...sitemapRoutes].filter((route) => !htmlRoutes.has(route));
const errors: string[] = [];

if (duplicateUrls.length > 0) {
  errors.push(`Found ${duplicateUrls.length} duplicate URL(s), e.g. ${duplicateUrls[0]}`);
}
if (invalidOriginUrls.length > 0) {
  errors.push(`Found ${invalidOriginUrls.length} URL(s) with an invalid origin, e.g. ${invalidOriginUrls[0]}`);
}
if (queryParamUrls.length > 0) {
  errors.push(`Found ${queryParamUrls.length} URL(s) containing a query or hash, e.g. ${queryParamUrls[0]}`);
}
if (nonIndexableUrls.length > 0) {
  errors.push(`Found ${nonIndexableUrls.length} noindex URL(s) in the sitemap, e.g. ${nonIndexableUrls[0]}`);
}
if (missingRoutes.length > 0) {
  errors.push(`Sitemap is missing ${missingRoutes.length} indexable route(s), e.g. ${missingRoutes[0]}`);
}
if (unknownRoutes.length > 0) {
  errors.push(`Sitemap contains ${unknownRoutes.length} route(s) without built HTML, e.g. ${unknownRoutes[0]}`);
}
if (sitemapRoutes.size !== indexableHtmlRoutes.size) {
  errors.push(
    `Sitemap has ${sitemapRoutes.size} routes, but the build has ${indexableHtmlRoutes.size} indexable HTML routes.`
  );
}

if (errors.length > 0) {
  console.error('Sitemap validation failed:');
  errors.forEach((error) => console.error(`  - ${error}`));
  process.exit(1);
}

console.log(
  `Sitemap validation passed: ${sitemapRoutes.size} indexable routes, ` +
    `${noindexRoutes.size} noindex routes excluded, ${sitemapFiles.length} sitemap files checked.`
);

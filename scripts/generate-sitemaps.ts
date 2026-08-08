import fs from 'fs';
import path from 'path';
import { getSitemapGroup, isIndexablePath } from '../src/lib/seo/indexability.js';
import {
  SITE_ORIGIN,
  buildSitemapIndex,
  buildUrlSet,
  findFiles,
  hasNoindexMeta,
  htmlFileToRoute,
  routeToSiteUrl,
} from './sitemap-helpers';

const distDir = path.join(process.cwd(), 'dist');
const maxUrlsPerSitemap = 50_000;

if (!fs.existsSync(distDir)) {
  console.error('Sitemap generation requires dist/. Run `npm run build:astro` first.');
  process.exit(1);
}

const groups = new Map<string, string[]>();
const htmlFiles = findFiles(distDir, (name) => name.endsWith('.html'));

for (const file of htmlFiles) {
  const route = htmlFileToRoute(file, distDir);
  const html = fs.readFileSync(file, 'utf8');

  if (!isIndexablePath(route) || hasNoindexMeta(html)) continue;

  const group = getSitemapGroup(route);
  const urls = groups.get(group) ?? [];
  urls.push(routeToSiteUrl(route));
  groups.set(group, urls);
}

const groupNames = [...groups.keys()].sort((a, b) => {
  const priority = (name: string) => (name === 'core' ? 0 : name === 'tools' ? 1 : 2);
  return priority(a) - priority(b) || a.localeCompare(b);
});

for (const name of fs.readdirSync(distDir)) {
  if (/^sitemap(?:-.*)?\.xml$/.test(name)) {
    fs.unlinkSync(path.join(distDir, name));
  }
}

const childUrls: string[] = [];

for (const group of groupNames) {
  const urls = groups.get(group)!.sort();

  if (urls.length > maxUrlsPerSitemap) {
    console.error(`Sitemap group "${group}" exceeds ${maxUrlsPerSitemap} URLs.`);
    process.exit(1);
  }

  const fileName = `sitemap-${group}.xml`;
  fs.writeFileSync(path.join(distDir, fileName), buildUrlSet(urls), 'utf8');
  childUrls.push(`${SITE_ORIGIN}/${fileName}`);
}

fs.writeFileSync(
  path.join(distDir, 'sitemap-index.xml'),
  buildSitemapIndex(childUrls),
  'utf8'
);

const totalUrls = [...groups.values()].reduce((total, urls) => total + urls.length, 0);
console.log(`Generated ${groupNames.length} grouped sitemaps with ${totalUrls} indexable URLs:`);
for (const group of groupNames) {
  console.log(`  - sitemap-${group}.xml: ${groups.get(group)!.length}`);
}

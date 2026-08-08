import fs from 'fs';
import path from 'path';
import { normalizeSitePath } from '../src/lib/seo/indexability.js';

export const SITE_ORIGIN = 'https://shadtools.com';

export function findFiles(dir: string, predicate: (name: string) => boolean): string[] {
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

export function htmlFileToRoute(file: string, distDir: string): string {
  const relative = path.relative(distDir, file).split(path.sep).join('/');

  if (relative === 'index.html') return '/';
  if (relative.endsWith('/index.html')) {
    return normalizeSitePath(`/${relative.slice(0, -'/index.html'.length)}`);
  }

  return normalizeSitePath(`/${relative.slice(0, -'.html'.length)}`);
}

export function hasNoindexMeta(html: string): boolean {
  const metaTags = html.match(/<meta\s+[^>]*>/gi) ?? [];

  return metaTags.some((tag) => {
    const name = tag.match(/\bname=["']([^"']*)["']/i)?.[1]?.toLowerCase();
    const content = tag.match(/\bcontent=["']([^"']*)["']/i)?.[1]?.toLowerCase();
    return name === 'robots' && content?.split(',').some((value) => value.trim() === 'noindex');
  });
}

export function routeToSiteUrl(route: string): string {
  const normalized = normalizeSitePath(route);
  return normalized === '/' ? `${SITE_ORIGIN}/` : `${SITE_ORIGIN}${normalized}/`;
}

export function extractLocs(xml: string): string[] {
  return (xml.match(/<loc>(.*?)<\/loc>/g) ?? []).map((match) =>
    match.replace(/<\/?loc>/g, '').trim()
  );
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export function buildUrlSet(urls: string[]): string {
  const entries = urls.map((url) => `<url><loc>${escapeXml(url)}</loc></url>`).join('');
  return `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${entries}</urlset>`;
}

export function buildSitemapIndex(urls: string[]): string {
  const entries = urls.map((url) => `<sitemap><loc>${escapeXml(url)}</loc></sitemap>`).join('');
  return `<?xml version="1.0" encoding="UTF-8"?><sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${entries}</sitemapindex>`;
}

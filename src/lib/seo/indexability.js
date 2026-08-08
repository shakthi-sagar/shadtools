const NON_INDEXABLE_PATHS = new Set(['/404', '/search']);

export function normalizeSitePath(value) {
  const pathname = new URL(value, 'https://shadtools.com').pathname;
  return pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname;
}

export function isIndexablePath(value) {
  return !NON_INDEXABLE_PATHS.has(normalizeSitePath(value));
}

export function getSitemapGroup(value) {
  const segments = normalizeSitePath(value).split('/').filter(Boolean);

  if (segments.length <= 1) return 'core';
  if (segments.length === 2) return 'tools';

  return `${segments[0]}-${segments[1]}`;
}

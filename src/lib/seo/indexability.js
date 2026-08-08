const NON_INDEXABLE_PATHS = new Set(['/404', '/search']);

export function normalizeSitePath(value) {
  const pathname = new URL(value, 'https://shadtools.com').pathname;
  return pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname;
}

export function isIndexablePath(value) {
  return !NON_INDEXABLE_PATHS.has(normalizeSitePath(value));
}

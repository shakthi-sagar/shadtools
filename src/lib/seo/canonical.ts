export function buildCanonicalUrl(path: string, domain = 'https://shadtools.com'): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${domain}${cleanPath}`;
}

export function parseRouteIdentity(pathname: string): { namespace?: string; slug?: string } {
  const clean = pathname.replace(/^\/+|\/+$/g, '');
  if (!clean) return {};
  const parts = clean.split('/');
  return {
    namespace: parts[0],
    slug: parts[1],
  };
}

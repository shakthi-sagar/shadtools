// Barrel re-export so `from '@/lib/lib/routing'` continues to work
export { getCleanSlug, getNamespaceSlug, getToolSlug } from '@/lib/routing/entry-slug';
export type { IdentifiableEntry } from '@/lib/routing/entry-slug';
export { getToolUrl, getNamespaceUrl, getVariantUrl } from '@/lib/routing/urls';
export { parseRouteIdentity } from '@/lib/routing/route-identity';

// Barrel re-export so `from '../lib/routing'` continues to work
export { getCleanSlug, getNamespaceSlug, getToolSlug } from './entry-slug';
export type { IdentifiableEntry } from './entry-slug';
export { getToolUrl, getNamespaceUrl, getVariantUrl } from './urls';
export { parseRouteIdentity } from './route-identity';

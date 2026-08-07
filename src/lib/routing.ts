export interface IdentifiableEntry {
  id: string;
  slug?: string;
}

export function getCleanSlug(entry: IdentifiableEntry): string {
  const raw = entry.slug || entry.id;
  return raw.replace(/\.md$/, '');
}

export function getNamespaceSlug(entry: IdentifiableEntry): string {
  const clean = getCleanSlug(entry);
  return clean.split('/')[0];
}

export function getToolSlug(entry: IdentifiableEntry): string {
  const clean = getCleanSlug(entry);
  const parts = clean.split('/');
  return parts.length > 1 ? parts[1] : parts[0];
}

export function getToolUrl(namespace: string, slug: string): string {
  return `/${namespace}/${slug}`;
}

export function getNamespaceUrl(namespace: string): string {
  return `/${namespace}`;
}

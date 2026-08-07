export interface IdentifiableEntry {
  id: string;
  slug?: string;
}

/** Strip .md extension and return clean slug from a content collection entry */
export function getCleanSlug(entry: IdentifiableEntry): string {
  const raw = entry.slug || entry.id;
  return raw.replace(/\.md$/, '');
}

/** Extract the namespace portion (first path segment) from a content entry */
export function getNamespaceSlug(entry: IdentifiableEntry): string {
  const clean = getCleanSlug(entry);
  return clean.split('/')[0];
}

/** Extract the tool slug (second path segment) from a content entry */
export function getToolSlug(entry: IdentifiableEntry): string {
  const clean = getCleanSlug(entry);
  const parts = clean.split('/');
  return parts.length > 1 ? parts[1] : parts[0];
}

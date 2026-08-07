import { getCollection, type CollectionEntry } from 'astro:content';

export async function getAllNamespaces() {
  const collections = await getCollection('namespaces');
  return collections.map((ns: CollectionEntry<'namespaces'>) => ({
    id: ns.slug,
    name: ns.data.name,
    summary: ns.data.summary,
    slug: ns.slug,
  }));
}

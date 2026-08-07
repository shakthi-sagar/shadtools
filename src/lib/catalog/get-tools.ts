import { getCollection, type CollectionEntry } from 'astro:content';
import { getNamespaceSlug, getToolSlug } from '@/lib/routing';

export async function getAllPublishedTools() {
  const tools = await getCollection('tools', ({ data }: CollectionEntry<'tools'>) => data.status === 'published');
  return tools.map((t: CollectionEntry<'tools'>) => {
    const namespace = getNamespaceSlug(t);
    const slug = getToolSlug(t);
    return {
      ...t.data,
      id: t.slug,
      namespace,
      slug,
    };
  });
}

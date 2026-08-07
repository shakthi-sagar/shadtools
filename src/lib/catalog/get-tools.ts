import { getCollection } from 'astro:content';

export async function getAllPublishedTools() {
  const tools = await getCollection('tools', ({ data }) => data.status === 'published');
  return tools.map((t) => {
    const parts = t.slug.split('/');
    const namespace = parts[0];
    const slug = parts.length > 1 ? parts[1] : parts[0];
    return {
      ...t.data,
      id: t.slug,
      namespace,
      slug,
    };
  });
}

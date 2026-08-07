import { getAllPublishedTools } from './get-tools';

export async function resolveRelatedTools(relatedKeys: string[]) {
  const allTools = await getAllPublishedTools();
  return allTools.filter((t: { namespace: string; slug: string }) => relatedKeys.includes(`${t.namespace}/${t.slug}`));
}

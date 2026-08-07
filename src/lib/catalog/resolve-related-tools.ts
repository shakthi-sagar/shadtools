import { getAllPublishedTools } from './get-tools';

export async function resolveRelatedTools(relatedKeys: string[]) {
  const allTools = await getAllPublishedTools();
  return allTools.filter((t) => relatedKeys.includes(`${t.namespace}/${t.slug}`));
}

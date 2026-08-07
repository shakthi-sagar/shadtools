export function getToolUrl(namespace: string, slug: string): string {
  return `/${namespace}/${slug}`;
}

export function getNamespaceUrl(namespace: string): string {
  return `/${namespace}`;
}

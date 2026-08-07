export function getToolUrl(namespace: string, slug: string): string {
  return `/${namespace}/${slug}`;
}

export function getNamespaceUrl(namespace: string): string {
  return `/${namespace}`;
}

export function getVariantUrl(namespace: string, slug: string, variant: string): string {
  return `/${namespace}/${slug}/${variant}`;
}

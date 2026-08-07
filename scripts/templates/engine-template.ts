export function getEngineTemplate(slug: string): string {
  return `export function process${slug.replace(/(^|-)([a-z])/g, (_, __, c) => c.toUpperCase())}(input: string): { success: boolean; output: string } {
  return { success: true, output: input };
}
`;
}

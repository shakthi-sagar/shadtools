export function getTestTemplate(slug: string): string {
  return `import { describe, it, expect } from 'vitest';

describe('${slug} engine', () => {
  it('processes input correctly', () => {
    expect(true).toBe(true);
  });
});
`;
}

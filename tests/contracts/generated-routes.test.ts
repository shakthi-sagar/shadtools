import { describe, it, expect } from 'vitest';
import { getCollection } from 'astro:content';

describe('Generated Routes Contract Test', () => {
  it('validates tools and namespaces collections exist', async () => {
    const namespaces = await getCollection('namespaces');
    const tools = await getCollection('tools');
    expect(namespaces.length).toBeGreaterThan(0);
    expect(tools.length).toBeGreaterThan(0);
  });
});

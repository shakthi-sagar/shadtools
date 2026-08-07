import { describe, it, expect } from 'vitest';
import { generateSlug } from './slug-generator';

describe('Slug Generator Engine', () => {
  it('converts title text into URL-safe slug', () => {
    const slug = generateSlug('Hello World! 2026');
    expect(slug).toBe('hello-world-2026');
  });

  it('supports custom separators', () => {
    const slug = generateSlug('Hello World', { separator: '_' });
    expect(slug).toBe('hello_world');
  });
});

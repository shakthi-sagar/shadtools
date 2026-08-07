import { describe, it, expect } from 'vitest';
import { sortLines } from './sort-lines';

describe('Sort Lines Engine', () => {
  it('sorts lines alphabetically', () => {
    const sorted = sortLines('c\na\nb', 'alphabetical-asc');
    expect(sorted).toBe('a\nb\nc');
  });

  it('deduplicates lines when enabled', () => {
    const sorted = sortLines('a\na\nb', 'alphabetical-asc', true);
    expect(sorted).toBe('a\nb');
  });
});

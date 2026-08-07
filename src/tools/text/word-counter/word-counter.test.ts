import { describe, it, expect } from 'vitest';
import { countTextStats } from './word-counter';

describe('Word Counter Engine', () => {
  it('counts words and characters accurately', () => {
    const stats = countTextStats('Hello world from ShadTools.');
    expect(stats.words).toBe(4);
    expect(stats.characters).toBe(27);
    expect(stats.sentences).toBe(1);
  });

  it('handles empty input gracefully', () => {
    const stats = countTextStats('');
    expect(stats.words).toBe(0);
    expect(stats.characters).toBe(0);
  });
});

import { describe, it, expect } from 'vitest';
import { computeLineDiff } from '@/tools/text/diff/diff';

describe('Text Diff Engine', () => {
  it('identifies unchanged text', () => {
    const res = computeLineDiff('hello\nworld', 'hello\nworld');
    expect(res.additionsCount).toBe(0);
    expect(res.deletionsCount).toBe(0);
    expect(res.lines.length).toBe(2);
  });

  it('identifies added and removed lines', () => {
    const res = computeLineDiff('line 1\nline 2', 'line 1\nline 2 added');
    expect(res.lines.some((l) => l.type === 'removed')).toBe(true);
    expect(res.lines.some((l) => l.type === 'added')).toBe(true);
  });
});

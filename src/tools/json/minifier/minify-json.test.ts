import { describe, it, expect } from 'vitest';
import { minifyJson } from './minify-json';

describe('JSON Minifier Engine', () => {
  it('minifies formatted JSON correctly', () => {
    const input = `{\n  "a": 1,\n  "b": [2, 3]\n}`;
    const res = minifyJson(input);
    expect(res.output).toBe('{"a":1,"b":[2,3]}');
    expect(res.error).toBeUndefined();
  });

  it('reports syntax errors with line/column information', () => {
    const input = `{\n  "a": 1,\n  "b": \n}`;
    const res = minifyJson(input);
    expect(res.output).toBe('');
    expect(res.error).toBeDefined();
    expect(res.error?.message).toContain('Syntax error');
  });

  it('handles empty input gracefully', () => {
    const res = minifyJson('   ');
    expect(res.output).toBe('');
    expect(res.error).toBeUndefined();
  });
});

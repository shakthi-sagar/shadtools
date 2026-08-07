import { describe, it, expect } from 'vitest';
import { validateJson } from './validate-json';

describe('JSON Validator Engine', () => {
  it('validates correct JSON and calculates stats', () => {
    const res = validateJson('{"a": 1, "b": [2, 3]}');
    expect(res.isValid).toBe(true);
    expect(res.stats?.keysCount).toBeGreaterThan(0);
  });

  it('detects syntax error position in malformed JSON', () => {
    const res = validateJson('{\n  "name": "test",\n}');
    expect(res.isValid).toBe(false);
    expect(res.error).toBeDefined();
  });
});

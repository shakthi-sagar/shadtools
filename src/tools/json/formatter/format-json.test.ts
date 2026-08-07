import { describe, it, expect } from 'vitest';
import { formatJson, minifyJson } from './format-json';

describe('formatJson', () => {
  it('formats raw valid JSON into indented string', () => {
    const raw = '{"a":1,"b":true}';
    const result = formatJson(raw, 2);
    expect(result.success).toBe(true);
    expect(result.output).toBe('{\n  "a": 1,\n  "b": true\n}');
  });

  it('handles invalid JSON gracefully', () => {
    const raw = '{"a":1,';
    const result = formatJson(raw);
    expect(result.success).toBe(false);
    expect(result.error).toBeTruthy();
  });
});

describe('minifyJson', () => {
  it('minifies formatted JSON string', () => {
    const formatted = '{\n  "a": 1\n}';
    const result = minifyJson(formatted);
    expect(result.success).toBe(true);
    expect(result.output).toBe('{"a":1}');
  });
});

import { describe, it, expect } from 'vitest';
import { formatJson, minifyJson } from '../../src/lib/jsonEngine';
import { encodeBase64, decodeBase64 } from '../../src/lib/base64Engine';
import { intToRoman, romanToInt } from '../../src/lib/romanEngine';
import { convertUnit, LENGTH_UNITS } from '../../src/lib/unitEngine';

describe('JSON Engine', () => {
  it('formats valid JSON correctly', () => {
    const raw = '{"a":1,"b":true}';
    const res = formatJson(raw, 2);
    expect(res.success).toBe(true);
    expect(res.output).toBe('{\n  "a": 1,\n  "b": true\n}');
  });

  it('minifies JSON correctly', () => {
    const raw = '{\n  "a": 1,\n  "b": true\n}';
    const res = minifyJson(raw);
    expect(res.success).toBe(true);
    expect(res.output).toBe('{"a":1,"b":true}');
  });

  it('handles invalid JSON gracefully', () => {
    const res = formatJson('{invalid_json}');
    expect(res.success).toBe(false);
    expect(res.error).toBeDefined();
  });
});

describe('Base64 Engine', () => {
  it('encodes text to Base64', () => {
    const res = encodeBase64('ShadTools');
    expect(res.success).toBe(true);
    expect(res.output).toBe('U2hhZFRvb2xz');
  });

  it('decodes Base64 to text', () => {
    const res = decodeBase64('U2hhZFRvb2xz');
    expect(res.success).toBe(true);
    expect(res.output).toBe('ShadTools');
  });
});

describe('Roman Numeral Engine', () => {
  it('converts integers to Roman numerals', () => {
    expect(intToRoman(2026)).toBe('MMXXVI');
    expect(intToRoman(1)).toBe('I');
    expect(intToRoman(3999)).toBe('MMMCMXCIX');
  });

  it('converts Roman numerals to integers', () => {
    expect(romanToInt('MMXXVI')).toBe(2026);
    expect(romanToInt('I')).toBe(1);
  });
});

describe('Unit Conversion Engine', () => {
  it('converts meters to feet correctly', () => {
    const result = convertUnit(1, 'm', 'ft', LENGTH_UNITS);
    expect(result).toBeCloseTo(3.28084, 4);
  });
});

import { describe, it, expect } from 'vitest';
import { convertUnit, LENGTH_UNITS } from '@/tools/units/length/convert-length';

describe('Length Converter Engine', () => {
  it('converts meters to feet correctly', () => {
    const result = convertUnit(1, 'm', 'ft', LENGTH_UNITS);
    expect(result).toBeCloseTo(3.28084, 4);
  });

  it('converts kilometers to meters correctly', () => {
    const result = convertUnit(2, 'km', 'm', LENGTH_UNITS);
    expect(result).toBe(2000);
  });
});

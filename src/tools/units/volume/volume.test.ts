import { describe, it, expect } from 'vitest';
import { convertVolume } from './volume';

describe('Volume Conversion Engine', () => {
  it('converts liters to gallons correctly', () => {
    const res = convertVolume(3.78541, 'liter', 'gallon');
    expect(res).toBeCloseTo(1, 4);
  });

  it('converts milliliters to fluid ounces correctly', () => {
    const res = convertVolume(100, 'milliliter', 'fluid-ounce');
    expect(res).toBeGreaterThan(3);
    expect(res).toBeLessThan(4);
  });

  it('throws error for invalid units', () => {
    expect(() => convertVolume(1, 'liter', 'invalid')).toThrow();
  });
});

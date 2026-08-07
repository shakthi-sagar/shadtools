import { describe, it, expect } from 'vitest';
import { convertArea } from './area';

describe('Area Engine', () => {
  it('converts square meters to square feet correctly', () => {
    const result = convertArea(1, 'sqm', 'sqft');
    expect(result).toBeCloseTo(10.7639, 3);
  });

  it('converts acres to square feet correctly', () => {
    const result = convertArea(1, 'acre', 'sqft');
    expect(result).toBeCloseTo(43560, 0);
  });

  it('handles invalid input gracefully', () => {
    expect(convertArea(NaN, 'sqm', 'sqft')).toBe(0);
    expect(convertArea(10, 'invalid', 'sqft')).toBe(0);
  });
});

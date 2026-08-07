import { describe, it, expect } from 'vitest';
import { convertWeight } from '@/tools/units/weight/weight';

describe('Weight Converter Engine', () => {
  it('converts kilograms to pounds correctly', () => {
    const res = convertWeight(1, 'kg', 'lb');
    expect(res).toBeCloseTo(2.20462, 4);
  });
});

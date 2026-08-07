import { describe, it, expect } from 'vitest';
import { convertSpeed } from './speed';

describe('Speed Conversion Engine', () => {
  it('converts km/h to mph correctly', () => {
    const res = convertSpeed(100, 'kilometer-per-hour', 'mile-per-hour');
    expect(res).toBeCloseTo(62.1371, 3);
  });

  it('converts m/s to km/h correctly', () => {
    const res = convertSpeed(10, 'meter-per-second', 'kilometer-per-hour');
    expect(res).toBe(36);
  });

  it('converts knots to km/h correctly', () => {
    const res = convertSpeed(1, 'knot', 'kilometer-per-hour');
    expect(res).toBe(1.852);
  });
});

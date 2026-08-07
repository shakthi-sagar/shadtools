import { describe, it, expect } from 'vitest';
import { convertTime } from './time';

describe('Time Conversion Engine', () => {
  it('converts hours to minutes correctly', () => {
    const res = convertTime(1, 'hour', 'minute');
    expect(res).toBe(60);
  });

  it('converts days to hours correctly', () => {
    const res = convertTime(1, 'day', 'hour');
    expect(res).toBe(24);
  });

  it('converts weeks to days correctly', () => {
    const res = convertTime(2, 'week', 'day');
    expect(res).toBe(14);
  });
});

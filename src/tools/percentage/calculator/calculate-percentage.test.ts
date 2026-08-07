import { describe, it, expect } from 'vitest';
import { calcPercentageOf, calcPercentageChange, calcWhatPercentOf } from './calculate-percentage';

describe('Percentage Engine', () => {
  it('calculates percentage of a number', () => {
    expect(calcPercentageOf(15, 200)).toBe(30);
  });

  it('calculates what percent X is of Y', () => {
    expect(calcWhatPercentOf(50, 200)).toBe(25);
  });

  it('calculates percentage change', () => {
    expect(calcPercentageChange(50, 75)).toBe(50);
    expect(calcPercentageChange(100, 50)).toBe(-50);
  });
});

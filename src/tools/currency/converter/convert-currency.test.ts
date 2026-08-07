import { describe, it, expect } from 'vitest';
import { convertCurrency } from '@/tools/currency/converter/convert-currency';

describe('Currency Converter Engine', () => {
  it('converts USD to EUR using rates', () => {
    const rates = { USD: 1.0, EUR: 0.9 };
    const result = convertCurrency(100, 'USD', 'EUR', rates);
    expect(result).toBe(90);
  });

  it('converts EUR to USD using rates', () => {
    const rates = { USD: 1.0, EUR: 0.9 };
    const result = convertCurrency(90, 'EUR', 'USD', rates);
    expect(result).toBeCloseTo(100, 2);
  });
});

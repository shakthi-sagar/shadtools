export interface CurrencyRateData {
  base: string;
  rates: Record<string, number>;
  timestamp: number;
  provider: string;
  isFallback: boolean;
}

export interface CurrencyItem {
  code: string;
  name: string;
}

export const CURRENCIES: CurrencyItem[] = [
  { code: 'USD', name: 'US Dollar' },
  { code: 'EUR', name: 'Euro' },
  { code: 'GBP', name: 'British Pound' },
  { code: 'INR', name: 'Indian Rupee' },
  { code: 'CAD', name: 'Canadian Dollar' },
  { code: 'AUD', name: 'Australian Dollar' },
  { code: 'JPY', name: 'Japanese Yen' },
  { code: 'CNY', name: 'Chinese Yuan' },
  { code: 'BRL', name: 'Brazilian Real' },
];

const FALLBACK_RATES: Record<string, number> = {
  USD: 1.0,
  EUR: 0.92,
  GBP: 0.78,
  INR: 83.95,
  CAD: 1.37,
  AUD: 1.52,
  JPY: 147.5,
  CNY: 7.16,
  BRL: 5.55
};

export async function fetchExchangeRates(): Promise<CurrencyRateData> {
  const cacheKey = 'shadtools_currency_rates_v1';
  
  if (typeof window !== 'undefined') {
    try {
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        const parsed: CurrencyRateData = JSON.parse(cached);
        const age = Date.now() - parsed.timestamp;
        if (age < 3600000) {
          return parsed;
        }
      }
    } catch (e) {
      // Ignore cache errors
    }
  }

  try {
    const res = await fetch('https://open.er-api.com/v6/latest/USD');
    if (res.ok) {
      const data = await res.json();
      const result: CurrencyRateData = {
        base: 'USD',
        rates: data.rates,
        timestamp: Date.now(),
        provider: 'Open Exchange Rates (ER-API)',
        isFallback: false
      };
      if (typeof window !== 'undefined') {
        localStorage.setItem(cacheKey, JSON.stringify(result));
      }
      return result;
    }
  } catch (err) {
    console.warn('Exchange rate API unavailable, utilizing fallback rates:', err);
  }

  return {
    base: 'USD',
    rates: FALLBACK_RATES,
    timestamp: Date.now(),
    provider: 'Offline Static Rates (Fallback)',
    isFallback: true
  };
}

export function convertCurrency(
  amount: number,
  fromCode: string,
  toCode: string,
  ratesData: Record<string, number> = FALLBACK_RATES
): number {
  if (isNaN(amount) || amount <= 0) return 0;
  const fromRate = ratesData[fromCode] || 1;
  const toRate = ratesData[toCode] || 1;
  const inUSD = amount / fromRate;
  return inUSD * toRate;
}

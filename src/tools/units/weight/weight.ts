export interface WeightUnit {
  symbol: string;
  name: string;
  factorInGrams: number;
}

export const WEIGHT_UNITS: Record<string, WeightUnit> = {
  kg: { symbol: 'kg', name: 'Kilograms (kg)', factorInGrams: 1000 },
  g: { symbol: 'g', name: 'Grams (g)', factorInGrams: 1 },
  mg: { symbol: 'mg', name: 'Milligrams (mg)', factorInGrams: 0.001 },
  lb: { symbol: 'lb', name: 'Pounds (lbs)', factorInGrams: 453.59237 },
  oz: { symbol: 'oz', name: 'Ounces (oz)', factorInGrams: 28.349523125 },
  st: { symbol: 'st', name: 'Stone (st)', factorInGrams: 6350.29318 },
};

export function convertWeight(value: number, fromUnit: string, toUnit: string): number {
  if (isNaN(value)) return 0;
  const from = WEIGHT_UNITS[fromUnit];
  const to = WEIGHT_UNITS[toUnit];
  if (!from || !to) return 0;

  const grams = value * from.factorInGrams;
  return grams / to.factorInGrams;
}

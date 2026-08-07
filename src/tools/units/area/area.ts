export interface AreaUnit {
  id: string;
  name: string;
  symbol: string;
  factorInSqMeters: number;
}

export const AREA_UNITS: AreaUnit[] = [
  { id: 'sqm', name: 'Square Meters', symbol: 'm²', factorInSqMeters: 1 },
  { id: 'sqkm', name: 'Square Kilometers', symbol: 'km²', factorInSqMeters: 1000000 },
  { id: 'sqft', name: 'Square Feet', symbol: 'ft²', factorInSqMeters: 0.09290304 },
  { id: 'sqyd', name: 'Square Yards', symbol: 'yd²', factorInSqMeters: 0.83612736 },
  { id: 'sqmi', name: 'Square Miles', symbol: 'mi²', factorInSqMeters: 2589988.110336 },
  { id: 'acre', name: 'Acres', symbol: 'ac', factorInSqMeters: 4046.8564224 },
  { id: 'ha', name: 'Hectares', symbol: 'ha', factorInSqMeters: 10000 },
  { id: 'sqin', name: 'Square Inches', symbol: 'in²', factorInSqMeters: 0.00064516 },
];

export function convertArea(value: number, fromId: string, toId: string): number {
  if (isNaN(value)) return 0;
  const from = AREA_UNITS.find((u) => u.id === fromId);
  const to = AREA_UNITS.find((u) => u.id === toId);
  if (!from || !to) return 0;

  const sqMeters = value * from.factorInSqMeters;
  return sqMeters / to.factorInSqMeters;
}

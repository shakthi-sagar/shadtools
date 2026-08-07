export interface VolumeUnit {
  id: string;
  name: string;
  symbol: string;
  factorInLiters: number;
}

export const VOLUME_UNITS: VolumeUnit[] = [
  { id: 'liter', name: 'Liters', symbol: 'L', factorInLiters: 1 },
  { id: 'milliliter', name: 'Milliliters', symbol: 'mL', factorInLiters: 0.001 },
  { id: 'gallon', name: 'Gallons (US)', symbol: 'gal', factorInLiters: 3.78541 },
  { id: 'quart', name: 'Quarts (US)', symbol: 'qt', factorInLiters: 0.946353 },
  { id: 'pint', name: 'Pints (US)', symbol: 'pt', factorInLiters: 0.473176 },
  { id: 'cup', name: 'Cups (US)', symbol: 'cup', factorInLiters: 0.24 },
  { id: 'fluid-ounce', name: 'Fluid Ounces (US)', symbol: 'fl oz', factorInLiters: 0.0295735 },
  { id: 'cubic-meter', name: 'Cubic Meters', symbol: 'm³', factorInLiters: 1000 },
];

export function convertVolume(value: number, fromId: string, toId: string): number {
  const fromUnit = VOLUME_UNITS.find((u) => u.id === fromId);
  const toUnit = VOLUME_UNITS.find((u) => u.id === toId);

  if (!fromUnit || !toUnit) {
    throw new Error(`Invalid volume unit conversion: ${fromId} to ${toId}`);
  }

  const valueInLiters = value * fromUnit.factorInLiters;
  return valueInLiters / toUnit.factorInLiters;
}

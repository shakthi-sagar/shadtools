export interface SpeedUnit {
  id: string;
  name: string;
  symbol: string;
  factorInKmh: number;
}

export const SPEED_UNITS: SpeedUnit[] = [
  { id: 'kilometer-per-hour', name: 'Kilometers per hour', symbol: 'km/h', factorInKmh: 1 },
  { id: 'mile-per-hour', name: 'Miles per hour', symbol: 'mph', factorInKmh: 1.60934 },
  { id: 'meter-per-second', name: 'Meters per second', symbol: 'm/s', factorInKmh: 3.6 },
  { id: 'knot', name: 'Knots', symbol: 'kn', factorInKmh: 1.852 },
];

export function convertSpeed(value: number, fromId: string, toId: string): number {
  const fromUnit = SPEED_UNITS.find((u) => u.id === fromId);
  const toUnit = SPEED_UNITS.find((u) => u.id === toId);

  if (!fromUnit || !toUnit) {
    throw new Error(`Invalid speed unit conversion: ${fromId} to ${toId}`);
  }

  const valueInKmh = value * fromUnit.factorInKmh;
  return valueInKmh / toUnit.factorInKmh;
}

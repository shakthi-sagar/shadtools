export interface TimeUnit {
  id: string;
  name: string;
  symbol: string;
  factorInSeconds: number;
}

export const TIME_UNITS: TimeUnit[] = [
  { id: 'second', name: 'Seconds', symbol: 's', factorInSeconds: 1 },
  { id: 'minute', name: 'Minutes', symbol: 'min', factorInSeconds: 60 },
  { id: 'hour', name: 'Hours', symbol: 'hr', factorInSeconds: 3600 },
  { id: 'day', name: 'Days', symbol: 'd', factorInSeconds: 86400 },
  { id: 'week', name: 'Weeks', symbol: 'wk', factorInSeconds: 604800 },
];

export function convertTime(value: number, fromId: string, toId: string): number {
  const fromUnit = TIME_UNITS.find((u) => u.id === fromId);
  const toUnit = TIME_UNITS.find((u) => u.id === toId);

  if (!fromUnit || !toUnit) {
    throw new Error(`Invalid time unit conversion: ${fromId} to ${toId}`);
  }

  const valueInSeconds = value * fromUnit.factorInSeconds;
  return valueInSeconds / toUnit.factorInSeconds;
}

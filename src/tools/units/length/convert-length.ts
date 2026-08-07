export interface UnitOption {
  id: string;
  name: string;
  factor: number; // Factor relative to base unit (meters)
}

export const LENGTH_UNITS: UnitOption[] = [
  { id: 'm', name: 'Meters (m)', factor: 1 },
  { id: 'km', name: 'Kilometers (km)', factor: 1000 },
  { id: 'cm', name: 'Centimeters (cm)', factor: 0.01 },
  { id: 'mm', name: 'Millimeters (mm)', factor: 0.001 },
  { id: 'mi', name: 'Miles (mi)', factor: 1609.344 },
  { id: 'yd', name: 'Yards (yd)', factor: 0.9144 },
  { id: 'ft', name: 'Feet (ft)', factor: 0.3048 },
  { id: 'in', name: 'Inches (in)', factor: 0.0254 }
];

export function convertUnit(value: number, fromUnitId: string, toUnitId: string, units: UnitOption[] = LENGTH_UNITS): number {
  if (isNaN(value)) return 0;
  const from = units.find((u) => u.id === fromUnitId);
  const to = units.find((u) => u.id === toUnitId);
  if (!from || !to) return value;
  const baseValue = value * from.factor;
  return baseValue / to.factor;
}

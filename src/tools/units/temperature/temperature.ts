export function convertTemperature(value: number, fromUnit: string, toUnit: string): number {
  if (isNaN(value)) return 0;
  if (fromUnit === toUnit) return value;

  // Convert from input unit to Celsius
  let celsius = value;
  if (fromUnit === 'F') {
    celsius = (value - 32) * (5 / 9);
  } else if (fromUnit === 'K') {
    celsius = value - 273.15;
  }

  // Convert from Celsius to output unit
  if (toUnit === 'F') {
    return celsius * (9 / 5) + 32;
  } else if (toUnit === 'K') {
    return celsius + 273.15;
  }

  return celsius;
}

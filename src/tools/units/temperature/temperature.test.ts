import { describe, it, expect } from 'vitest';
import { convertTemperature } from '@/tools/units/temperature/temperature';

describe('Temperature Converter Engine', () => {
  it('converts 0 Celsius to Fahrenheit (32°F)', () => {
    const res = convertTemperature(0, 'C', 'F');
    expect(res).toBe(32);
  });

  it('converts 100 Celsius to Fahrenheit (212°F)', () => {
    const res = convertTemperature(100, 'C', 'F');
    expect(res).toBe(212);
  });

  it('converts 0 Celsius to Kelvin (273.15K)', () => {
    const res = convertTemperature(0, 'C', 'K');
    expect(res).toBe(273.15);
  });
});

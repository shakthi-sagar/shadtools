import { describe, it, expect } from 'vitest';
import { convertDataStorage } from './data-storage';

describe('Data Storage Conversion Engine', () => {
  it('converts gigabytes to megabytes (decimal) correctly', () => {
    const res = convertDataStorage(1, 'gigabyte', 'megabyte');
    expect(res).toBe(1000);
  });

  it('converts gibibytes to mebibytes (binary) correctly', () => {
    const res = convertDataStorage(1, 'gibibyte', 'mebibyte');
    expect(res).toBe(1024);
  });

  it('converts bytes to bits correctly', () => {
    const res = convertDataStorage(8, 'byte', 'bit');
    expect(res).toBe(64);
  });
});

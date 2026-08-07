export interface DataStorageUnit {
  id: string;
  name: string;
  symbol: string;
  factorInBits: number;
}

export const DATA_STORAGE_UNITS: DataStorageUnit[] = [
  { id: 'bit', name: 'Bits', symbol: 'b', factorInBits: 1 },
  { id: 'byte', name: 'Bytes', symbol: 'B', factorInBits: 8 },
  { id: 'kilobyte', name: 'Kilobytes (decimal)', symbol: 'KB', factorInBits: 8 * 1000 },
  { id: 'megabyte', name: 'Megabytes (decimal)', symbol: 'MB', factorInBits: 8 * 1000 ** 2 },
  { id: 'gigabyte', name: 'Gigabytes (decimal)', symbol: 'GB', factorInBits: 8 * 1000 ** 3 },
  { id: 'terabyte', name: 'Terabytes (decimal)', symbol: 'TB', factorInBits: 8 * 1000 ** 4 },
  { id: 'kibibyte', name: 'Kibibytes (binary)', symbol: 'KiB', factorInBits: 8 * 1024 },
  { id: 'mebibyte', name: 'Mebibytes (binary)', symbol: 'MiB', factorInBits: 8 * 1024 ** 2 },
  { id: 'gibibyte', name: 'Gibibytes (binary)', symbol: 'GiB', factorInBits: 8 * 1024 ** 3 },
  { id: 'tebibyte', name: 'Tebibytes (binary)', symbol: 'TiB', factorInBits: 8 * 1024 ** 4 },
];

export function convertDataStorage(value: number, fromId: string, toId: string): number {
  const fromUnit = DATA_STORAGE_UNITS.find((u) => u.id === fromId);
  const toUnit = DATA_STORAGE_UNITS.find((u) => u.id === toId);

  if (!fromUnit || !toUnit) {
    throw new Error(`Invalid data storage unit conversion: ${fromId} to ${toId}`);
  }

  const valueInBits = value * fromUnit.factorInBits;
  return valueInBits / toUnit.factorInBits;
}

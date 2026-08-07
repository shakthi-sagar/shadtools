export interface UnitRatio {
  id: string;
  name: string;
  ratio: number;
}

export function convertValueByRatio(val: number, fromRatio: number, toRatio: number): number {
  return (val * fromRatio) / toRatio;
}

export interface PercentageCalcResult {
  value: number;
  formatted: string;
}

export function calcPercentageOf(percent: number, total: number): number {
  if (isNaN(percent) || isNaN(total)) return 0;
  return (percent / 100) * total;
}

export function calcWhatPercentOf(value: number, total: number): number {
  if (isNaN(value) || isNaN(total) || total === 0) return 0;
  return (value / total) * 100;
}

export function calcPercentageChange(oldValue: number, newValue: number): number {
  if (isNaN(oldValue) || isNaN(newValue) || oldValue === 0) return 0;
  return ((newValue - oldValue) / oldValue) * 100;
}

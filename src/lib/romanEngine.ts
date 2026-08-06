export function intToRoman(num: number): string {
  if (num < 1 || num > 3999 || !Number.isInteger(num)) {
    return 'Invalid (Range: 1 to 3999)';
  }
  const valMap: [number, string][] = [
    [1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'],
    [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'],
    [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']
  ];
  let res = '';
  let n = num;
  for (const [val, sym] of valMap) {
    while (n >= val) {
      res += sym;
      n -= val;
    }
  }
  return res;
}

export function romanToInt(roman: string): number | string {
  const str = roman.toUpperCase().trim();
  if (!str) return '';
  if (!/^M{0,3}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})$/.test(str)) {
    return 'Invalid Roman Numeral';
  }
  const symMap: Record<string, number> = {
    I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000
  };
  let total = 0;
  for (let i = 0; i < str.length; i++) {
    const cur = symMap[str[i]];
    const next = symMap[str[i + 1]];
    if (next && next > cur) {
      total -= cur;
    } else {
      total += cur;
    }
  }
  return total;
}

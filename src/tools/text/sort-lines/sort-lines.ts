export type SortMode = 'alphabetical-asc' | 'alphabetical-desc' | 'numerical-asc' | 'numerical-desc' | 'length-asc' | 'length-desc' | 'reverse';

export function sortLines(input: string, mode: SortMode = 'alphabetical-asc', removeDuplicates: boolean = false): string {
  if (!input) return '';
  let lines = input.split('\n');

  if (removeDuplicates) {
    lines = Array.from(new Set(lines));
  }

  switch (mode) {
    case 'alphabetical-asc':
      lines.sort((a, b) => a.localeCompare(b));
      break;
    case 'alphabetical-desc':
      lines.sort((a, b) => b.localeCompare(a));
      break;
    case 'numerical-asc':
      lines.sort((a, b) => (parseFloat(a) || 0) - (parseFloat(b) || 0));
      break;
    case 'numerical-desc':
      lines.sort((a, b) => (parseFloat(b) || 0) - (parseFloat(a) || 0));
      break;
    case 'length-asc':
      lines.sort((a, b) => a.length - b.length);
      break;
    case 'length-desc':
      lines.sort((a, b) => b.length - a.length);
      break;
    case 'reverse':
      lines.reverse();
      break;
  }

  return lines.join('\n');
}

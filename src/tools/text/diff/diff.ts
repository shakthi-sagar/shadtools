export interface DiffLine {
  type: 'added' | 'removed' | 'unchanged';
  text: string;
  originalLineNumber?: number;
  modifiedLineNumber?: number;
}

export interface DiffResult {
  lines: DiffLine[];
  additionsCount: number;
  deletionsCount: number;
  unchangedCount: number;
}

export function computeLineDiff(original: string, modified: string): DiffResult {
  const origLines = original.split('\n');
  const modLines = modified.split('\n');

  const lines: DiffLine[] = [];
  let additionsCount = 0;
  let deletionsCount = 0;
  let unchangedCount = 0;

  let i = 0;
  let j = 0;

  while (i < origLines.length || j < modLines.length) {
    if (i < origLines.length && j < modLines.length && origLines[i] === modLines[j]) {
      lines.push({
        type: 'unchanged',
        text: origLines[i],
        originalLineNumber: i + 1,
        modifiedLineNumber: j + 1,
      });
      unchangedCount++;
      i++;
      j++;
    } else if (j < modLines.length && (!origLines.includes(modLines[j], i) || origLines.indexOf(modLines[j], i) > i + 3)) {
      lines.push({
        type: 'added',
        text: modLines[j],
        modifiedLineNumber: j + 1,
      });
      additionsCount++;
      j++;
    } else if (i < origLines.length) {
      lines.push({
        type: 'removed',
        text: origLines[i],
        originalLineNumber: i + 1,
      });
      deletionsCount++;
      i++;
    } else {
      break;
    }
  }

  return { lines, additionsCount, deletionsCount, unchangedCount };
}

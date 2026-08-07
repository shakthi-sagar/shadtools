export interface JsonValidationResult {
  isValid: boolean;
  error?: {
    message: string;
    line?: number;
    column?: number;
  };
  formatted?: string;
  stats?: {
    keysCount: number;
    depth: number;
    sizeBytes: number;
  };
}

function calculateDepth(obj: any): number {
  if (obj === null || typeof obj !== 'object') return 0;
  let max = 0;
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      max = Math.max(max, calculateDepth(obj[key]));
    }
  }
  return 1 + max;
}

function countKeys(obj: any): number {
  if (obj === null || typeof obj !== 'object') return 0;
  let count = Array.isArray(obj) ? obj.length : Object.keys(obj).length;
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      count += countKeys(obj[key]);
    }
  }
  return count;
}

export function validateJson(input: string): JsonValidationResult {
  if (!input || !input.trim()) {
    return { isValid: true, formatted: '', stats: { keysCount: 0, depth: 0, sizeBytes: 0 } };
  }

  try {
    const parsed = JSON.parse(input);
    const formatted = JSON.stringify(parsed, null, 2);
    const depth = calculateDepth(parsed);
    const keysCount = countKeys(parsed);
    const sizeBytes = new TextEncoder().encode(input).length;

    return {
      isValid: true,
      formatted,
      stats: { keysCount, depth, sizeBytes },
    };
  } catch (err: any) {
    let line: number | undefined;
    let column: number | undefined;
    const msg = err.message || 'Invalid JSON syntax';

    // Parse V8 error position (e.g. "at position 42" or "line 2 column 5")
    const posMatch = msg.match(/at position (\d+)/i);
    if (posMatch) {
      const pos = parseInt(posMatch[1], 10);
      const lines = input.slice(0, pos).split('\n');
      line = lines.length;
      column = lines[lines.length - 1].length + 1;
    } else {
      const lineColMatch = msg.match(/line (\d+) column (\d+)/i);
      if (lineColMatch) {
        line = parseInt(lineColMatch[1], 10);
        column = parseInt(lineColMatch[2], 10);
      }
    }

    return {
      isValid: false,
      error: {
        message: msg,
        line,
        column,
      },
    };
  }
}

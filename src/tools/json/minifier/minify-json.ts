export interface JsonMinifyResult {
  output: string;
  error?: {
    message: string;
    line?: number;
    column?: number;
  };
}

export function minifyJson(input: string): JsonMinifyResult {
  if (!input.trim()) {
    return { output: '' };
  }

  try {
    const parsed = JSON.parse(input);
    return { output: JSON.stringify(parsed) };
  } catch (err: any) {
    const rawMessage = err.message || 'Invalid JSON input';
    let line: number | undefined;
    let column: number | undefined;

    const lineColMatch = rawMessage.match(/at position (\d+)/i) || rawMessage.match(/line (\d+) column (\d+)/i);
    if (lineColMatch) {
      if (lineColMatch[2]) {
        line = parseInt(lineColMatch[1], 10);
        column = parseInt(lineColMatch[2], 10);
      } else {
        const pos = parseInt(lineColMatch[1], 10);
        const lines = input.substring(0, pos).split('\n');
        line = lines.length;
        column = lines[lines.length - 1].length + 1;
      }
    }

    const message = line && column
      ? `Syntax error at line ${line}, column ${column}: ${rawMessage}`
      : `Syntax error: ${rawMessage}`;

    return {
      output: '',
      error: {
        message,
        line,
        column,
      },
    };
  }
}

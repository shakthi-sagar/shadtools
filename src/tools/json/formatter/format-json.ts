export interface JsonFormatResult {
  success: boolean;
  output: string;
  error?: string;
  itemCount?: number;
}

export function formatJson(input: string, indent: number | string = 2): JsonFormatResult {
  if (!input.trim()) {
    return { success: true, output: '', itemCount: 0 };
  }
  try {
    const parsed = JSON.parse(input);
    const indentSpace = indent === 'tab' ? '\t' : typeof indent === 'string' ? (parseInt(indent, 10) || 2) : indent;
    const formatted = JSON.stringify(parsed, null, indentSpace);
    const count = Array.isArray(parsed) ? parsed.length : typeof parsed === 'object' && parsed !== null ? Object.keys(parsed).length : 1;
    return { success: true, output: formatted, itemCount: count };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Invalid JSON syntax';
    return { success: false, output: input, error: errorMsg };
  }
}

export function minifyJson(input: string): JsonFormatResult {
  if (!input.trim()) {
    return { success: true, output: '', itemCount: 0 };
  }
  try {
    const parsed = JSON.parse(input);
    const minified = JSON.stringify(parsed);
    return { success: true, output: minified };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Invalid JSON syntax';
    return { success: false, output: input, error: errorMsg };
  }
}

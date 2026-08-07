export interface UrlEncoderResult {
  output: string;
  error?: string;
}

export function processUrlEncoding(input: string, mode: 'encode' | 'decode'): UrlEncoderResult {
  if (!input) {
    return { output: '' };
  }

  if (mode === 'encode') {
    try {
      return { output: encodeURIComponent(input) };
    } catch (err: any) {
      return { output: '', error: `Encoding error: ${err.message || 'Failed to encode input'}` };
    }
  } else {
    try {
      return { output: decodeURIComponent(input.replace(/\+/g, ' ')) };
    } catch (err: any) {
      return {
        output: '',
        error: 'Malformed URL encoding sequence. Please verify percent-encoded characters (e.g. %20).',
      };
    }
  }
}

export interface Base64Result {
  success: boolean;
  output: string;
  error?: string;
}

export function encodeBase64(input: string): Base64Result {
  if (!input) return { success: true, output: '' };
  try {
    const bytes = new TextEncoder().encode(input);
    const binString = Array.from(bytes, (byte) => String.fromCharCode(byte)).join('');
    return { success: true, output: btoa(binString) };
  } catch (err: unknown) {
    return { success: false, output: '', error: 'Failed to encode text to Base64' };
  }
}

export function decodeBase64(input: string): Base64Result {
  if (!input.trim()) return { success: true, output: '' };
  try {
    const binString = atob(input.trim());
    const bytes = Uint8Array.from(binString, (m) => m.charCodeAt(0));
    const decoded = new TextDecoder().decode(bytes);
    return { success: true, output: decoded };
  } catch (err: unknown) {
    return { success: false, output: '', error: 'Invalid Base64 string format' };
  }
}

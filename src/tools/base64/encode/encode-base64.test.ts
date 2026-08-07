import { describe, it, expect } from 'vitest';
import { encodeBase64, decodeBase64 } from './encode-base64';

describe('Base64 Engine', () => {
  it('encodes string to base64', () => {
    const res = encodeBase64('Hello World');
    expect(res.success).toBe(true);
    expect(res.output).toBe('SGVsbG8gV29ybGQ=');
  });

  it('decodes base64 back to string', () => {
    const res = decodeBase64('SGVsbG8gV29ybGQ=');
    expect(res.success).toBe(true);
    expect(res.output).toBe('Hello World');
  });
});

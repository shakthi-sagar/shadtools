import { describe, it, expect } from 'vitest';
import { processUrlEncoding } from './url-encoder';

describe('URL Encoder Engine', () => {
  it('encodes special URL characters correctly', () => {
    const input = 'hello world & test!';
    const res = processUrlEncoding(input, 'encode');
    expect(res.output).toBe('hello%20world%20%26%20test!');
    expect(res.error).toBeUndefined();
  });

  it('decodes percent-encoded string correctly', () => {
    const input = 'hello%20world%20%26%20test%21';
    const res = processUrlEncoding(input, 'decode');
    expect(res.output).toBe('hello world & test!');
    expect(res.error).toBeUndefined();
  });

  it('handles malformed percent encoding gracefully', () => {
    const input = 'hello%2world%bad';
    const res = processUrlEncoding(input, 'decode');
    expect(res.output).toBe('');
    expect(res.error).toBeDefined();
  });
});

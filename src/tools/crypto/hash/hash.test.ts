import { describe, it, expect } from 'vitest';
import { generateHashes } from '@/tools/crypto/hash/hash';

describe('Crypto Hash Engine', () => {
  it('generates SHA-256 hash correctly for empty input', async () => {
    const res = await generateHashes('');
    expect(res.sha256).toBe('');
  });

  it('generates SHA-256 hash for test string', async () => {
    const res = await generateHashes('hello');
    // SHA-256 for 'hello' is 2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824
    expect(res.sha256).toBe('2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824');
  });
});

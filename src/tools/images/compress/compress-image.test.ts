import { describe, it, expect } from 'vitest';
import { compressImage } from '@/tools/images/compress/compress-image';

describe('Image Compressor Engine', () => {
  it('exports compressImage function', () => {
    expect(typeof compressImage).toBe('function');
  });
});

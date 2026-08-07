import { describe, it, expect } from 'vitest';
import { compressImage } from './compress-image';

describe('Image Compressor Engine', () => {
  it('exports compressImage function', () => {
    expect(typeof compressImage).toBe('function');
  });
});

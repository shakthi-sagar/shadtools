import { describe, it, expect } from 'vitest';
import { generateUuidV4, generateUuidBatch } from '@/tools/crypto/uuid/uuid';

describe('UUID Generator Engine', () => {
  it('generates valid UUID v4 string format', () => {
    const uuid = generateUuidV4();
    expect(uuid).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
  });

  it('generates batch of requested count', () => {
    const batch = generateUuidBatch(5);
    expect(batch.length).toBe(5);
  });
});

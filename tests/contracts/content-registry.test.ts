import { describe, it, expect } from 'vitest';
import { getRegisteredToolKeys } from '../../src/tools/registry';

describe('Content & Registry Contract Tests', () => {
  it('registers all core tool modules', () => {
    const keys = getRegisteredToolKeys();
    expect(keys).toContain('json/formatter');
    expect(keys).toContain('base64/encode');
    expect(keys).toContain('images/compress');
    expect(keys).toContain('percentage/calculator');
    expect(keys).toContain('units/length');
    expect(keys).toContain('currency/converter');
  });
});

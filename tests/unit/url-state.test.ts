import { describe, it, expect, beforeEach, vi } from 'vitest';
import { parseUrlParams, updateUrlParams } from '@/lib/url-state';
import { getPayloadSizeBucket, track } from '@/lib/analytics';

describe('URL State Helper', () => {
  beforeEach(() => {
    const mockSearchParams = new Map<string, string>([
      ['value', '18'],
      ['from', 'yard'],
      ['to', 'meter'],
    ]);

    const mockSearchParamsObj = {
      has: (k: string) => mockSearchParams.has(k),
      get: (k: string) => mockSearchParams.get(k),
      set: (k: string, v: string) => mockSearchParams.set(k, v),
      delete: (k: string) => mockSearchParams.delete(k),
      toString: () =>
        Array.from(mockSearchParams.entries())
          .map(([k, v]) => `${k}=${v}`)
          .join('&'),
      forEach: (cb: (v: string, k: string) => void) => {
        mockSearchParams.forEach((v, k) => cb(v, k));
      },
    };

    (globalThis as any).window = {
      location: {
        search: '?value=18&from=yard&to=meter',
        pathname: '/units/length',
        hash: '',
        href: 'http://localhost/units/length?value=18&from=yard&to=meter',
      },
      history: {
        replaceState: vi.fn(),
      },
      dispatchEvent: vi.fn(),
    };

    (globalThis as any).URLSearchParams = vi.fn().mockImplementation(() => mockSearchParamsObj);
  });

  it('parses initial search parameters correctly', () => {
    const params = parseUrlParams();
    expect(params.value).toBe('18');
    expect(params.from).toBe('yard');
    expect(params.to).toBe('meter');
  });

  it('updates URL search parameters via history.replaceState', () => {
    updateUrlParams({ value: 25, from: 'meter', to: 'foot' });
    expect(window.history.replaceState).toHaveBeenCalledWith(
      null,
      '',
      '/units/length?value=25&from=meter&to=foot'
    );
  });

  it('does not update URL when values are unchanged', () => {
    updateUrlParams({ value: '18', from: 'yard', to: 'meter' });
    expect(window.history.replaceState).not.toHaveBeenCalled();
  });
});

describe('Analytics Helper', () => {
  it('buckets payload sizes safely without revealing text content', () => {
    expect(getPayloadSizeBucket(0)).toBe('0B');
    expect(getPayloadSizeBucket(45)).toBe('<100B');
    expect(getPayloadSizeBucket(500)).toBe('100B-1KB');
    expect(getPayloadSizeBucket(5000)).toBe('1KB-10KB');
    expect(getPayloadSizeBucket(50000)).toBe('10KB-100KB');
    expect(getPayloadSizeBucket(500000)).toBe('>100KB');
  });

  it('dispatches analytics events without throwing on error', () => {
    (globalThis as any).window = {
      dispatchEvent: vi.fn(),
    };
    (globalThis as any).CustomEvent = vi.fn().mockImplementation((type, detail) => ({ type, detail }));
    expect(() => track('tool_open', { tool_key: 'units/length', category: 'units' })).not.toThrow();
    expect(window.dispatchEvent).toHaveBeenCalled();
  });
});

import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  parseUrlParams,
  updateUrlParams,
  defineUrlStateSchema,
  sanitizeUrlParams,
  SYSTEM_ALLOWED_URL_KEYS,
  SENSITIVE_KEY_RE,
} from '@/lib/url-state';
import { getPayloadSizeBucket, track } from '@/lib/analytics';
import { minifyJson } from '@/tools/json/minifier/minify-json';
import { processUrlEncoding } from '@/tools/text/url-encoder/url-encoder';

describe('URL State Privacy Guard & Helper', () => {
  let mockSearchParams: Map<string, string>;

  beforeEach(() => {
    mockSearchParams = new Map<string, string>([
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

  it('updates URL search parameters via history.replaceState for allowed keys', () => {
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

  it('STRICT PRIVACY GUARD: ignores and strips sensitive payload keys', () => {
    const sensitivePayloads = {
      input: '{"password":"supersecretJSON"}',
      text: 'private user text',
      json: '{"apiKey":"12345"}',
      code: 'console.log("secret")',
      payload: 'raw data',
      body: 'request body',
      base64: 'SGVsbG8gV29ybGQ=',
      secret: 'topsecret',
      password: 'myPassword123',
    };

    updateUrlParams(sensitivePayloads as any);
    expect(window.history.replaceState).not.toHaveBeenCalled();

    // Verify none of the sensitive keys were added
    for (const key of Object.keys(sensitivePayloads)) {
      expect(mockSearchParams.has(key)).toBe(false);
    }
  });

  it('STRICT PRIVACY GUARD: strips un-allowlisted key while keeping valid allowlisted key', () => {
    updateUrlParams({
      value: 100,
      input: '{"secret":"content"}',
      jsonDocument: 'sensitive',
    } as any);

    expect(window.history.replaceState).toHaveBeenCalledWith(
      null,
      '',
      '/units/length?value=100&from=yard&to=meter'
    );
    expect(mockSearchParams.has('input')).toBe(false);
    expect(mockSearchParams.has('jsonDocument')).toBe(false);
  });

  it('STRICT PRIVACY GUARD: defineUrlStateSchema throws if non-allowlisted keys are passed', () => {
    expect(() => defineUrlStateSchema(['input' as any, 'value'])).toThrow(
      /Prohibited in URL state: input/i
    );
    expect(() => defineUrlStateSchema(['json' as any])).toThrow();
  });

  it('STRICT PRIVACY GUARD: sanitizeUrlParams strips un-allowlisted or sensitive keys', () => {
    const res = sanitizeUrlParams({
      value: 42,
      mode: 'encode',
      input: 'secret',
      payload: 'data',
    });

    expect(res).toEqual({ value: '42', mode: 'encode' });
    expect(res).not.toHaveProperty('input');
    expect(res).not.toHaveProperty('payload');
  });

  it('STRICT PRIVACY GUARD: parseUrlParams ignores sensitive parameters from URL', () => {
    mockSearchParams.set('input', '{"secret":true}');
    mockSearchParams.set('payload', 'sensitiveData');
    const parsed = parseUrlParams();

    expect(parsed).not.toHaveProperty('input');
    expect(parsed).not.toHaveProperty('payload');
    expect(parsed).toHaveProperty('value', '18');
  });

  describe('Tool Components Privacy Isolation', () => {
    it('JSON Minifier processes JSON locally without writing payload to URL state', () => {
      const jsonInput = '{\n  "user": "john_doe",\n  "api_key": "sk_live_12345"\n}';
      const result = minifyJson(jsonInput);

      expect(result.output).toBe('{"user":"john_doe","api_key":"sk_live_12345"}');
      expect(result.error).toBeUndefined();

      // Verify updating URL params with json input is ignored and does not call replaceState
      updateUrlParams({ input: jsonInput } as any);
      expect(window.history.replaceState).not.toHaveBeenCalled();
      expect(SENSITIVE_KEY_RE.test('input')).toBe(true);
      expect(SYSTEM_ALLOWED_URL_KEYS.has('input')).toBe(false);
    });

    it('URL Encoder processes text locally without writing text payload to URL state', () => {
      const sensitiveUrl = 'https://example.com/login?user=admin&pass=secret123';
      const result = processUrlEncoding(sensitiveUrl, 'encode');

      expect(result.output).toBe('https%3A%2F%2Fexample.com%2Flogin%3Fuser%3Dadmin%26pass%3Dsecret123');

      // Verify mode is allowed but input text is stripped
      const params = sanitizeUrlParams({ mode: 'encode', input: sensitiveUrl });
      expect(params).toEqual({ mode: 'encode' });
      expect(params).not.toHaveProperty('input');
    });
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

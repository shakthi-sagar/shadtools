/**
 * Utility for reading and updating non-sensitive tool configuration via URL search parameters.
 *
 * Privacy Guard & Strict Security Policy:
 * NEVER place arbitrary user text, JSON documents, Base64 payloads, hashes, or sensitive input
 * into URL search parameters. Only explicitly allowlisted, non-sensitive parameters
 * (e.g. numeric amounts, unit keys, mode selectors, feature flags) are permitted.
 */

/**
 * Strict System Allowlist of permitted URL parameter keys across ShadTools.
 * Any key NOT present in this set will be automatically rejected and stripped.
 */
export const SYSTEM_ALLOWED_URL_KEYS = new Set<string>([
  'value',
  'amount',
  'from',
  'to',
  'mode',
  'count',
  'uppercase',
  'hyphens',
  'unit',
  'precision',
  'format',
]);

/**
 * Patterns for explicitly blacklisted sensitive parameters.
 * Any parameter key matching these sensitive terms (or any key not in SYSTEM_ALLOWED_URL_KEYS)
 * will be strictly blocked.
 */
export const SENSITIVE_KEY_RE = /^(input|text|json|code|payload|body|base64|secret|content|data|file|password|token|key|document|xml|html)$/i;

export interface UrlStateSchema<T extends Record<string, any>> {
  allowedKeys: ReadonlyArray<keyof T & string>;
}

/**
 * Define a type-safe URL state schema for a tool.
 * Verifies that all keys belong to the strict system privacy allowlist.
 */
export function defineUrlStateSchema<T extends Record<string, any>>(
  keys: (keyof T & string)[]
): UrlStateSchema<T> {
  const invalidKeys = keys.filter(
    (k) => !SYSTEM_ALLOWED_URL_KEYS.has(k) || SENSITIVE_KEY_RE.test(k)
  );

  if (invalidKeys.length > 0) {
    throw new Error(
      `[Privacy Guard Violation] The following keys are prohibited in URL state: ${invalidKeys.join(', ')}`
    );
  }

  return { allowedKeys: Object.freeze(keys) };
}

/**
 * Parses current URL search parameters, stripping out any un-allowlisted or sensitive keys.
 */
export function parseUrlParams(
  schema?: UrlStateSchema<any> | ReadonlyArray<string>
): Record<string, string> {
  if (typeof window === 'undefined') return {};

  const params = new URLSearchParams(window.location.search);
  const result: Record<string, string> = {};

  const allowedSet = schema
    ? new Set('allowedKeys' in schema ? schema.allowedKeys : schema)
    : SYSTEM_ALLOWED_URL_KEYS;

  params.forEach((value, key) => {
    if (allowedSet.has(key) && SYSTEM_ALLOWED_URL_KEYS.has(key) && !SENSITIVE_KEY_RE.test(key)) {
      result[key] = value;
    }
  });

  return result;
}

/**
 * Sanitizes input parameters against privacy rules.
 * Strips any sensitive key or key not in the system allowlist / schema.
 */
export function sanitizeUrlParams(
  params: Record<string, any>,
  schema?: UrlStateSchema<any> | ReadonlyArray<string>
): Record<string, string> {
  const sanitized: Record<string, string> = {};
  const allowedSet = schema
    ? new Set('allowedKeys' in schema ? schema.allowedKeys : schema)
    : SYSTEM_ALLOWED_URL_KEYS;

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return;

    // Enforce strict privacy guard: block unallowed or sensitive keys
    if (SENSITIVE_KEY_RE.test(key) || !allowedSet.has(key) || !SYSTEM_ALLOWED_URL_KEYS.has(key)) {
      if (process.env.NODE_ENV !== 'production') {
        console.warn(
          `[Privacy Guard] Stripped sensitive or disallowed key "${key}" from URL state.`
        );
      }
      return;
    }

    sanitized[key] = String(value);
  });

  return sanitized;
}

/**
 * Programmatically updates window.location.search safely.
 * Only writes parameters that pass the strict privacy guard allowlist.
 */
export function updateUrlParams(
  params: Record<string, string | number | boolean | undefined | null>,
  schema?: UrlStateSchema<any> | ReadonlyArray<string>
): void {
  if (typeof window === 'undefined') return;

  const currentParams = new URLSearchParams(window.location.search);
  let changed = false;

  const allowedSet = schema
    ? new Set('allowedKeys' in schema ? schema.allowedKeys : schema)
    : SYSTEM_ALLOWED_URL_KEYS;

  Object.entries(params).forEach(([key, value]) => {
    // Strictly block disallowed or sensitive keys
    if (SENSITIVE_KEY_RE.test(key) || !allowedSet.has(key) || !SYSTEM_ALLOWED_URL_KEYS.has(key)) {
      if (currentParams.has(key)) {
        currentParams.delete(key);
        changed = true;
      }
      return;
    }

    if (value === undefined || value === null || value === '') {
      if (currentParams.has(key)) {
        currentParams.delete(key);
        changed = true;
      }
    } else {
      const strVal = String(value);
      if (currentParams.get(key) !== strVal) {
        currentParams.set(key, strVal);
        changed = true;
      }
    }
  });

  if (changed) {
    const newSearch = currentParams.toString();
    const newUrl = `${window.location.pathname}${newSearch ? `?${newSearch}` : ''}${window.location.hash}`;
    window.history.replaceState(null, '', newUrl);
  }
}

export async function copyShareLink(): Promise<boolean> {
  if (typeof window === 'undefined' || !navigator?.clipboard?.writeText) {
    return false;
  }

  try {
    await navigator.clipboard.writeText(window.location.href);
    return true;
  } catch {
    return false;
  }
}

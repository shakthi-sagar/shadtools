/**
 * Utility for reading and updating non-sensitive tool configuration via URL search parameters.
 *
 * Privacy Guard:
 * NEVER place arbitrary user text, JSON documents, Base64 payloads, hashes, or sensitive input
 * into URL search parameters. Only non-sensitive parameters (e.g. numeric amounts, unit keys, modes)
 * are allowed.
 */

export function parseUrlParams(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  const params = new URLSearchParams(window.location.search);
  const result: Record<string, string> = {};
  params.forEach((value, key) => {
    result[key] = value;
  });
  return result;
}

export function updateUrlParams(
  params: Record<string, string | number | boolean | undefined | null>
): void {
  if (typeof window === 'undefined') return;

  const currentParams = new URLSearchParams(window.location.search);
  let changed = false;

  Object.entries(params).forEach(([key, value]) => {
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

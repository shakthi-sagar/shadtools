export interface SlugOptions {
  separator?: string;
  lowercase?: boolean;
  trimWhitespace?: boolean;
}

export function generateSlug(input: string, options: SlugOptions = {}): string {
  if (!input) return '';
  const separator = options.separator ?? '-';
  const lowercase = options.lowercase ?? true;

  let str = input.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  if (lowercase) {
    str = str.toLowerCase();
  }

  str = str
    .replace(/[^a-zA-Z0-9\s-_]/g, '')
    .trim()
    .replace(/[\s-_]+/g, separator);

  return str;
}

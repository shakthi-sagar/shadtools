export interface ConvertedCases {
  camelCase: string;
  kebabCase: string;
  snakeCase: string;
  constantCase: string;
  pascalCase: string;
  titleCase: string;
  lowercase: string;
  uppercase: string;
}

export function convertCases(input: string): ConvertedCases {
  if (!input) {
    return {
      camelCase: '',
      kebabCase: '',
      snakeCase: '',
      constantCase: '',
      pascalCase: '',
      titleCase: '',
      lowercase: '',
      uppercase: '',
    };
  }

  const words = input
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/[^a-zA-Z0-9]+/g, ' ')
    .trim()
    .split(/\s+/);

  const cleanWords = words.filter(Boolean);

  const camelCase = cleanWords
    .map((w, i) => (i === 0 ? w.toLowerCase() : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()))
    .join('');

  const kebabCase = cleanWords.map((w) => w.toLowerCase()).join('-');
  const snakeCase = cleanWords.map((w) => w.toLowerCase()).join('_');
  const constantCase = cleanWords.map((w) => w.toUpperCase()).join('_');
  const pascalCase = cleanWords
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join('');

  const titleCase = cleanWords
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');

  return {
    camelCase,
    kebabCase,
    snakeCase,
    constantCase,
    pascalCase,
    titleCase,
    lowercase: input.toLowerCase(),
    uppercase: input.toUpperCase(),
  };
}

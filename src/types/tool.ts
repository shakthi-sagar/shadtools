export type ToolCategory = 
  | 'pdf-tools'
  | 'developer-tools'
  | 'finance-tools'
  | 'image-tools'
  | 'time-tools'
  | 'unit-converters';

export interface CategoryMeta {
  id: ToolCategory;
  name: string;
  slug: string;
  description: string;
  accentColor: string;
  accentClass: string;
  icon: string;
}

export const CATEGORIES: Record<ToolCategory, CategoryMeta> = {
  'pdf-tools': {
    id: 'pdf-tools',
    name: 'PDF & Document Tools',
    slug: 'pdf-tools',
    description: 'Free online PDF converters, splitters, mergers, and document utilities. Fast, secure, and zero upload required.',
    accentColor: '#3b82f6',
    accentClass: 'category-documents',
    icon: 'FileText'
  },
  'developer-tools': {
    id: 'developer-tools',
    name: 'Developer Tools',
    slug: 'developer-tools',
    description: 'Essential developer utilities including JSON formatters, Base64 decoders, Regex checkers, and code formatters.',
    accentColor: '#8b5cf6',
    accentClass: 'category-developer-tools',
    icon: 'Code'
  },
  'finance-tools': {
    id: 'finance-tools',
    name: 'Finance & Calculators',
    slug: 'finance-tools',
    description: 'Accurate financial calculators for loans, interest rates, tax estimates, percentages, and live currency rates.',
    accentColor: '#10b981',
    accentClass: 'category-finance-tools',
    icon: 'Calculator'
  },
  'image-tools': {
    id: 'image-tools',
    name: 'Image & Media Tools',
    slug: 'image-tools',
    description: 'Convert, compress, and edit images right in your browser with zero quality loss and instant download.',
    accentColor: '#f97316',
    accentClass: 'category-image-tools',
    icon: 'Image'
  },
  'time-tools': {
    id: 'time-tools',
    name: 'Time & Date Tools',
    slug: 'time-tools',
    description: 'Timezone converters, epoch timestamp parsers, date difference calculators, and countdown tools.',
    accentColor: '#14b8a6',
    accentClass: 'category-time-tools',
    icon: 'Clock'
  },
  'unit-converters': {
    id: 'unit-converters',
    name: 'Unit Converters',
    slug: 'unit-converters',
    description: 'Convert length, mass, volume, temperature, speed, and digital data units with high precision.',
    accentColor: '#6366f1',
    accentClass: 'category-unit-converters',
    icon: 'ArrowLeftRight'
  }
};

export interface ToolExample {
  input: string;
  output: string;
  description?: string;
}

export interface ToolFaq {
  question: string;
  answer: string;
}

export interface ToolDefinition {
  id: string;
  name: string;
  slug: string;
  category: ToolCategory;
  shortDescription: string;
  longDescription: string;
  keywords: string[];
  primaryKeyword: string;
  relatedKeywords: string[];
  component: string;
  config?: Record<string, unknown>;
  inputLabel?: string;
  outputLabel?: string;
  examples?: ToolExample[];
  faq?: ToolFaq[];
  relatedTools?: string[];
  accent?: string;
  status: 'draft' | 'published';
  lastModified?: string;
}

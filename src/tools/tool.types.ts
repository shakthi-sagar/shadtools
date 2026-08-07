export type ToolPattern = 'code-editor' | 'file' | 'calculator' | 'converter' | 'generator';

export interface ToolSeo {
  title: string;
  description: string;
  primaryKeyword: string;
  keywords?: string[];
  noindex?: boolean;
}

export interface ToolPrivacy {
  processing: 'local' | 'remote-data' | 'server-processing';
  message: string;
}

export interface ToolExample {
  title?: string;
  input: string;
  output: string;
}

export interface ToolFaq {
  question: string;
  answer: string;
}

export interface ToolMetadata {
  id: string;
  name: string;
  namespace: string;
  status: 'draft' | 'published' | 'archived';
  renderer: string;
  pattern: ToolPattern;
  summary: string;
  aliases?: string[];
  seo: ToolSeo;
  privacy: ToolPrivacy;
  config?: Record<string, unknown>;
  features?: string[];
  examples?: ToolExample[];
  faq?: ToolFaq[];
  relatedTools?: string[];
  featured?: boolean;
}

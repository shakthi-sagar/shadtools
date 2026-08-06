import { defineCollection, z } from 'astro:content';

const categoriesCollection = defineCollection({
  type: 'content',
  schema: z.object({
    name: z.string(),
    description: z.string(),
    accentColor: z.string().default('#3b82f6'),
    order: z.number().default(1)
  })
});

const namespacesCollection = defineCollection({
  type: 'content',
  schema: z.object({
    name: z.string(),
    category: z.string(),
    description: z.string(),
    icon: z.string().optional()
  })
});

const toolsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    id: z.string(),
    name: z.string(),
    namespace: z.string(),
    category: z.string(),
    shortDescription: z.string(),
    keywords: z.array(z.string()).default([]),
    primaryKeyword: z.string(),
    relatedKeywords: z.array(z.string()).default([]),
    renderer: z.string(), // e.g. "json/formatter", "base64/encode"
    config: z.record(z.unknown()).optional(),
    inputLabel: z.string().optional(),
    outputLabel: z.string().optional(),
    examples: z.array(
      z.object({
        input: z.string(),
        output: z.string(),
        description: z.string().optional()
      })
    ).optional(),
    faq: z.array(
      z.object({
        question: z.string(),
        answer: z.string()
      })
    ).optional(),
    relatedTools: z.array(z.string()).default([]),
    status: z.enum(['draft', 'published']),
    lastModified: z.string().optional()
  })
});

export const collections = {
  categories: categoriesCollection,
  namespaces: namespacesCollection,
  tools: toolsCollection
};

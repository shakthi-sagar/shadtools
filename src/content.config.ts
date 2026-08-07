import { defineCollection, z } from "astro:content";

const statusSchema = z.enum(["draft", "published", "archived"]);

const tools = defineCollection({
  type: "content",
  schema: z.object({
    id: z.string().optional(),
    name: z.string().min(3),
    namespace: z.string().regex(/^[a-z0-9-]+$/),
    status: statusSchema,
    renderer: z.string().regex(/^[a-z0-9-]+\/[a-z0-9-]+$/),
    pattern: z.enum([
      "code-editor",
      "file",
      "calculator",
      "converter",
      "generator",
    ]),

    summary: z.string().min(10).max(300),
    aliases: z.array(z.string()).default([]),

    seo: z.object({
      title: z.string().min(10).max(100),
      description: z.string().min(20).max(300),
      primaryKeyword: z.string(),
      keywords: z.array(z.string()).default([]),
      noindex: z.boolean().default(false),
    }),

    privacy: z.object({
      processing: z.enum([
        "local",
        "remote-data",
        "server-processing",
      ]),
      message: z.string(),
    }),

    config: z.record(z.string(), z.unknown()).default({}),
    features: z.array(z.string()).default([]),

    examples: z.array(
      z.object({
        title: z.string().optional(),
        input: z.string(),
        output: z.string(),
      }),
    ).default([]),

    faq: z.array(
      z.object({
        question: z.string(),
        answer: z.string(),
      }),
    ).default([]),

    relatedTools: z
      .array(z.string().regex(/^[a-z0-9-]+\/[a-z0-9-]+$/))
      .default([]),

    featured: z.boolean().default(false),
    updatedAt: z.coerce.date().optional(),
  }),
});

const namespaces = defineCollection({
  type: "content",
  schema: z.object({
    name: z.string(),
    summary: z.string(),
    group: z.enum(['developer', 'files', 'calculate']).default('developer'),
    groupLabel: z.string().optional(),
    aliases: z.array(z.string()).default([]),
    featuredTools: z.array(z.string()).default([]),
    order: z.number().int().default(100),
  }),
});

export const collections = {
  tools,
  namespaces,
};

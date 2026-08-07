import { z } from 'astro/zod';

export const jsonFormatterConfigSchema = z.object({
  defaultIndent: z.union([z.literal(2), z.literal(4)]).default(2),
  allowMinify: z.boolean().default(true),
  allowDownload: z.boolean().default(true),
});

export type JsonFormatterConfig = z.infer<typeof jsonFormatterConfigSchema>;

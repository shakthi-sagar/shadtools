import { z } from 'astro/zod';

export const imageCompressConfigSchema = z.object({
  defaultQuality: z.number().min(0.1).max(1.0).default(0.8),
  maxFileSizeMb: z.number().default(20),
});

export type ImageCompressConfig = z.infer<typeof imageCompressConfigSchema>;

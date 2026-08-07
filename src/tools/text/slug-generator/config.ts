import { z } from 'astro/zod';

export const slugGeneratorConfigSchema = z.object({});
export type Config = z.infer<typeof slugGeneratorConfigSchema>;

import { z } from 'astro/zod';

export const wordCounterConfigSchema = z.object({});
export type Config = z.infer<typeof wordCounterConfigSchema>;

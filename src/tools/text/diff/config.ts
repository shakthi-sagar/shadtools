import { z } from 'astro/zod';

export const diffConfigSchema = z.object({});
export type Config = z.infer<typeof diffConfigSchema>;

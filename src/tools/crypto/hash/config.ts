import { z } from 'astro/zod';

export const hashConfigSchema = z.object({});
export type Config = z.infer<typeof hashConfigSchema>;

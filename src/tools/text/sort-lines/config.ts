import { z } from 'astro/zod';

export const sortLinesConfigSchema = z.object({});
export type Config = z.infer<typeof sortLinesConfigSchema>;

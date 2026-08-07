import { z } from 'astro/zod';

export const uuidConfigSchema = z.object({});
export type Config = z.infer<typeof uuidConfigSchema>;

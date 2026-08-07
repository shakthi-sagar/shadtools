import { z } from 'astro/zod';

export const weightConfigSchema = z.object({});
export type Config = z.infer<typeof weightConfigSchema>;

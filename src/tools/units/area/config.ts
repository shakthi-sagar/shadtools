import { z } from 'astro/zod';

export const areaConfigSchema = z.object({});
export type Config = z.infer<typeof areaConfigSchema>;

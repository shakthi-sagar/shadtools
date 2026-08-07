import { z } from 'astro/zod';

export const jsonValidatorConfigSchema = z.object({});
export type Config = z.infer<typeof jsonValidatorConfigSchema>;

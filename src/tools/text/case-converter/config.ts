import { z } from 'astro/zod';

export const caseconverterConfigSchema = z.object({});
export type Config = z.infer<typeof caseconverterConfigSchema>;

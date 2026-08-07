import { z } from 'astro/zod';

export const temperatureConfigSchema = z.object({});
export type Config = z.infer<typeof temperatureConfigSchema>;

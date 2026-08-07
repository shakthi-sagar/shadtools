import { z } from 'astro/zod';

export const percentageCalcConfigSchema = z.object({
  precision: z.number().int().min(0).max(10).default(2),
});

export type PercentageCalcConfig = z.infer<typeof percentageCalcConfigSchema>;

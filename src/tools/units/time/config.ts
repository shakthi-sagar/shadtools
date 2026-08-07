import { z } from 'zod';

export const timeConfigSchema = z.object({
  defaultAmount: z.number().default(1),
  defaultFromUnit: z.string().default('hour'),
  defaultToUnit: z.string().default('minute'),
});

export type TimeConfig = z.infer<typeof timeConfigSchema>;

import { z } from 'zod';

export const speedConfigSchema = z.object({
  defaultAmount: z.number().default(100),
  defaultFromUnit: z.string().default('kilometer-per-hour'),
  defaultToUnit: z.string().default('mile-per-hour'),
});

export type SpeedConfig = z.infer<typeof speedConfigSchema>;

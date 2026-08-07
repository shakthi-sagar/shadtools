import { z } from 'zod';

export const volumeConfigSchema = z.object({
  defaultAmount: z.number().default(1),
  defaultFromUnit: z.string().default('liter'),
  defaultToUnit: z.string().default('gallon'),
});

export type VolumeConfig = z.infer<typeof volumeConfigSchema>;

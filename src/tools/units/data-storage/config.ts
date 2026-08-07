import { z } from 'zod';

export const dataStorageConfigSchema = z.object({
  defaultAmount: z.number().default(1),
  defaultFromUnit: z.string().default('gigabyte'),
  defaultToUnit: z.string().default('megabyte'),
});

export type DataStorageConfig = z.infer<typeof dataStorageConfigSchema>;

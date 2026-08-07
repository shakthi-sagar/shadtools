import { z } from 'astro/zod';

export const lengthConverterConfigSchema = z.object({
  defaultFromUnit: z.string().default('m'),
  defaultToUnit: z.string().default('ft'),
});

export type LengthConverterConfig = z.infer<typeof lengthConverterConfigSchema>;

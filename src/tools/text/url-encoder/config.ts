import { z } from 'zod';

export const urlEncoderConfigSchema = z.object({
  defaultMode: z.enum(['encode', 'decode']).default('encode'),
});

export type UrlEncoderConfig = z.infer<typeof urlEncoderConfigSchema>;

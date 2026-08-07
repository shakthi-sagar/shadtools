import { z } from 'astro/zod';

export const base64EncodeConfigSchema = z.object({
  defaultMode: z.enum(['encode', 'decode']).default('encode'),
});

export type Base64EncodeConfig = z.infer<typeof base64EncodeConfigSchema>;

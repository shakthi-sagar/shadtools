import { z } from 'zod';

export const jsonMinifierConfigSchema = z.object({
  defaultInput: z.string().optional(),
});

export type JsonMinifierConfig = z.infer<typeof jsonMinifierConfigSchema>;

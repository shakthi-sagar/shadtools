import { z } from 'astro/zod';

export const currencyConverterConfigSchema = z.object({
  defaultFromCurrency: z.string().default('USD'),
  defaultToCurrency: z.string().default('EUR'),
});

export type CurrencyConverterConfig = z.infer<typeof currencyConverterConfigSchema>;

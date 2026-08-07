import type { ToolModule } from '@/tools/tool-module';
import { currencyConverterConfigSchema } from '@/tools/currency/converter/config';

export const toolModule = {
  key: 'currency/converter',
  pattern: 'converter',
  privacyMode: 'remote-data',
  configSchema: currencyConverterConfigSchema,
} satisfies ToolModule;

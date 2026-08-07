import type { ToolModule } from '../../tool-module';
import { currencyConverterConfigSchema } from './config';

export const toolModule = {
  key: 'currency/converter',
  pattern: 'converter',
  privacyMode: 'remote-data',
  configSchema: currencyConverterConfigSchema,
} satisfies ToolModule;

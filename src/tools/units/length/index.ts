import type { ToolModule } from '../../tool-module';
import { lengthConverterConfigSchema } from './config';
import { lengthSeoProvider } from './seo';

export const toolModule = {
  key: 'units/length',
  pattern: 'converter',
  privacyMode: 'local',
  configSchema: lengthConverterConfigSchema,
  seoPages: lengthSeoProvider,
} satisfies ToolModule;

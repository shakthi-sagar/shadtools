import type { ToolModule } from '../../tool-module';
import { lengthConverterConfigSchema } from './config';

export const toolModule = {
  key: 'units/length',
  pattern: 'converter',
  privacyMode: 'local',
  configSchema: lengthConverterConfigSchema,
} satisfies ToolModule;

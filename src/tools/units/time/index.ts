import type { ToolModule } from '@/tools/tool-module';
import { timeConfigSchema } from './config';
import { timeSeoProvider } from './seo';

export const toolModule: ToolModule = {
  key: 'units/time',
  pattern: 'converter',
  privacyMode: 'local',
  analytics: {
    category: 'units',
    actionType: 'convert',
  },
  configSchema: timeConfigSchema,
  seoPages: timeSeoProvider,
};

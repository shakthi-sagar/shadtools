import type { ToolModule } from '@/tools/tool-module';
import { volumeConfigSchema } from './config';
import { volumeSeoProvider } from './seo';

export const toolModule: ToolModule = {
  key: 'units/volume',
  pattern: 'converter',
  privacyMode: 'local',
  analytics: {
    category: 'units',
    actionType: 'convert',
  },
  configSchema: volumeConfigSchema,
  seoPages: volumeSeoProvider,
};

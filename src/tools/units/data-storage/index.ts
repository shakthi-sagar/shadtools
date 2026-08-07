import type { ToolModule } from '@/tools/tool-module';
import { dataStorageConfigSchema } from './config';
import { dataStorageSeoProvider } from './seo';

export const toolModule: ToolModule = {
  key: 'units/data-storage',
  pattern: 'converter',
  privacyMode: 'local',
  analytics: {
    category: 'units',
    actionType: 'convert',
  },
  configSchema: dataStorageConfigSchema,
  seoPages: dataStorageSeoProvider,
};

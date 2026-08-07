import type { ToolModule } from '@/tools/tool-module';
import { areaConfigSchema } from './config';
import { areaSeoProvider } from './seo';

export const toolModule = {
  key: 'units/area',
  pattern: 'converter',
  privacyMode: 'local',
  analytics: {
    category: 'units',
    actionType: 'convert',
  },
  configSchema: areaConfigSchema,
  seoPages: areaSeoProvider,
} satisfies ToolModule;

import type { ToolModule } from '@/tools/tool-module';
import { speedConfigSchema } from './config';
import { speedSeoProvider } from './seo';

export const toolModule: ToolModule = {
  key: 'units/speed',
  pattern: 'converter',
  privacyMode: 'local',
  analytics: {
    category: 'units',
    actionType: 'convert',
  },
  configSchema: speedConfigSchema,
  seoPages: speedSeoProvider,
};

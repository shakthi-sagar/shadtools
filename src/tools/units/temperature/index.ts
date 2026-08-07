import type { ToolModule } from '@/tools/tool-module';
import { temperatureConfigSchema } from '@/tools/units/temperature/config';
import { temperatureSeoProvider } from '@/tools/units/temperature/seo';

export const toolModule = {
  key: 'units/temperature',
  pattern: 'converter',
  privacyMode: 'local',
  analytics: {
    category: 'units',
    actionType: 'convert',
  },
  configSchema: temperatureConfigSchema,
  seoPages: temperatureSeoProvider,
} satisfies ToolModule;

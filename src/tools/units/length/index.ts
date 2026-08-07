import type { ToolModule } from '@/tools/tool-module';
import { lengthConverterConfigSchema } from '@/tools/units/length/config';
import { lengthSeoProvider } from '@/tools/units/length/seo';

export const toolModule = {
  key: 'units/length',
  pattern: 'converter',
  privacyMode: 'local',
  configSchema: lengthConverterConfigSchema,
  seoPages: lengthSeoProvider,
} satisfies ToolModule;

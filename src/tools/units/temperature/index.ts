import type { ToolModule } from '@/tools/tool-module';
import { temperatureConfigSchema } from '@/tools/units/temperature/config';

export const toolModule = {
  key: 'units/temperature',
  pattern: 'code-editor',
  privacyMode: 'local',
  configSchema: temperatureConfigSchema,
} satisfies ToolModule;

import type { ToolModule } from '@/tools/tool-module';
import { weightConfigSchema } from '@/tools/units/weight/config';

export const toolModule = {
  key: 'units/weight',
  pattern: 'code-editor',
  privacyMode: 'local',
  configSchema: weightConfigSchema,
} satisfies ToolModule;

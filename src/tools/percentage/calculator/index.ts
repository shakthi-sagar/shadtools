import type { ToolModule } from '@/tools/tool-module';
import { percentageCalcConfigSchema } from '@/tools/percentage/calculator/config';

export const toolModule = {
  key: 'percentage/calculator',
  pattern: 'calculator',
  privacyMode: 'local',
  configSchema: percentageCalcConfigSchema,
} satisfies ToolModule;

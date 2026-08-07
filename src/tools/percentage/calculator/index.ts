import type { ToolModule } from '../../tool-module';
import { percentageCalcConfigSchema } from './config';

export const toolModule = {
  key: 'percentage/calculator',
  pattern: 'calculator',
  privacyMode: 'local',
  configSchema: percentageCalcConfigSchema,
} satisfies ToolModule;

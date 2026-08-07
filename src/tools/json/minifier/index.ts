import type { ToolModule } from '@/tools/tool-module';
import { jsonMinifierConfigSchema } from './config';

export const toolModule: ToolModule = {
  key: 'json/minifier',
  pattern: 'code-editor',
  privacyMode: 'local',
  analytics: {
    category: 'json',
    actionType: 'transform',
  },
  configSchema: jsonMinifierConfigSchema,
};

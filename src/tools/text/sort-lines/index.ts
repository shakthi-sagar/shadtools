import type { ToolModule } from '@/tools/tool-module';
import { sortLinesConfigSchema } from './config';

export const toolModule = {
  key: 'text/sort-lines',
  pattern: 'code-editor',
  privacyMode: 'local',
  analytics: {
    category: 'text',
    actionType: 'transform',
  },
  configSchema: sortLinesConfigSchema,
} satisfies ToolModule;

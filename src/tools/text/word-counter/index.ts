import type { ToolModule } from '@/tools/tool-module';
import { wordCounterConfigSchema } from './config';

export const toolModule = {
  key: 'text/word-counter',
  pattern: 'code-editor',
  privacyMode: 'local',
  analytics: {
    category: 'text',
    actionType: 'inspect',
  },
  configSchema: wordCounterConfigSchema,
} satisfies ToolModule;

import type { ToolModule } from '@/tools/tool-module';
import { jsonValidatorConfigSchema } from './config';

export const toolModule = {
  key: 'json/validator',
  pattern: 'code-editor',
  privacyMode: 'local',
  analytics: {
    category: 'json',
    actionType: 'inspect',
  },
  configSchema: jsonValidatorConfigSchema,
} satisfies ToolModule;

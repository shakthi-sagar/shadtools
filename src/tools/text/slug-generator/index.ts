import type { ToolModule } from '@/tools/tool-module';
import { slugGeneratorConfigSchema } from './config';

export const toolModule = {
  key: 'text/slug-generator',
  pattern: 'code-editor',
  privacyMode: 'local',
  analytics: {
    category: 'text',
    actionType: 'transform',
  },
  configSchema: slugGeneratorConfigSchema,
} satisfies ToolModule;

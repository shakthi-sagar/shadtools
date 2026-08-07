import type { ToolModule } from '@/tools/tool-module';
import { urlEncoderConfigSchema } from './config';

export const toolModule: ToolModule = {
  key: 'text/url-encoder',
  pattern: 'code-editor',
  privacyMode: 'local',
  analytics: {
    category: 'text',
    actionType: 'transform',
  },
  configSchema: urlEncoderConfigSchema,
};

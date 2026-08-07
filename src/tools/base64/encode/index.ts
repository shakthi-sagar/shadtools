import type { ToolModule } from '@/tools/tool-module';
import { base64EncodeConfigSchema } from '@/tools/base64/encode/config';

export const toolModule = {
  key: 'base64/encode',
  pattern: 'code-editor',
  privacyMode: 'local',
  configSchema: base64EncodeConfigSchema,
} satisfies ToolModule;

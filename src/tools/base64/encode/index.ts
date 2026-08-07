import type { ToolModule } from '../../tool-module';
import { base64EncodeConfigSchema } from './config';

export const toolModule = {
  key: 'base64/encode',
  pattern: 'code-editor',
  privacyMode: 'local',
  configSchema: base64EncodeConfigSchema,
} satisfies ToolModule;

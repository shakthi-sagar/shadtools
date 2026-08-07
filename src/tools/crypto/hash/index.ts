import type { ToolModule } from '../../tool-module';
import { hashConfigSchema } from './config';

export const toolModule = {
  key: 'crypto/hash',
  pattern: 'code-editor',
  privacyMode: 'local',
  configSchema: hashConfigSchema,
} satisfies ToolModule;

import type { ToolModule } from '@/tools/tool-module';
import { uuidConfigSchema } from '@/tools/crypto/uuid/config';

export const toolModule = {
  key: 'crypto/uuid',
  pattern: 'code-editor',
  privacyMode: 'local',
  configSchema: uuidConfigSchema,
} satisfies ToolModule;

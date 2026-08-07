import type { ToolModule } from '@/tools/tool-module';
import { hashConfigSchema } from '@/tools/crypto/hash/config';

export const toolModule = {
  key: 'crypto/hash',
  pattern: 'code-editor',
  privacyMode: 'local',
  configSchema: hashConfigSchema,
} satisfies ToolModule;

import type { ToolModule } from '@/tools/tool-module';
import { diffConfigSchema } from '@/tools/text/diff/config';

export const toolModule = {
  key: 'text/diff',
  pattern: 'code-editor',
  privacyMode: 'local',
  configSchema: diffConfigSchema,
} satisfies ToolModule;

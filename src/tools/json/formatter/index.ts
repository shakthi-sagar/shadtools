import type { ToolModule } from '@/tools/tool-module';
import { jsonFormatterConfigSchema } from '@/tools/json/formatter/config';

export const toolModule = {
  key: 'json/formatter',
  pattern: 'code-editor',
  privacyMode: 'local',
  configSchema: jsonFormatterConfigSchema,
} satisfies ToolModule;

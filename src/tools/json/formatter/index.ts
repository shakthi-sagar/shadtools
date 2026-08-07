import type { ToolModule } from '../../tool-module';
import { jsonFormatterConfigSchema } from './config';

export const toolModule = {
  key: 'json/formatter',
  pattern: 'code-editor',
  privacyMode: 'local',
  configSchema: jsonFormatterConfigSchema,
} satisfies ToolModule;

import type { ToolModule } from '../../tool-module';
import { diffConfigSchema } from './config';

export const toolModule = {
  key: 'text/diff',
  pattern: 'code-editor',
  privacyMode: 'local',
  configSchema: diffConfigSchema,
} satisfies ToolModule;

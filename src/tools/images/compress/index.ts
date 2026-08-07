import type { ToolModule } from '../../tool-module';
import { imageCompressConfigSchema } from './config';

export const toolModule = {
  key: 'images/compress',
  pattern: 'file',
  privacyMode: 'local',
  configSchema: imageCompressConfigSchema,
} satisfies ToolModule;

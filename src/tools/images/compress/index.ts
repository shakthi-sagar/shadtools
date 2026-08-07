import type { ToolModule } from '@/tools/tool-module';
import { imageCompressConfigSchema } from '@/tools/images/compress/config';

export const toolModule = {
  key: 'images/compress',
  pattern: 'file',
  privacyMode: 'local',
  configSchema: imageCompressConfigSchema,
} satisfies ToolModule;

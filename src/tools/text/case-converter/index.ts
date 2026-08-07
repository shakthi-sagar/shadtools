import type { ToolModule } from '@/tools/tool-module';
import { caseconverterConfigSchema } from '@/tools/text/case-converter/config';

export const toolModule = {
  key: 'text/case-converter',
  pattern: 'code-editor',
  privacyMode: 'local',
  configSchema: caseconverterConfigSchema,
} satisfies ToolModule;

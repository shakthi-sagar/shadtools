import type { z } from "astro/zod";

export type ToolPattern =
  | "code-editor"
  | "file"
  | "calculator"
  | "converter"
  | "generator";

export interface ToolModule<TSchema extends z.ZodType = z.ZodType> {
  key: `${string}/${string}`;
  pattern: ToolPattern;
  configSchema: TSchema;
  privacyMode: "local" | "remote-data" | "server-processing";
}

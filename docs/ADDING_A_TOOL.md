# Step-by-Step Guide: Adding a New Tool to ShadTools

This document provides a step-by-step developer tutorial for scaffolding, building, testing, validating, and publishing new utility tools in ShadTools.

---

## 1. Automatic CLI Scaffolding (Recommended)

ShadTools includes an automated generator CLI that scaffolds all required files across the codebase in one command:

```bash
npm run create-tool <namespace> <slug> "[Tool Name]"
```

### Example:
```bash
npm run create-tool json yaml "JSON to YAML Converter"
```

This command automatically generates:
1. `src/tools/json/yaml/config.ts` (Tool configuration object)
2. `src/tools/json/yaml/index.ts` (Tool module export)
3. `src/tools/json/yaml/Renderer.astro` (Astro Island wrapper)
4. `src/tools/json/yaml/YamlTool.tsx` (Interactive React component)
5. `src/tools/json/yaml/yaml.ts` (Pure business logic calculation engine)
6. `src/tools/json/yaml/yaml.test.ts` (Vitest unit test file)
7. `src/content/tools/json/yaml.md` (Content schema, SEO metadata, & FAQs)

---

## 2. Implementing the Pure Engine Logic

Build your calculation/transformation engine inside `src/tools/[namespace]/[slug]/[slug].ts` as a pure, deterministic JavaScript/TypeScript module without DOM or React dependencies.

```ts
// Example: src/tools/json/yaml/yaml.ts
export function convertJsonToYaml(jsonInput: string): { success: boolean; output: string; error?: string } {
  if (!jsonInput.trim()) return { success: true, output: '' };
  try {
    const parsed = JSON.parse(jsonInput);
    // Perform transformation...
    return { success: true, output: yamlString };
  } catch (err: any) {
    return { success: false, output: '', error: err.message };
  }
}
```

---

## 3. Writing Unit Tests

Write Vitest unit tests in `src/tools/[namespace]/[slug]/[slug].test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { convertJsonToYaml } from './yaml';

describe('JSON to YAML Converter Engine', () => {
  it('converts valid JSON object to YAML string', () => {
    const res = convertJsonToYaml('{"name":"ShadTools"}');
    expect(res.success).toBe(true);
    expect(res.output).toContain('name: ShadTools');
  });
});
```

---

## 4. Implementing the React UI Island Component

Build your UI component in `src/tools/[namespace]/[slug]/[Slug]Tool.tsx`.

### Design Guidelines:
- Import all UI elements using `@/*` aliases (`import { Button } from '@/components/ui/Button'`).
- For editor/text tools, reuse `CodeEditorPane` from `@/components/tool-ui/CodeEditorPane`.
- For unit converters, align inputs in a 3-column grid (`grid-cols-1 sm:grid-cols-3 gap-4 items-start`) with equal `h-10` controls and put the Copy button inside the `CONVERTED RESULT` card header.

---

## 5. Completing the Content Markdown Schema

Edit `src/content/tools/[namespace]/[slug].md`:
- Set `status: published`.
- Add primary keyword and long-tail SEO keywords.
- Include at least 3 FAQ question-and-answer pairs.
- Add related tools in the `relatedTools` array.

---

## 6. Verification & Quality Diagnostics

Run the full validation suite before completing your task:

```bash
# 1. Run Registry & Schema Validator
npm run validate

# 2. Check TypeScript & Astro compilation
npx tsc --noEmit

# 3. Run Vitest Unit Tests
npm run test

# 4. Build Static Site & Search Index
npm run build
```

# Adding a Tool to ShadTools

This guide explains how to add a new tool to ShadTools step-by-step.

## 1. Quick Scaffold

Run the CLI helper script to generate the complete tool scaffolding:

```bash
npm run create-tool <namespace> <slug> "[Tool Name]"
```

Example:

```bash
npm run create-tool text diff "Text Diff Checker"
```

This automatically generates:
1. `src/tools/text/diff/index.ts`
2. `src/tools/text/diff/Renderer.astro`
3. `src/tools/text/diff/TextDiffTool.tsx`
4. `src/tools/text/diff/diff.ts`
5. `src/tools/text/diff/diff.test.ts`
6. `src/tools/text/diff/config.ts`
7. `src/content/tools/text/diff.md`

---

## 2. Implement the Business Logic

Write your pure, testable transformation logic inside `src/tools/<namespace>/<slug>/<slug>.ts`.

```ts
export function processDiff(text1: string, text2: string): DiffResult {
  // Pure business logic
}
```

Write unit tests for your logic in `src/tools/<namespace>/<slug>/<slug>.test.ts`.

---

## 3. Build the Interactive Component

Build the UI inside `src/tools/<namespace>/<slug>/<ToolName>Tool.tsx` using reusable UI components from `src/components/tool-ui/` (`ToolShell`, `CodeEditorShell`, `FileDropzone`, `CalculatorLayout`, `ResultPanel`, `ToolToolbar`, `ToolStatus`).

---

## 4. Verify & Validate

Run the build & validation suite:

```bash
npm run validate
npm run test
npm run check
npm run build
```

Zero manual changes are needed in `registry.ts`, `[slug].astro`, search index, or sitemap. Everything is auto-discovered!

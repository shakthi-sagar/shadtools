# AI Tool Contribution Specification & Workflow Guide

This specification defines the rules for creating new tool definitions and implementations for **ShadTools** (`shadtools.com`).

---

## 📋 Strict Rules for Tool Generation

Every tool in ShadTools follows a **namespace-first 2-tier architecture** (`/namespace/slug`):

1. **Namespace Taxonomy**:
   - Every tool belongs to a public namespace (e.g. `json`, `base64`, `images`, `currency`, `percentage`, `units`).
   - Standard URL format: `/{namespace}/{slug}` (e.g., `/json/formatter`).

2. **Co-located Tool Module Structure**:
   Each tool implementation lives in `src/tools/<namespace>/<slug>/` and consists of 6 core files:
   - `index.ts` (module definition satisfying `ToolModule`)
   - `Renderer.astro` (Astro component directly importing the React tool with dynamic hydration)
   - `[ToolName]Tool.tsx` (Interactive React component)
   - `[slug].ts` (Pure business logic engine)
   - `[slug].test.ts` (Engine unit test)
   - `config.ts` (Zod configuration schema)

3. **Content Collection Markdown**:
   The metadata, SEO, and prose content live in `src/content/tools/<namespace>/<slug>.md`:
   - Must specify `renderer: "<namespace>/<slug>"`
   - Must specify `pattern: "code-editor" | "file" | "calculator" | "converter" | "generator"`
   - Must specify `privacy` processing mode (`local`, `remote-data`, or `server-processing`)

4. **Zero Server Claims**:
   - Tools processing data locally must explicitly specify `privacy: { processing: "local", message: "..." }`.

5. **Automatic Verification**:
   - Scaffold a new tool using: `npm run create-tool <namespace> <slug> [name]`
   - Pass all validation checks using: `npm run validate` and `npm run test`.

---

## 🤖 Tool Creation CLI Command

To generate a new tool template automatically:

```bash
npm run create-tool json validator "JSON Validator"
```

This creates all implementation files in `src/tools/json/validator/` and the content markdown in `src/content/tools/json/validator.md`.

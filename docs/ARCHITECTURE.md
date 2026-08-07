# ShadTools Architecture Specification

## 1. Taxonomy & URL Hierarchy

ShadTools organizes tools in a clean 2-tier hierarchy:

```text
Namespace → Tool
```

### URL Mapping
- `/json` → Namespace Hub (lists all JSON tools, documentation, related tools)
- `/json/formatter` → Tool Page (interactive JSON Formatter tool)
- `/base64/encode` → Tool Page (interactive Base64 Encoder tool)
- `/images/compress` → Tool Page (interactive Image Compressor tool)

---

## 2. Directory Structure

```text
shadtools/
├── public/
│   ├── favicon.svg
│   ├── robots.txt
│   └── _headers
├── scripts/
│   ├── create-tool.ts
│   └── validate-tools.ts
├── src/
│   ├── content.config.ts                # Typed Content Collections (Tools, Namespaces)
│   ├── content/
│   │   ├── config.ts                    # Re-export for Astro compatibility
│   │   ├── namespaces/
│   │   │   ├── json.md
│   │   │   ├── base64.md
│   │   │   ├── images.md
│   │   │   ├── currency.md
│   │   │   ├── percentage.md
│   │   │   └── units.md
│   │   └── tools/
│   │       ├── json/
│   │       │   └── formatter.md
│   │       ├── base64/
│   │       │   └── encode.md
│   │       ├── images/
│   │       │   └── compress.md
│   │       ├── currency/
│   │       │   └── converter.md
│   │       ├── percentage/
│   │       │   └── calculator.md
│   │       └── units/
│   │           └── length.md
│   ├── pages/
│   │   ├── index.astro
│   │   ├── search.astro
│   │   ├── 404.astro
│   │   ├── [section].astro              # Namespace Hubs (/json)
│   │   ├── [namespace]/
│   │   │   └── [slug].astro             # Tool Pages (/json/formatter)
│   │   ├── privacy.astro
│   │   ├── terms.astro
│   │   ├── disclaimer.astro
│   │   └── contact.astro
│   ├── tools/
│   │   ├── registry.ts                  # Import.meta.glob tool renderer & module discovery
│   │   ├── tool-module.ts               # ToolModule contract interface
│   │   ├── json/
│   │   │   └── formatter/
│   │   │       ├── index.ts
│   │   │       ├── Renderer.astro
│   │   │       ├── JsonFormatterTool.tsx
│   │   │       ├── format-json.ts
│   │   │       ├── format-json.test.ts
│   │   │       └── config.ts
│   │   ├── base64/
│   │   │   └── encode/
│   │   ├── images/
│   │   │   └── compress/
│   │   ├── currency/
│   │   │   └── converter/
│   │   ├── percentage/
│   │   │   └── calculator/
│   │   └── units/
│   │       └── length/
│   ├── components/
│   │   ├── ui/
│   │   ├── tool-ui/                      # Reusable tool UI shells (ToolShell, CodeEditorShell, FileDropzone, etc.)
│   │   ├── site/
│   │   └── seo/
│   ├── layouts/
│   │   ├── BaseLayout.astro
│   │   └── ToolLayout.astro
│   └── styles/
│       ├── tokens.css
│       └── base.css
```

---

## 3. Data & Implementation Separation

- **Content Markdown (`src/content/tools/<namespace>/<slug>.md`)**: Contains metadata, SEO titles, descriptions, instructions, examples, FAQs, and `renderer: "json/formatter"`. Contains zero UI logic.
- **Tool Implementation (`src/tools/<namespace>/<tool>/`)**: Co-located tool module containing React interface, pure engine functions, unit tests, Zod config schema, `Renderer.astro` wrapper, and `index.ts` definition.
- **Registry (`src/tools/registry.ts`)**: Auto-discovers tool modules and `Renderer.astro` wrappers via `import.meta.glob`.

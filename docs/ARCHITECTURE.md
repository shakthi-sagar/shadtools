# ShadTools Architecture Specification

## 1. Taxonomy & URL Hierarchy

ShadTools organizes tools in a 3-tier hierarchy:

```text
Category → Namespace → Tool
```

### URL Mapping
- `/developer-tools` → Category Hub (lists all namespaces under Developer Tools: JSON, XML, CSV, Base64, etc.)
- `/json` → Namespace Hub (lists all JSON tools, quick JSON formatter widget, documentation, related tools)
- `/json/formatter` → Tool Page (interactive JSON Formatter tool)

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
│   ├── validate-tools.ts
│   ├── generate-search-index.ts
│   └── validate-links.ts
├── src/
│   ├── content/
│   │   ├── config.ts
│   │   ├── categories/
│   │   │   ├── developer-tools.md
│   │   │   ├── document-tools.md
│   │   │   ├── image-tools.md
│   │   │   ├── finance-tools.md
│   │   │   └── time-and-unit-tools.md
│   │   ├── namespaces/
│   │   │   ├── json.md
│   │   │   ├── xml.md
│   │   │   ├── csv.md
│   │   │   ├── yaml.md
│   │   │   ├── base64.md
│   │   │   ├── pdf.md
│   │   │   ├── images.md
│   │   │   ├── currency.md
│   │   │   └── units.md
│   │   └── tools/
│   │       ├── json/
│   │       │   ├── formatter.md
│   │       │   ├── validator.md
│   │       │   ├── minifier.md
│   │       │   ├── viewer.md
│   │       │   ├── to-xml.md
│   │       │   └── to-csv.md
│   │       ├── base64/
│   │       │   ├── encode.md
│   │       │   └── decode.md
│   │       ├── images/
│   │       │   └── compress.md
│   │       └── percentage/
│   │           └── calculator.md
│   ├── pages/
│   │   ├── index.astro
│   │   ├── search.astro
│   │   ├── 404.astro
│   │   ├── [section].astro              # Category Hubs AND Namespace Hubs
│   │   ├── [namespace]/
│   │   │   └── [slug].astro             # Tool Pages (/json/formatter)
│   │   ├── privacy.astro
│   │   ├── terms.astro
│   │   ├── disclaimer.astro
│   │   └── contact.astro
│   ├── tools/
│   │   ├── registry.ts                  # Import.meta.glob tool component discovery
│   │   ├── tool.types.ts
│   │   ├── _shared/
│   │   ├── json/
│   │   │   ├── _shared/
│   │   │   ├── formatter/
│   │   │   │   ├── index.ts
│   │   │   │   ├── JsonFormatterTool.tsx
│   │   │   │   ├── format-json.ts
│   │   │   │   ├── format-json.test.ts
│   │   │   │   └── config.ts
│   │   │   └── validator/
│   │   ├── base64/
│   │   │   ├── encode/
│   │   │   └── decode/
│   │   ├── images/
│   │   │   └── compress/
│   │   └── percentage/
│   │       └── calculator/
│   ├── components/
│   │   ├── ui/
│   │   ├── tool/
│   │   ├── site/
│   │   ├── seo/
│   │   └── ads/
│   ├── layouts/
│   │   ├── BaseLayout.astro
│   │   ├── CategoryLayout.astro
│   │   ├── NamespaceLayout.astro
│   │   └── ToolLayout.astro
│   └── styles/
│       ├── tokens.css
│       ├── global.css
│       └── tool.css
```

---

## 3. Data & Implementation Separation

- **Content Markdown (`src/content/tools/<namespace>/<slug>.md`)**: Contains metadata, SEO titles, descriptions, instructions, examples, FAQs, and `renderer: "json/formatter"`. Contains zero UI logic.
- **Tool Implementation (`src/tools/<namespace>/<tool>/`)**: Contains React interface, transformation logic, unit tests, and `index.ts` export.
- **Registry (`src/tools/registry.ts`)**: Auto-discovers tool modules via `import.meta.glob` matching `renderer` key to React component.

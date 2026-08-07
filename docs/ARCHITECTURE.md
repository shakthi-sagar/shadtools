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

## 2. Frozen Directory Structure

```text
src/
├── content/
│   ├── namespaces/                   # Namespace metadata markdown (json.md, base64.md, etc.)
│   └── tools/                        # Tool metadata markdown (json/formatter.md, etc.)
│
├── tools/
│   ├── registry.ts                   # Import.meta.glob tool renderer & module discovery
│   ├── tool-module.ts                # ToolModule contract interface
│   ├── tool.types.ts                 # Shared tool TypeScript interfaces
│   ├── _shared/                      # Cross-cutting tool helpers (files, downloads, workers)
│   ├── json/
│   │   ├── _shared/                  # Domain shared utilities
│   │   └── formatter/
│   │       ├── index.ts              # ToolModule export
│   │       ├── Renderer.astro        # Isolated Astro React wrapper with client:load
│   │       ├── JsonFormatterTool.tsx # Interactive React component
│   │       ├── format-json.ts        # Pure business logic engine
│   │       ├── format-json.test.ts   # Engine unit test
│   │       └── config.ts             # Zod config schema
│   ├── base64/
│   ├── images/
│   ├── currency/
│   ├── percentage/
│   └── units/
│
├── components/
│   ├── ui/                           # Base UI primitives (Button, Input, FormField, Select, etc.)
│   ├── tool-ui/                      # Reusable tool UI shells (ToolShell, CodeEditorShell, FileDropzone, etc.)
│   ├── tool-page/                    # Tool page sections (ToolHeader, PrivacyNotice, Examples, Faq, etc.)
│   ├── site/                         # Layout components (Header, Footer, Breadcrumbs, SearchTrigger, etc.)
│   ├── seo/                          # MetaHead, BreadcrumbJsonLd, WebApplicationJsonLd
│   └── ads/                          # AdSlot, AdPlaceholder
│
├── layouts/
│   ├── BaseLayout.astro
│   ├── HubLayout.astro
│   ├── ToolLayout.astro
│   └── LegalLayout.astro
│
├── lib/
│   ├── catalog/                      # get-namespaces.ts, get-tools.ts, resolve-related-tools.ts
│   ├── routing.ts                    # Centralized route & URL helpers (getToolUrl, getNamespaceSlug, etc.)
│   ├── routing/                      # route-identity.ts, tool-url.ts
│   ├── seo/                          # canonical.ts, metadata.ts, robots.ts
│   ├── search/                       # search.types.ts
│   └── files/                        # download.ts, file-validation.ts
│
├── pages/
│   ├── index.astro                   # Home utility launcher
│   ├── [namespace].astro             # Namespace Hub (/json)
│   ├── [namespace]/
│   │   └── [slug].astro              # Dynamic Tool Route (/json/formatter)
│   ├── search.astro                  # Pagefind client search
│   ├── 404.astro
│   ├── privacy.astro
│   ├── terms.astro
│   ├── disclaimer.astro
│   └── contact.astro
│
└── styles/
    ├── tokens.css                    # CSS variables & 4-level surface hierarchy
    ├── base.css
    ├── components.css
    ├── prose.css
    ├── utilities.css
    └── global.css
```

---

## 3. Data & Implementation Pipeline

```text
Content Entry (src/content/tools/json/formatter.md)
    ↓
Renderer Key ("json/formatter")
    ↓
Registry (src/tools/registry.ts)
    ↓
Module Config Validation (Zod schema)
    ↓
Renderer.astro (Astro wrapper)
    ↓
React Tool Component (src/tools/json/formatter/JsonFormatterTool.tsx)
```

## 4. Status & Publication Workflow

- `status: draft` → Page is not rendered in search indices, default status for `npm run create-tool`.
- `status: published` → Dynamic route generates page in static build.
- `seo.noindex: true` → Page route is generated, but renders `<meta name="robots" content="noindex, nofollow" />` and is excluded from sitemap.xml.

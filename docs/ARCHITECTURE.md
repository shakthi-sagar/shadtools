# System Architecture & Directory Specification

ShadTools is designed as a zero-latency, local-first utility platform built with **Astro**, **React Islands**, **TypeScript**, and **Tailwind CSS**, hosted on **Cloudflare Pages**.

---

## 1. High-Level Architecture Overview

```text
User Request → Cloudflare Pages CDN (Edge Static HTML)
                      │
                      ├── Fast Initial Paint (Static Astro HTML + CSS Tokens)
                      │
                      └── Hydration (<ReactIsland client:load />)
                            │
                            └── 100% In-Browser Execution (Web Crypto, Canvas, Wasm)
```

- **Static Pre-rendering**: Every tool page, category hub, SEO variant page, and documentation page is compiled ahead of time into static HTML files in `dist/`.
- **Client-Side Processing**: Computation is performed directly in the user's browser memory (Web Crypto API for cryptographic hashes, HTML5 Canvas for image compression, native JS algorithms for text diffs/formatting).
- **Client-Side Search**: Integrated Pagefind static indexing enables instant full-text search (`⌘K`) across all tools without any external API calls.

---

## 2. Directory Layout & Module Structure

```text
shadtools/
├── docs/
│   ├── ARCHITECTURE.md     # System Architecture & Technical Manual (This file)
│   ├── DESIGN_SYSTEM.md    # Design System v2 Tokens & UI Specifications
│   └── ADDING_A_TOOL.md    # Developer Tutorial & Tool Creation Guide
├── scripts/
│   ├── create-tool.ts              # CLI Tool Generator
│   ├── convert-relative-imports.ts # Import alias converter
│   ├── validate-tools.ts           # Schema & registry validator
│   └── validate-styles.ts          # Stale design system token validator
├── src/
│   ├── components/
│   │   ├── seo/         # JsonLd, MetaHead, OpenGraph
│   │   ├── site/        # Header, Footer, HeaderSearch, DashboardIsland, ToolPickerModal
│   │   ├── tool-page/   # ToolHeader, PrivacyNotice, Faq, RelatedTools, AdSlot
│   │   ├── tool-ui/     # CodeEditorPane, ToolFrame, ToolPane, ResultPanel, FileDropzone
│   │   └── ui/          # Button, Dialog, Disclosure, Tooltip, Badge, Progress, Tabs
│   ├── content/
│   │   ├── namespaces/  # Namespace metadata definitions
│   │   └── tools/       # Markdown docs & tool metadata schemas
│   ├── layouts/         # BaseLayout, ToolLayout, HubLayout, LegalLayout
│   ├── lib/             # dashboard-store, routing, catalog, analytics
│   ├── styles/          # tokens.css, base.css, prose.css, global.css
│   └── tools/           # Modular tool logic, React UI components, & Vitest test files
```

---

## 3. Dynamic Routing & Tool Resolution

Tool pages are dynamically generated using Astro's `[namespace]/[slug].astro` dynamic route:
1. `src/pages/[namespace]/[slug].astro` reads entries from `src/content/tools/`.
2. It looks up the associated renderer component mapped in `src/tools/registry.ts`.
3. It loads the React island component with `client:load` for immediate interactivity.

---

## 4. Cloudflare Pages Deployment Pipeline

1. **Build Command**: `npm run build` (`astro build && pagefind --site dist`)
2. **Build Output**: `dist/`
3. **Security Headers**: Managed via `public/_headers` (CSP, `X-Frame-Options`, `X-Content-Type-Options`).

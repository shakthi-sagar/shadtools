# ShadTools Production SEO, Indexing & Acquisition Policy

This document defines the architectural pipeline and strict indexability rules governing search engine acquisition in ShadTools.

---

## 1. Acquisition Pipeline Architecture

```
[SEO Provider / Tool Module]
           │
           ▼
[Static Route Generator] ──► [Canonical URL Hardener]
           │                         │
           ▼                         ▼
[Astro Sitemap Integration]   [MetaHead & OpenGraph]
           │                         │
           ▼                         ▼
[robots.txt Allow / Sitemap]  [Google Indexing & Search Console]
```

### Core Pipeline Stages:
1. **SEO Page Provider**: Defines static page variants (`pair` and curated `exact` values), H1 titles, meta descriptions, and mathematical computations deterministically.
2. **Static Route Generator**: Renders static HTML entries at build time (`src/pages/[namespace]/[slug]/[variant].astro`).
3. **Canonical URL Hardener**: Ensures all pages canonicalize to their clean, absolute `https://shadtools.com` URL. Query parameters (e.g. `?value=18&from=yard&to=meter`) are stripped from canonical targets and NEVER create separate SEO surfaces.
4. **Sitemap Integration**: `@astrojs/sitemap` compiles indexable routes into `sitemap-index.xml`. Post-build automated validation (`scripts/validate-sitemap.ts`) verifies no query params, duplicates, or non-indexable pages exist.
5. **Robots Policy**: `public/robots.txt` references the production sitemap and permits crawling of all public routes without blocking CSS, JS, or Pagefind search assets.

---

## 2. Indexability Policy

### Pages Permitted for Indexing (`index, follow`):
- **Homepage** (`https://shadtools.com/`)
- **Namespace Category Hubs** (e.g. `/units`, `/json`, `/text`)
- **Primary Tool Workspaces** (e.g. `/units/length`, `/json/formatter`)
- **Curated Pair Pages** (e.g. `/units/length/meter-to-foot`)
- **Curated Exact-Value Pages** (e.g. `/units/length/10-meter-to-foot`)

### Pages Prohibited from Indexing (`noindex, nofollow`):
- **404 Error Page** (`/404`)
- **Query-State Tool URLs** (e.g. `/units/length?value=999`)
- **Search Results Page** (`/search?q=...`)
- **Draft or Invalid Variants**
- **Internal / Debug Pages**

---

## 3. Strict Expansion Directives

> **Mandatory Rule for Future Contributors & AI Agents:**
> *New programmatic SEO page families should have a defensible search-intent hypothesis and must reuse deterministic, genuinely useful data rather than filler content. Generating thousands of thin, repetitive pages without verified search demand is strictly prohibited.*

### Rules Before Adding New SEO Surface Families:
1. Verify existing SEO routes have indexability & Search Console impressions.
2. Ensure every generated route provides a direct, mathematically accurate, instant calculation result.
3. Keep titles under 70 characters and meta descriptions under 160 characters.
4. Verify every emitted link in conversion tables and link pills points to a valid static generated route using build-time validation (`npm run validate`).

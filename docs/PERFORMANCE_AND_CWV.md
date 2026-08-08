# ShadTools Performance Audit & Core Web Vitals Readiness

This document outlines the performance architecture, bundle size controls, and Core Web Vitals (CWV) guidelines for ShadTools.

---

## 1. Performance Architecture & Safeguards

### A. Minimal JavaScript & Selective Hydration
- Static SEO variant pages and legal/content pages render purely as static HTML with zero client-side React hydration overhead.
- Interactive tools isolate React component hydration strictly to client components (`client:load`) using pre-built UI archetypes (`ConverterLayout`, `TwoPaneTransform`).

### B. Automated Performance Guard (`scripts/validate-performance.ts`)
- Integrated into `npm run validate:post-build` during production build.
- Enforces strict raw bundle size thresholds (max 300KB per JS chunk) across all compiled Vite/Astro client assets in `dist/_astro/`.

### C. Cloudflare Edge Caching (`public/_headers`)
- Static JavaScript and CSS bundles (`/_astro/*`) and self-hosted fonts (`/fonts/*`) are served with immutable 1-year browser cache headers (`max-age=31536000, immutable`).
- Search index assets (`/pagefind/*`) use 1-hour cache revalidation.

---

## 2. Core Web Vitals Optimization Summary

| Metric | Target | Optimizations Implemented |
| :--- | :--- | :--- |
| **LCP (Largest Contentful Paint)** | `< 2.5s` | Clean H1 & direct answer card rendered directly in server HTML. Zero render-blocking third-party scripts. |
| **CLS (Cumulative Layout Shift)** | `< 0.1` | Fixed height layout containers (`h-10` controls), pre-calculated card bounds, font-display swap, and no layout shifting ads. |
| **INP (Interaction to Next Paint)** | `< 200ms` | Instant client-side state updates, lightweight React components, zero heavy main-thread blocking operations. |

---

## 3. Real-World Field Data Monitoring

> **Important Note:**
> Synthetic local Lighthouse scores do NOT equal real-world user performance. Core Web Vitals MUST be monitored using field data (Chrome User Experience Report / Google Search Console Core Web Vitals Report) after real user traffic flows through production.

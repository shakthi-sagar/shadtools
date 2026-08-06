# ShadTools (`shadtools.com`)

**ShadTools** is a high-performance, scalable, SEO-optimized utility web platform built with **Astro**, **TypeScript (Strict Mode)**, **Tailwind CSS**, and **React Islands Architecture**, hosted on **Cloudflare Pages**.

All conversion, formatting, calculation, and image tools run **100% locally inside the user's browser memory** — files and data never leave the client device.

---

## ⚡ Tech Stack

- **Framework**: Astro 4+ (Static Site Generation via `getStaticPaths()`)
- **Language**: TypeScript (Strict Mode)
- **Styling**: Tailwind CSS with Category HSL Accent tokens
- **Interactive Islands**: React 18
- **Unit & E2E Testing**: Vitest & Playwright
- **Hosting**: Cloudflare Pages Edge CDN
- **Analytics**: Cloudflare Web Analytics

---

## 🚀 Quick Start Commands

```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev

# 3. Run unit tests (Vitest)
npm run test

# 4. Validate tool metadata & SEO schemas
npm run validate-tools

# 5. Build static production site
npm run build

# 6. Preview production build locally
npm run preview
```

---

## 🛠️ Adding New Tools

### Option A: CLI Generator
```bash
npm run create-tool
```

### Option B: Manual Definition
Create a new file in `src/content/tools/[slug].ts` following the typed `ToolDefinition` schema.

---

## 🌐 Cloudflare Pages Deployment Checklist

1. Push your repository to **GitHub / GitLab**.
2. Log into **Cloudflare Dashboard** → **Workers & Pages** → **Create Application** → **Pages** → **Connect Git**.
3. Select the `shadtools` repository.
4. Set Build Settings:
   - **Framework Preset**: `Astro`
   - **Build Command**: `npm run build`
   - **Build Output Directory**: `dist`
5. Click **Save and Deploy**.
6. **Custom Domain Setup**:
   - Go to your Pages project → **Custom Domains** → **Set up a custom domain**.
   - Add `shadtools.com` and `www.shadtools.com`.
   - Cloudflare automatically manages free SSL/TLS certificates and configures `www` to root redirects.

---

## 🔒 Security & Privacy Features

- Pre-configured `public/_headers` with Content Security Policy, `X-Frame-Options`, `X-Content-Type-Options`, and immutable static asset caching.
- Zero server file processing — 100% browser local memory execution.

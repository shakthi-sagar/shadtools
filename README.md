# ShadTools (`shadtools.com`)

**ShadTools** is a high-performance, developer-first, local-first utility platform built with **Astro**, **TypeScript (Strict Mode)**, **Tailwind CSS**, and **React Islands Architecture**, hosted on **Cloudflare Pages**.

All tools default to client-side local processing — user data stays 100% inside the browser memory whenever possible.

---

## 📚 Documentation Index

- 📐 **[Design System Specification](docs/DESIGN_SYSTEM.md)**: Color tokens, semantic themes, typography, and component design contracts.
- 🏗️ **[System Architecture](docs/ARCHITECTURE.md)**: Directory layout, routing engine, static generation, search indexing, and deployment.
- 🛠️ **[Adding a Tool Guide](docs/ADDING_A_TOOL.md)**: Step-by-step developer tutorial for scaffolding and building new utility tools.
- 🤖 **[AI Agent Rules](AGENTS.md)**: Guidelines and mandatory rules for AI coding assistants.

---

## ⚡ Tech Stack

- **Framework**: Astro 4+ (Static Site Generation with Islands Architecture)
- **Language**: TypeScript (Strict Mode with `@/*` path aliasing)
- **Styling**: Tailwind CSS + Design System v2 semantic tokens (`tokens.css`, `base.css`, `prose.css`)
- **Typography**: Geist Sans (UI) & Geist Mono (Code/Inputs)
- **Interactive Islands**: React 18
- **Testing**: Vitest (Unit Tests) & Playwright (E2E)
- **Hosting**: Cloudflare Pages / Workers
- **Search**: Pagefind static client-side indexing

---

## 🧰 Active Tool Catalog (12 Tools Across 8 Namespaces)

| Namespace | Tool Route | Name | Key Capabilities |
| :--- | :--- | :--- | :--- |
| **`json`** | `/json/formatter` | JSON Formatter & Validator | Syntax validation, 2/4 space & tab indenting, minification |
| **`base64`** | `/base64/encode` | Base64 Encoder & Decoder | Live instant encoding/decoding as you type |
| **`text`** | `/text/diff` | Text Diff Checker | Side-by-side line diff, green/red highlights, unified diff output |
| **`text`** | `/text/case-converter` | Case Converter | `camelCase`, `kebab-case`, `snake_case`, `CONSTANT_CASE`, `Title Case` |
| **`crypto`** | `/crypto/hash` | Hash Generator | Live Web Crypto API SHA-256, SHA-512, SHA-1 hex generation |
| **`crypto`** | `/crypto/uuid` | UUID Generator | Cryptographically secure UUID v4 batch generation (1-50 IDs) |
| **`units`** | `/units/length` | Length Unit Converter | Meters, feet, inches, kilometers, miles, yards, cm, mm |
| **`units`** | `/units/weight` | Weight Converter | Kilograms, pounds, ounces, grams, milligrams, stone |
| **`units`** | `/units/temperature` | Temperature Converter | Celsius (°C), Fahrenheit (°F), Kelvin (K) formulas |
| **`percentage`** | `/percentage/calculator` | Percentage Calculator | Percent of numbers, percent change, growth rate |
| **`images`** | `/images/compress` | Image Compressor | Client-side HTML5 Canvas compression for PNG, JPG, WebP |
| **`currency`** | `/currency/converter` | Currency Converter | USD, EUR, GBP, INR, CAD, AUD, JPY, CNY with daily cached exchange rates |

---

## 🚀 Quick Start Commands

```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev

# 3. Scaffold a new tool module
npm run create-tool <namespace> <slug> "[Tool Name]"

# 4. Run test suite & validation checks
npm run validate && npx tsc --noEmit && npm run test

# 5. Build static production site & Pagefind index
npm run build
```

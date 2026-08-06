# ShadTools Design System Specification (`DESIGN_SYSTEM.md`)

## 1. Visual Philosophy & Core Direction

ShadTools is a professional, high-speed utility web platform.

### Aesthetic Principles:
- **Precise & Restrained**: Linear-level precision, Vercel-level restraint, Raycast polish.
- **Utility First**: The working tool interface is immediately prominent above the fold.
- **Zero AI-Slop**:
  - ❌ NO purple-to-blue gradients
  - ❌ NO neon glowing borders
  - ❌ NO glassmorphism or floating decorative orbs
  - ❌ NO oversized 32px rounded cards or excessive shadows
  - ❌ NO fake testimonials, fake browser mockups, or marketing fluff

---

## 2. Color Tokens

### Dark Theme (Primary)
- **Page Background**: `#090d16` (Deep neutral slate)
- **Primary Surface**: `#111827` (Slate 900)
- **Secondary Surface**: `#1f2937` (Slate 800)
- **Borders**: `rgba(255, 255, 255, 0.08)` / `#1f2937`
- **Primary Text**: `#f8fafc` (Slate 50)
- **Secondary Text**: `#94a3b8` (Slate 400)
- **Main Product Accent**: `#3b82f6` (Clean blue)
- **Success**: `#10b981` (Emerald 500)
- **Error**: `#ef4444` (Red 500)

### Category Micro-Accents (Used ONLY for small icons & thin category indicators)
- **Developer Tools / JSON / XML**: `#8b5cf6` (Violet)
- **Document / PDF Tools**: `#ef4444` (Red)
- **Image Tools**: `#f97316` (Orange)
- **Finance Tools**: `#10b981` (Green)
- **Time & Unit Tools**: `#14b8a6` (Teal) / `#6366f1` (Indigo)

---

## 3. Typography & Spacing

- **Sans-Serif Font**: `Inter`, `-apple-system`, `BlinkMacSystemFont`, `sans-serif`
- **Monospace Font**: `JetBrains Mono`, `Fira Code`, `ui-monospace`, `monospace`
- **Heading Scale**:
  - H1 Tool Title: `28px` - `36px` (`font-bold`, `tracking-tight`)
  - H2 Section Title: `20px` - `24px` (`font-semibold`)
  - H3 Card Title: `14px` - `16px` (`font-semibold`)
- **Body Scale**: `14px` - `16px` (`text-slate-300`, `leading-relaxed`)
- **Border Radius**:
  - Buttons / Inputs: `6px` - `8px`
  - Tool Containers: `10px` - `12px`
- **Grid Layout**: Max content width `1200px`, tool working surface width `1000px`.

---

## 4. Page & Layout Structure

1. **Header** (56px height, logo wordmark, search trigger `Ctrl+K`, category navigation)
2. **Breadcrumb Bar** (`Home / Category / Namespace / Tool`)
3. **Tool Title & Description** (Compact 1-sentence description)
4. **Tool Working Surface** (Split pane input/output or single interactive panel)
5. **Privacy Notice** ("🔒 Processed 100% locally in browser memory")
6. **How it Works / Instructions**
7. **Examples**
8. **FAQs Accordion**
9. **Related Tools**
10. **Footer**

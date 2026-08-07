---
name: "ShadTools Design System v2 Specification"
version: "2.1.0"
date: "2026-08-07"
status: "active"

tokens:
  primitives:
    colors:
      gray:
        0: "#ffffff"
        50: "#fafafa"
        100: "#f4f4f5"
        200: "#e4e4e7"
        300: "#d4d4d8"
        400: "#a1a1aa"
        500: "#71717a"
        600: "#52525b"
        700: "#3f3f46"
        800: "#27272a"
        850: "#202023"
        900: "#18181b"
        950: "#09090b"
      blue:
        50: "#eff6ff"
        100: "#dbeafe"
        400: "#60a5fa"
        500: "#3b82f6"
        600: "#2563eb"
        700: "#1d4ed8"
    radii:
      xs: "4px"
      sm: "6px"
      md: "8px"
      lg: "10px"
      full: "9999px"
    typography:
      font-sans: '"Geist", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      font-mono: '"Geist Mono", "JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace'
---

# ShadTools Design System v2 Specification

This document is the authoritative design system manual for ShadTools. All developers and AI agents must follow the semantic tokens, component specifications, visual hierarchy, and accessibility guidelines outlined below.

---

## 1. Design Philosophy & Visual Identity

ShadTools design direction is **quiet, high-contrast, local-first, and immediately useful**.

- **Surfaces**: Graphite surfaces (`#FAFAFA` light, `#09090B` dark).
- **Interaction Accent**: Single blue interaction accent (`#2563EB` light, `#60A5FA` dark) reserved for links, focus indicators, and selected states.
- **Borders & Radii**: Crisp 1px borders (`#E4E4E7` light, `#27272A` dark), tight radii (4px to 10px max).
- **Typography**: Geist Sans for interface copy; Geist Mono for code, tabular numeric values, and inputs.

---

## 2. Semantic Token System

| Token Name | Light Value | Dark Value | Intended Usage |
| :--- | :--- | :--- | :--- |
| `--background` | `#FAFAFA` | `#09090B` | Page canvas background |
| `--surface` | `#FFFFFF` | `#111113` | Tool workspace panels, cards |
| `--surface-subtle` | `#F4F4F5` | `#18181B` | Header bars, grouped controls |
| `--surface-input` | `#FFFFFF` | `#0D0D0F` | Textareas, inputs, code editors |
| `--foreground` | `#18181B` | `#FAFAFA` | Primary text and headings |
| `--foreground-secondary` | `#52525B` | `#D4D4D8` | Form labels, secondary text |
| `--foreground-muted` | `#71717A` | `#A1A1AA` | Metadata, helper text |
| `--border` | `#E4E4E7` | `#27272A` | Card & pane dividers |
| `--border-strong` | `#D4D4D8` | `#3F3F46` | Active input & hover borders |
| `--accent` | `#2563EB` | `#60A5FA` | Active pills, links, emphasis |
| `--action-primary` | `#2563EB` | `#2563EB` | Solid primary button background |
| `--success` | `#047857` | `#34D399` | Success badges & copy confirmation |
| `--danger` | `#DC2626` | `#F87171` | Syntax error text & deletion badges |

---

## 3. Component Design Contracts

### Code Editors (`CodeEditorPane.tsx`)
- **Master Header Toolbar**: `bg-surface-subtle border-b border-border px-4 py-3 flex items-center justify-between`.
- **Pane Header Strip**: `h-9 px-4 bg-surface-subtle/80 border-b border-border` containing pane label, icon, character counter (`12 characters`), and action buttons.
- **Editor Textarea Canvas**: `bg-surface-input text-foreground font-mono text-xs outline-none ring-0 focus:outline-none focus:ring-0 focus:border-none shadow-none`.

### Unit Converters (`LengthConverterTool`, `WeightTool`, `TemperatureTool`, `CurrencyConverterTool`)
- **Inputs Row Grid**: `grid grid-cols-1 sm:grid-cols-3 gap-4 items-start`.
- **Aligned Controls**: Amount input, From unit select, and To unit select MUST sit in equal-height `h-10` controls with identical top-aligned `<label>` elements.
- **Unit Option Formatting**: Dropdown `<option>` labels must render clean unit names (e.g. `Celsius (°C)`, `Meters (m)`). Symbol shorthands must NOT be duplicated in dropdown text.
- **Result Display Card**: High-contrast card (`bg-surface-subtle border border-border p-4 rounded-md`) with the `Copy Result` button integrated into the top header row next to `CONVERTED RESULT`.

---

## 4. Typography & CSS `@import` Rules

- **CSS `@import` Order**: In `@/styles/global.css`, all `@import` directives (`tokens.css`, `base.css`, `prose.css`) MUST sit at the absolute top of the file BEFORE `@tailwind` directives.
- **Prose Headings**: Section `h2` elements in prose markdown have a subtle bottom border (`border-bottom: 1px solid var(--border)`), 22px bold headings, and `list-style-type: disc !important` bullet points.

---

## 5. Trust & Privacy Copy Guidelines (Building Trust Without Overselling)

- **Tone & Placement**: User trust is built through quiet, professional editorial clarity—not through aggressive, repeated checkmark badges.
- **Page Level Disclosures**: Privacy disclosures belong at the page level inside the standard `<PrivacyNotice />` component (e.g. *"Data processed 100% locally in your browser memory"*).
- **No Cluttered Tool Card Badges**: Do NOT add repetitive badges or checkmarks like `✓ Instant local calculation` or `✓ Instant math` inside interactive tool workspace cards, result panels, or calculation footers. Tool workspaces must remain clean, uncluttered, and focused purely on user task performance.

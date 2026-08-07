---
name: "ShadTools Design System & Product Contract v2"
version: "2.0.0"
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
      green:
        700: "#047857"
        400: "#34d399"
      amber:
        700: "#b45309"
        400: "#fbbf24"
      red:
        600: "#dc2626"
        400: "#f87171"
    radii:
      xs: "4px"
      sm: "6px"
      md: "8px"
      lg: "10px"
      full: "9999px"
    shadows:
      none: "none"
      popover: "0 8px 30px rgba(0, 0, 0, 0.12)"
      dialog: "0 16px 60px rgba(0, 0, 0, 0.20)"
      popover-dark: "0 8px 30px rgba(0, 0, 0, 0.5)"
      dialog-dark: "0 16px 60px rgba(0, 0, 0, 0.7)"
    typography:
      font-sans: '"Geist", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      font-mono: '"Geist Mono", "JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace'

  semantics:
    light:
      background: "#fafafa"
      surface: "#ffffff"
      surface-subtle: "#f4f4f5"
      surface-raised: "#ffffff"
      surface-input: "#ffffff"
      foreground: "#18181b"
      foreground-secondary: "#52525b"
      foreground-muted: "#71717a"
      border: "#e4e4e7"
      border-strong: "#d4d4d8"
      accent: "#2563eb"
      accent-hover: "#1d4ed8"
      accent-subtle: "#eff6ff"
      action-primary: "#2563eb"
      action-primary-hover: "#1d4ed8"
      action-primary-foreground: "#ffffff"
      action-danger: "#dc2626"
      action-danger-hover: "#b91c1c"
      action-danger-foreground: "#ffffff"
      focus: "#2563eb"
      success: "#047857"
      warning: "#b45309"
      danger: "#dc2626"
    dark:
      background: "#09090b"
      surface: "#111113"
      surface-subtle: "#18181b"
      surface-raised: "#202023"
      surface-input: "#0d0d0f"
      foreground: "#fafafa"
      foreground-secondary: "#d4d4d8"
      foreground-muted: "#a1a1aa"
      border: "#27272a"
      border-strong: "#3f3f46"
      accent: "#60a5fa"
      accent-hover: "#93c5fd"
      accent-subtle: "#172554"
      action-primary: "#2563eb"
      action-primary-hover: "#1d4ed8"
      action-primary-foreground: "#ffffff"
      action-danger: "#dc2626"
      action-danger-hover: "#b91c1c"
      action-danger-foreground: "#ffffff"
      focus: "#60a5fa"
      success: "#34d399"
      warning: "#fbbf24"
      danger: "#f87171"

accessibility:
  wcag_level: "AA"
  contrast_ratios:
    normal_text: 4.5
    large_text: 3.0
    ui_boundaries: 3.0
  focus_ring_width: "2px"
  min_touch_target: "24px"
  primary_touch_target: "44px"
---

# ShadTools Product Contract & Design System Specification

This document is the authoritative product contract and design specification for ShadTools. All AI agents, contributors, and developers must follow the design rules, token schemas, component contracts, accessibility guidelines, tool UX decision gates, and page anatomies defined herein.

> **CRITICAL RULE FOR AI AGENTS**: No tool implementation or refactoring is accepted merely because it uses system tokens correctly. It must satisfy both **SYSTEM CONSISTENCY** and **TASK-SPECIFIC OPTIMIZATION**.

---

## 1. Executive Summary & Brand Direction

ShadTools design direction is **quiet, precise, local-first, and immediately useful**.

### Visual Identity
- **Surfaces**: Quiet graphite surfaces (`#FAFAFA` light, `#09090B` dark).
- **Interaction Accent**: Single blue interaction accent (`#2563EB` light, `#60A5FA` dark) reserved for links, focus indicators, and selected states.
- **Borders & Radii**: Crisp 1px borders (`#E4E4E7` / `#27272A`), tight radii (4px to 10px maximum), flat workspace panels without shadow unless floating.
- **Typography**: Geist Sans for interface copy, Geist Mono for code, tabular numerical values, and inputs.

---

## 2. Tool UX Decision Gate & Interaction Selection

Before selecting components or building any tool interface, AI agents must evaluate the **Tool UX Decision Gate**:

### 12-Point Evaluation Checklist
1. What is the user's primary input?
2. What is the desired output?
3. Is computation effectively instantaneous (cheap client execution)?
4. Does output depend only on current inputs?
5. Can the result update continuously without side effects?
6. Is the workflow reversible or bidirectional?
7. Is there one input or multiple dependent inputs?
8. Is the result the main object, or the editor itself?
9. What is the realistic input size?
10. What controls are used frequently vs rarely?
11. What should happen immediately on paste / type / drop?
12. What changes on mobile viewports?

### Interaction Rules
- **IF operation is instant + deterministic + free of side effects**:
  → Prefer **live results as the user types**.
  → **DO NOT add a primary Submit / Calculate / Convert button**.
- **IF operation is destructive, expensive, remote, file-generating, or user-triggered**:
  → Explicit primary action button is appropriate.
- **IF tool presents two representations of the same data**:
  → Use a clean segmented mode toggle (`Encode | Decode`), not action buttons in the toolbar.
- **IF output is short**:
  → Do not allocate a giant 360px editor workspace. Use compact 220–260px adaptive height.

---

## 3. Tool Archetype Specifications

### 1. JSON Formatter
- **Pattern**: Large code-editor workspace.
- **Interaction**: Explicit Format / Minify action buttons.
- **Panes**: 50/50 input/output split with 420px height.
- **Toolbar**: Indentation selector (2 spaces, 4 spaces, tab), Copy, Download, Reset.

### 2. Base64 Encoder / Decoder (Live Reference Pattern)
- **Pattern**: Instant live transformation.
- **Interaction**: As user types, output updates immediately. No submit button.
- **Toolbar**: Segmented `Encode | Decode` toggle, character counter (`TEXT 12 chars`), Copy action in output header pane.
- **Panes**: Compact 220px–260px split workspace.

### 3. Length Converter
- **Pattern**: Live bidirectional conversion.
- **Controls**: Number input + unit selector on left, converted value card on right, central swap button.
- **Height**: Compact form, not an editor.

### 4. Percentage Calculator
- **Pattern**: Compact mathematical form.
- **Controls**: Percentage input + total number input, calculated result visually dominant.
- **Height**: Compact form without full `ToolToolbar`.

### 5. Image Compressor
- **Pattern**: Upload dropzone state → Compression controls state.
- **Controls**: Quality slider (0.1 - 1.0), explicit "Compress Image" button, before/after file size savings badge, Download button.

---

## 4. Token System & Semantic Rules

The system enforces strict separation between **accent** tokens (links, focus, selection) and **action** tokens (solid interactive buttons).

### Semantic Token Contracts

| Token Name | Light Value | Dark Value | Intended Usage | WCAG AA Contrast Target |
|---|---|---|---|---|
| `--background` | `#FAFAFA` | `#09090B` | Page canvas background | - |
| `--surface` | `#FFFFFF` | `#111113` | Tool workspace panels, tiles | 3:1 vs canvas |
| `--surface-subtle` | `#F4F4F5` | `#18181B` | Toolbars, hover, grouped controls | 3:1 vs surface |
| `--surface-raised` | `#FFFFFF` | `#202023` | Dialogs, popovers, command search | Floating shadow |
| `--surface-input` | `#FFFFFF` | `#0D0D0F` | Textareas, inputs, code editors | 3:1 boundary |
| `--foreground` | `#18181B` | `#FAFAFA` | Primary headings, primary text | > 7:1 (AAA) |
| `--foreground-secondary` | `#52525B` | `#D4D4D8` | Labels, supporting copy | > 4.5:1 (AA) |
| `--foreground-muted` | `#71717A` | `#A1A1AA` | Metadata, helper text | > 4.5:1 (AA) |
| `--border` | `#E4E4E7` | `#27272A` | Standard card and pane dividers | 3:1 non-text boundary |
| `--border-strong` | `#D4D4D8` | `#3F3F46` | Hover state and active borders | 3:1 boundary |
| `--accent` | `#2563EB` | `#60A5FA` | Links, focus rings, selected state | > 4.5:1 (AA) |
| `--action-primary` | `#2563EB` | `#2563EB` | Solid primary button background | > 4.5:1 (white on blue) |
| `--action-danger` | `#DC2626` | `#DC2626` | Solid danger button background | > 4.5:1 (white on red) |
| `--success` | `#047857` | `#34D399` | Local processing status text/badge | > 4.5:1 (AA) |
| `--warning` | `#B45309` | `#FBBF24` | Remote data status text/badge | > 4.5:1 (AA) |
| `--danger` | `#DC2626` | `#F87171` | Syntax error & failure text | > 4.5:1 (AA) |

---

## 5. Page Composition & Hierarchical Spacing

### Tool Page Composition (`ToolLayout.astro`)
```text
Header Navigation (Sticky 54px)
├── Brand logo (ShadTools)
├── Browse Menu dropdown
└── Global Search Trigger (Ctrl+K / ⌘K)

Page Canvas (max-w-[1120px])
├── Breadcrumbs (Home / Namespace / Tool Name) [8px gap]
├── ToolHeader (Title + Summary) [8px gap]
├── PrivacyNotice (Compact Inline Status) [24px gap]
├── Tool Workspace Slot (<ToolFrame> working tool) [32px gap]
├── Ad Slot [48px gap]
└── Centered Reading Column (max-w-[720px] mx-auto)
    ├── Documentation Slot (<Content />) [48px gap]
    ├── Examples Section [48px gap]
    ├── FAQ Section (Un-boxed Editorial Disclosures) [48px gap]
    └── Related Tools Section (Clean Bordered Rows)
```

---

## 6. QA Matrix & Style Validation

Run all verification commands before completing interface tasks:
1. `npm run validate`: Runs `validate-tools.ts` and `validate-styles.ts` (0 stale V1 classes allowed).
2. `npm run check`: TypeScript & Astro type diagnostics (0 errors required).
3. `npm run test`: Unit test suites (Vitest).
4. `npm run build`: Production static build and Pagefind search index.

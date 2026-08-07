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

This document is the authoritative product contract and design specification for ShadTools. All AI agents, contributors, and developers must follow the design rules, token schemas, component contracts, accessibility guidelines, and page anatomies defined herein.

---

## 1. Executive Summary & Brand Direction

ShadTools design direction is **quiet, precise, local-first, and immediately useful**.

### Visual Identity
- **Surfaces**: Quiet graphite surfaces (`#FAFAFA` light, `#09090B` dark).
- **Interaction Accent**: Single blue interaction accent (`#2563EB` light, `#60A5FA` dark) reserved for links, focus indicators, and selected states.
- **Borders & Radii**: Crisp 1px borders (`#E4E4E7` / `#27272A`), tight radii (4px to 10px maximum), flat workspace panels without shadow unless floating.
- **Typography**: Geist Sans for interface copy, Geist Mono for code, tabular numerical values, and inputs.

### Core Visual Anti-Patterns
- NO purple-to-blue gradients or glassmorphism.
- NO glowing borders or ornamental background blobs.
- NO border-radius exceeding 10px without documented exception.
- NO namespace-specific accent colors.
- NO emoji used as product icons.
- NO fake social proof, vanity metrics, or decorative marketing cards around tools.
- NO mandatory user accounts for bookmarking or local customization.

---

## 2. Token System & Semantic Rules

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

## 3. Component Contracts & Interfaces

### 3.1 Button & IconButton
- **Button**: Supports `variant` (`primary`, `secondary`, `ghost`, `danger`), `size` (`sm`: 32px, `md`: 40px, `lg`: 44px), `loading` state (preserves button dimensions, shows spinner, sets `aria-busy="true"`), `fullWidth`, `leftIcon`, `rightIcon`.
- **IconButton**: Enforces mandatory `label` prop for screen reader accessibility (`aria-label`).
- **Danger Button Contrast**: Must use `bg-action-danger text-action-danger-foreground hover:bg-action-danger-hover` to guarantee > 4.5:1 contrast in both light and dark modes.

### 3.2 Form Controls (`Input`, `Textarea`, `FormField`)
- **FormField**: Wraps label, input control, hint, and inline error. Automatically links `aria-describedby` and `aria-invalid` between field and hint/error IDs.
- **Font Size**: Mobile inputs must enforce minimum 16px text on touch devices to prevent mobile browser auto-zoom.

### 3.3 Dialog & Modal (`Dialog`)
- **Focus Trapping**: Intercepts `Tab` and `Shift+Tab` to trap focus within the modal window.
- **Dismissal & Scroll Lock**: Closes on `Escape` keypress or backdrop click. Locks body scroll (`document.body.style.overflow = 'hidden'`) while open, and restores focus to the invoking trigger element upon closing.

### 3.4 Tool Workspace Primitives (`ToolFrame`, `ToolToolbar`, `ToolPane`, `ResultPanel`)
- **`ToolFrame`**: Outer container for interactive tools. Uses surface background, 1px border, 10px radius (`rounded-lg`), clipped overflow (`overflow-hidden`), and zero shadow.
- **`ToolToolbar`**: Top bar inside `ToolFrame` containing primary actions on the left and utility tools (copy, clear, reset) on the right. Height 44–48px.
- **`ToolPane`**: Inner split container for input/output panes. Separated by clean 1px dividers without nested rounded card chrome.
- **`ResultPanel`**: Displays calculated output with tabular numeric formatting (`tabular-nums`) and copy actions.

### 3.5 Tool Tile (`ToolTile`)
- **Normal Mode**: Rendered as a single, clean launch target block link (`<a>`). Contains namespace tag, tool title, concise summary, and launch indicator. NO cluttered reorder or unpin buttons are visible in normal mode.
- **Customize Mode**: Toggle button on the dashboard enables edit controls, revealing accessible reorder buttons (up/down) and unpin action (`×`).

### 3.6 Global Command Search (`SearchCommand`)
- **Global Key Listener**: Listens for `Ctrl+K` or `⌘K` across the entire application.
- **Modal Palette**: Opens a focused search dialog overlay with arrow key navigation, `Enter` key opening tool URLs, `Escape` key close, and weighted search ranking using `searchWeight`.

---

## 4. Local-First Homepage Dashboard & State Model

The homepage features a hydrated React island (`DashboardIsland.tsx`) mounted over indexable static Astro HTML.

### Storage Contract
- **Storage Key**: `shadtools.dashboard.v1`
- **Schema**:
```ts
interface DashboardPreferencesV1 {
  version: 1;
  pinnedToolIds: string[];
  recentToolIds: string[];
}
```
- **Fallback**: If `localStorage` is empty or corrupt, defaults to published tools sorted by `dashboardOrder || 100`.
- **Tool ID Fallback**: Stable tool IDs use `${namespace}/${slug}` format (e.g., `json/formatter`, `currency/converter`).
- **Recents Loop**: `ToolLayout.astro` executes a lightweight client script calling `recordRecentTool(toolId)` on canonical tool page visits, keeping "Recently Used" automatically updated.

---

## 5. Tool & Page Anatomy Templates

### Tool Page Anatomy (`ToolLayout.astro`)
```text
Header Navigation (Sticky 54px)
├── Brand logo (ShadTools)
├── Browse Menu dropdown
└── Global Search Trigger (Ctrl+K / ⌘K)

Page Canvas (max-w-[1120px])
├── Breadcrumbs (Home / Namespace / Tool Name)
├── ToolHeader (Title + Summary)
├── PrivacyNotice (Client-Side Privacy Status)
├── Tool Workspace Slot (<ToolFrame> working tool)
├── Ad Slot
├── Prose Documentation Slot (<Content />)
├── Examples Section
├── FAQ Section (Disclosure Accordion)
└── Related Tools Section
```

---

## 6. Accessibility & Privacy Contract

### WCAG 2.2 Level AA Requirements
- **Focus**: Persistent 2px focus-visible outline (`focus-visible:outline-2 focus-visible:outline-focus focus-visible:outline-offset-2`).
- **Target Sizes**: Minimum 24×24px pointer targets with 44px primary mobile touch targets.
- **Contrast**: > 4.5:1 for normal text, > 3:1 for large text and UI boundaries.
- **Keyboard**: 100% of workflows usable via keyboard input alone.

### Privacy Status Contract
Each tool must declare its `privacy.processing` mode:
1. `local`: **Client-Side Local Processing** — Green success badge (`#047857` light / `#34D399` dark). "Processed locally in this browser. Files and data never leave your device."
2. `remote-data`: **Remote API & Local Processing** — Blue accent badge (`#2563EB` light / `#60A5FA` dark). "Data is fetched remotely; entered values stay in this browser."
3. `server-processing`: **Server-Side Processing** — Amber warning badge (`#B45309` light / `#FBBF24` dark). "This tool uploads data for server processing. Review the privacy note before continuing."

---

## 7. QA Matrix & Verification Checks

Before completing any interface work, run:
1. `npm run check`: TypeScript & Astro type diagnostics (0 errors required).
2. `npm run validate`: Validate tools schema and route metadata.
3. `npm run test`: Run unit test suites (Vitest).
4. `npm run build`: Verify production static build and Pagefind search indexing.

---

## 8. Document Authority & Links

This file (`/DESIGN.md`) is the primary design authority. Superseded documents must reference `[DESIGN.md](../DESIGN.md)`.

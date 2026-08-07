---
name: "ShadTools Design System v2"
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
        600: "#047857"
        400: "#34d399"
      amber:
        600: "#d97706"
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
      focus: "#2563eb"
      success: "#047857"
      warning: "#d97706"
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

# ShadTools Product Contract & Design Specification

This document serves as the authoritative product and design contract for ShadTools.

## Executive Summary & Visual Direction

ShadTools design direction is **quiet, precise, local-first, and immediately useful**.

The product identity comes from predictable geometry, strong typography (Geist Sans & Geist Mono), flat tool surfaces (`ToolFrame`), clear focus indicators, fast platform-aware command search (`Ctrl+K` / `⌘K`), and high contrast status indicators.

### Anti-Patterns
- No purple-to-blue gradients or glassmorphism.
- No glowing borders or ornamental background blobs.
- No radius above 10px without documented exception.
- No category-specific accent colors.
- No fake metrics or decorative cards around tools.
- No mandatory user login for bookmarking / dashboard state.

---

## Token & Theme Architecture

The system uses semantic CSS variables mapped into Tailwind CSS classes:

- `--accent`: Links, focus rings, selected text (`text-accent`, `ring-accent`, `bg-accent-subtle`).
- `--action-primary`: Solid interactive buttons (`bg-action`, `hover:bg-action-hover`, `text-action-foreground`).
- `--surface`, `--surface-subtle`, `--surface-raised`, `--surface-input`: Layered surface hierarchy.
- `--success`, `--warning`, `--danger`: High-contrast status indicators meeting WCAG 2.2 AA.

---

## Navigation & Local Dashboard

- **Static Astro Shell**: Crawlable, SEO-optimized homepage and namespace index pages.
- **Personalized React Island**: Mounted on the homepage, utilizing anonymous `localStorage` state under key `shadtools.dashboard.v1`.
- **Features**: Pinned tools, recently used tools, keyboard-accessible reordering, fallback state to featured tools.

---

## Component Specifications

All UI components must:
1. Pass WCAG 2.2 AA contrast requirements.
2. Support `prefers-reduced-motion`.
3. Enforce keyboard navigation (`FocusVisible`, `Escape` to dismiss, arrow navigation where relevant).
4. Provide explicit fallback and error states.

---

## Authority & Maintenance

This file (`/DESIGN.md`) supersedes `docs/DESIGN_SYSTEM.md`. AI tools and developer workflows must resolve requirements against this contract first.

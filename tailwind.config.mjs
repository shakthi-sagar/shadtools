/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        sidebar: 'var(--sidebar)',
        surface: {
          DEFAULT: 'var(--surface)',
          subtle: 'var(--surface-subtle)',
          hover: 'var(--surface-hover)',
          raised: 'var(--surface-raised)',
          input: 'var(--surface-input)',
        },
        foreground: {
          DEFAULT: 'var(--foreground)',
          secondary: 'var(--foreground-secondary)',
          muted: 'var(--foreground-muted)',
        },
        border: {
          DEFAULT: 'var(--border)',
          strong: 'var(--border-strong)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          hover: 'var(--accent-hover)',
          subtle: 'var(--accent-subtle)',
          foreground: 'var(--accent-foreground)',
        },
        action: {
          DEFAULT: 'var(--action-primary)',
          hover: 'var(--action-primary-hover)',
          foreground: 'var(--action-primary-foreground)',
          danger: 'var(--action-danger)',
          'danger-hover': 'var(--action-danger-hover)',
          'danger-foreground': 'var(--action-danger-foreground)',
        },
        primary: {
          DEFAULT: 'var(--primary)',
          hover: 'var(--primary-hover)',
          subtle: 'var(--primary-subtle)',
        },
        focus: 'var(--focus)',
        success: 'var(--success)',
        warning: 'var(--warning)',
        danger: 'var(--danger)',
      },
      borderRadius: {
        xs: 'var(--radius-xs)',
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        full: 'var(--radius-full)',
      },
      fontFamily: {
        sans: 'var(--font-sans)',
        mono: 'var(--font-mono)',
      },
      boxShadow: {
        popover: 'var(--shadow-popover)',
        dialog: 'var(--shadow-dialog)',
      },
    },
  },
  plugins: [],
};

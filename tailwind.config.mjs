/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        accent: {
          documents: '#3b82f6', // Blue
          finance: '#10b981',   // Green
          developer: '#8b5cf6', // Purple
          images: '#f97316',    // Orange
          time: '#14b8a6',      // Teal
          units: '#6366f1'      // Indigo
        },
        dark: {
          bg: '#0b0f19',
          card: '#121826',
          border: 'rgba(255, 255, 255, 0.08)',
          hover: 'rgba(255, 255, 255, 0.12)'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['Fira Code', 'JetBrains Mono', 'monospace']
      }
    }
  },
  plugins: []
};

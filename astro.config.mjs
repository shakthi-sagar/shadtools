import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://astro.build/config
export default defineConfig({
  site: 'https://shadtools.com',
  output: 'static',
  vite: {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
  },
  experimental: {
    contentLayer: true,
  },
  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
    react(),
  ],
});

import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://shadtools.com',
  output: 'static',
  experimental: {
    contentLayer: true
  },
  integrations: [
    tailwind({
      applyBaseStyles: false
    }),
    react(),
    sitemap({
      filter: (page) => {
        // Exclude 404
        if (page.includes('/404')) return false;
        return true;
      },
    })
  ]
});

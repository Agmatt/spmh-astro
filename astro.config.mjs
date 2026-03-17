// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
import alpinejs from '@astrojs/alpinejs';
import markdoc from '@astrojs/markdoc';
import keystatic from '@keystatic/astro';

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        'virtual:keystatic-config': new URL(
          './keystatic.config.ts',
          import.meta.url,
        ).pathname,
      },
    },
  },
  integrations: [react(), alpinejs(), markdoc(), keystatic()],
});

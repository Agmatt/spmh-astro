// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
import alpinejs from '@astrojs/alpinejs';
import markdoc from '@astrojs/markdoc';
import keystatic from '@keystatic/astro';
import netlify from '@astrojs/netlify';
import { fileURLToPath } from 'node:url'; // 1. Add this import

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        'virtual:keystatic-config': fileURLToPath(
          new URL('./keystatic.config.ts', import.meta.url),
        ), // 2. Wrap it in fileURLToPath
      },
    },
  },
  integrations: [react(), alpinejs(), markdoc(), keystatic()],
  output: 'server',
  adapter: netlify(),
});

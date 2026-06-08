import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
import alpinejs from '@astrojs/alpinejs';
import markdoc from '@astrojs/markdoc';
import keystatic from '@keystatic/astro';
import netlify from '@astrojs/netlify';

export default defineConfig({
  output: 'server',
  adapter: netlify(),
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [react(), alpinejs(), markdoc(), keystatic()],
});

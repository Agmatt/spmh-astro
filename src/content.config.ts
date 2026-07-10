// src/content.config.ts
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const media = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: 'src/content/media' }),
  schema: z.object({
    title: z.string(),
    category: z.enum(['article', 'blog', 'press-release', 'gallery']),
    date: z.coerce.date(),
  }),
});

export const collections = { media };
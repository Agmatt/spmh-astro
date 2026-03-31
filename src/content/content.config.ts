import { defineCollection, z } from 'astro:content'
import { glob, file } from 'astro/loaders'

const articles = defineCollection({
  loader: glob({ pattern: '**/*.mdoc', base: './src/content/articles' }),
  schema: z.object({
    title:    z.string(),
    date:     z.coerce.date(),
    category: z.enum(['Clinical Updates', 'Community Health', 'Hospital News', 'Staff Updates', 'Announcements']),
    author:   z.string().default('Editorial Team'),
    image:    z.string().optional(),
    excerpt:  z.string(),
    featured: z.boolean().default(false),
    draft:    z.boolean().default(false),
  }),
})

const events = defineCollection({
  loader: glob({ pattern: '**/*.mdoc', base: './src/content/events' }),
  schema: z.object({
    title:    z.string(),
    date:     z.coerce.date(),
    endDate:  z.coerce.date().optional(),
    time:     z.string(),
    location: z.string(),
    category: z.enum(['Community Outreach', 'Health Camp', 'Training', 'Hospital Event', 'Fundraising']),
    image:    z.string().optional(),
    excerpt:  z.string(),
    draft:    z.boolean().default(false),
  }),
})

const gallery = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/gallery' }),
  schema: z.object({
    title:      z.string(),
    date:       z.coerce.date(),
    category:   z.enum(['Maternity Wing', 'Community Outreach', 'Staff Events', 'Facilities', 'Patients & Care']),
    coverImage: z.string(),
    photos:     z.array(z.object({
      src:     z.string(),
      caption: z.string().optional(),
    })),
    draft:      z.boolean().default(false),
  }),
})

export const collections = { articles, events, gallery }
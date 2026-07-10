import { config, fields, collection } from '@keystatic/core';

export default config({
  collections: {
    media: collection({
      label: 'News & Media',
      slugField: 'title',
      path: 'src/content/media/*',
      format: { contentField: 'content' },
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        date: fields.date({ label: 'Date' }),
        category: fields.select({
          label: 'Category',
          options: [
            { label: 'Article', value: 'article' },
            { label: 'Blog', value: 'blog' },
            { label: 'Press Release', value: 'press-release' },
            { label: 'Gallery', value: 'gallery' },
          ],
          defaultValue: 'article',
        }),
        content: fields.document({ label: 'Content', formatting: true, dividers: true, links: true }),
        // Conditional fields for specific types
        extra: fields.conditional(fields.select({
            label: 'Type Specifics',
            options: [
                { label: 'None', value: 'none' },
                { label: 'Press Contact', value: 'press' },
                { label: 'Event Details', value: 'event' }
            ],
            defaultValue: 'none'
        }), {
            press: fields.object({ email: fields.text({ label: 'Media Contact Email' }) }),
            event: fields.object({ location: fields.text({ label: 'Event Location' }) }),
            none: fields.empty()
        })
      },
    }),
  },
});
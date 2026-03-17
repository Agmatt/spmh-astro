// keystatic.config.ts
// Place this file in the ROOT of your Astro project (same level as astro.config.mjs)

import { config, fields, collection } from '@keystatic/core'

export default config({
  storage: { kind: 'local' },

  ui: {
    brand: { name: "St. Paul's Mission Hospital — CMS" },
  },

  collections: {

    // ── ARTICLES ──────────────────────────────────────────────
    articles: collection({
      label: 'Articles',
      slugField: 'title',
      path: 'src/content/articles/*',
      format: { contentField: 'content' },
      entryLayout: 'content',
      columns: ['title', 'date', 'category'],
      schema: {
        title: fields.slug({
          name: { label: 'Title' },
        }),
        date: fields.date({
          label: 'Publication Date',
          validation: { isRequired: true },
        }),
        category: fields.select({
          label: 'Category',
          options: [
            { label: 'Clinical Updates',  value: 'Clinical Updates'  },
            { label: 'Community Health',  value: 'Community Health'  },
            { label: 'Hospital News',     value: 'Hospital News'     },
            { label: 'Staff Updates',     value: 'Staff Updates'     },
            { label: 'Announcements',     value: 'Announcements'     },
          ],
          defaultValue: 'Hospital News',
        }),
        author: fields.text({
          label: 'Author',
          defaultValue: 'Editorial Team',
        }),
        image: fields.image({
          label: 'Featured Image',
          directory: 'public/img/articles',
          publicPath: '/img/articles/',
        }),
        excerpt: fields.text({
          label: 'Excerpt',
          description: 'A short summary shown on the articles listing page (1–2 sentences).',
          multiline: true,
          validation: { isRequired: true },
        }),
        featured: fields.checkbox({
          label: 'Featured Article',
          description: 'Featured articles appear in the top slot on the News & Media index.',
          defaultValue: false,
        }),
        draft: fields.checkbox({
          label: 'Draft',
          description: 'Drafts are hidden from the public website.',
          defaultValue: false,
        }),
        content: fields.markdoc({
          label: 'Article Body',
        }),
      },
    }),

    // ── EVENTS ────────────────────────────────────────────────
    events: collection({
      label: 'Events',
      slugField: 'title',
      path: 'src/content/events/*',
      format: { contentField: 'content' },
      entryLayout: 'content',
      columns: ['title', 'date', 'category'],
      schema: {
        title: fields.slug({
          name: { label: 'Event Name' },
        }),
        date: fields.date({
          label: 'Event Date',
          validation: { isRequired: true },
        }),
        endDate: fields.date({
          label: 'End Date (leave blank for single-day events)',
        }),
        time: fields.text({
          label: 'Time',
          description: 'e.g. 9:00 AM – 3:00 PM',
          validation: { isRequired: true },
        }),
        location: fields.text({
          label: 'Location',
          description: 'e.g. SPMH Main Hall, Homa Bay Town',
          validation: { isRequired: true },
        }),
        category: fields.select({
          label: 'Category',
          options: [
            { label: 'Community Outreach', value: 'Community Outreach' },
            { label: 'Health Camp',        value: 'Health Camp'        },
            { label: 'Training',           value: 'Training'           },
            { label: 'Hospital Event',     value: 'Hospital Event'     },
            { label: 'Fundraising',        value: 'Fundraising'        },
          ],
          defaultValue: 'Hospital Event',
        }),
        image: fields.image({
          label: 'Event Image',
          directory: 'public/img/events',
          publicPath: '/img/events/',
        }),
        excerpt: fields.text({
          label: 'Short Description',
          description: 'Shown on the events listing page.',
          multiline: true,
          validation: { isRequired: true },
        }),
        draft: fields.checkbox({
          label: 'Draft',
          defaultValue: false,
        }),
        content: fields.markdoc({
          label: 'Event Details',
        }),
      },
    }),

    // ── GALLERY ───────────────────────────────────────────────
    gallery: collection({
      label: 'Gallery Albums',
      slugField: 'title',
      path: 'src/content/gallery/*',
      format: 'json',
      columns: ['title', 'date', 'category'],
      schema: {
        title: fields.slug({
          name: { label: 'Album Title' },
        }),
        date: fields.date({
          label: 'Date',
          validation: { isRequired: true },
        }),
        category: fields.select({
          label: 'Category',
          options: [
            { label: 'Maternity Wing',     value: 'Maternity Wing'     },
            { label: 'Community Outreach', value: 'Community Outreach' },
            { label: 'Staff Events',       value: 'Staff Events'       },
            { label: 'Facilities',         value: 'Facilities'         },
            { label: 'Patients & Care',    value: 'Patients & Care'    },
          ],
          defaultValue: 'Facilities',
        }),
        coverImage: fields.image({
          label: 'Cover Photo',
          directory: 'public/img/gallery',
          publicPath: '/img/gallery/',
          validation: { isRequired: true },
        }),
        photos: fields.array(
          fields.object({
            src: fields.image({
              label: 'Photo',
              directory: 'public/img/gallery',
              publicPath: '/img/gallery/',
            }),
            caption: fields.text({
              label: 'Caption (optional)',
            }),
          }),
          {
            label: 'Photos',
            itemLabel: (props) => props.fields.caption.value || 'Photo',
          }
        ),
        draft: fields.checkbox({
          label: 'Draft',
          defaultValue: false,
        }),
      },
    }),

  },
})
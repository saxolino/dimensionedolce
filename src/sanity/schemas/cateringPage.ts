import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'cateringPage',
  title: 'Catering & Eventi',
  type: 'document',
  fields: [
    defineField({
      name: 'seoTitle',
      title: 'Titolo SEO',
      type: 'string',
    }),
    defineField({
      name: 'seoDescription',
      title: 'Descrizione SEO',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'introTitle',
      title: 'Intro — Titolo',
      type: 'string',
    }),
    defineField({
      name: 'introText',
      title: 'Intro — Testo',
      type: 'text',
    }),
    defineField({
      name: 'serviceBlocks',
      title: 'Blocchi Servizio',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'title', title: 'Titolo', type: 'string' },
            { name: 'text', title: 'Descrizione', type: 'text' },
            { name: 'image', title: 'Foto', type: 'image', options: { hotspot: true } },
            { name: 'imageAlt', title: 'Alt foto', type: 'string' },
            {
              name: 'bgVariant',
              title: 'Variante sfondo',
              type: 'string',
              options: { list: ['dark', 'bianco', 'pistacchio'] },
            },
          ],
          preview: {
            select: { title: 'title', media: 'image' },
          },
        },
      ],
    }),
    defineField({
      name: 'showcaseGallery',
      title: 'Galleria Showcase',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'image', title: 'Immagine', type: 'image', options: { hotspot: true } },
            { name: 'alt', title: 'Alt', type: 'string' },
          ],
          preview: {
            select: { title: 'alt', media: 'image' },
          },
        },
      ],
    }),
    defineField({
      name: 'ctaTitle',
      title: 'CTA — Titolo',
      type: 'string',
    }),
    defineField({
      name: 'ctaText',
      title: 'CTA — Testo',
      type: 'text',
    }),
    defineField({
      name: 'ctaButtonText',
      title: 'CTA — Pulsante',
      type: 'string',
    }),
    defineField({
      name: 'ctaButtonUrl',
      title: 'CTA — URL',
      type: 'string',
    }),
  ],
  preview: {
    prepare: () => ({ title: 'Catering & Eventi' }),
  },
});

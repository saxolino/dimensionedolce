import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'homePage',
  title: 'Homepage',
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
      name: 'gallery',
      title: 'Galleria',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'image', title: 'Immagine', type: 'image', options: { hotspot: true } },
            { name: 'alt', title: 'Testo alternativo', type: 'string' },
            { name: 'name', title: 'Nome prodotto', type: 'string' },
            {
              name: 'size',
              title: 'Dimensione',
              type: 'string',
              options: { list: ['wide', 'narrow', 'duo'] },
            },
            {
              name: 'subImages',
              title: 'Sotto-immagini (solo per duo)',
              type: 'array',
              of: [
                {
                  type: 'object',
                  fields: [
                    { name: 'image', title: 'Immagine', type: 'image', options: { hotspot: true } },
                    { name: 'alt', title: 'Testo alternativo', type: 'string' },
                    { name: 'name', title: 'Nome', type: 'string' },
                  ],
                },
              ],
            },
          ],
          preview: {
            select: { title: 'name', media: 'image' },
          },
        },
      ],
    }),
    defineField({
      name: 'benvenuti',
      title: 'Sezione Benvenuti',
      type: 'object',
      fields: [
        { name: 'title', title: 'Titolo', type: 'string' },
        { name: 'text', title: 'Testo', type: 'text' },
      ],
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
            { name: 'ctaText', title: 'Testo CTA', type: 'string' },
            { name: 'ctaUrl', title: 'URL CTA', type: 'string' },
            { name: 'image', title: 'Foto', type: 'image', options: { hotspot: true } },
            { name: 'imageAlt', title: 'Alt foto', type: 'string' },
            {
              name: 'bgVariant',
              title: 'Variante sfondo',
              type: 'string',
              options: { list: ['dark', 'bianco', 'pistacchio'] },
            },
            {
              name: 'photoPosition',
              title: 'Posizione foto',
              type: 'string',
              options: { list: ['left', 'right'] },
            },
          ],
          preview: {
            select: { title: 'title', media: 'image' },
          },
        },
      ],
    }),
  ],
  preview: {
    prepare: () => ({ title: 'Homepage' }),
  },
});

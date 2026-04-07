import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'aboutPage',
  title: 'Chi Siamo',
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
          ],
          preview: {
            select: { title: 'alt', media: 'image' },
          },
        },
      ],
    }),
    defineField({
      name: 'storiaTitle',
      title: 'La nostra storia — Titolo',
      type: 'string',
    }),
    defineField({
      name: 'storiaText',
      title: 'La nostra storia — Testo',
      type: 'text',
    }),
    defineField({
      name: 'chefs',
      title: 'Maestri Pasticceri',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'name', title: 'Nome', type: 'string' },
            { name: 'role', title: 'Ruolo', type: 'string' },
            { name: 'bio', title: 'Biografia', type: 'text' },
            { name: 'portrait', title: 'Foto', type: 'image', options: { hotspot: true } },
          ],
          preview: {
            select: { title: 'name', subtitle: 'role', media: 'portrait' },
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
      name: 'ctaButtonText',
      title: 'CTA — Testo pulsante',
      type: 'string',
    }),
    defineField({
      name: 'ctaButtonUrl',
      title: 'CTA — URL pulsante',
      type: 'string',
    }),
  ],
  preview: {
    prepare: () => ({ title: 'Chi Siamo' }),
  },
});

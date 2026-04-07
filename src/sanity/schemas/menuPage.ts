import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'menuPage',
  title: 'Pagina Menu',
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
      name: 'sections',
      title: 'Sezioni Menu',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'title', title: 'Titolo sezione', type: 'string' },
            { name: 'subtitle', title: 'Sottotitolo', type: 'text', rows: 2 },
            {
              name: 'bgVariant',
              title: 'Sfondo',
              type: 'string',
              options: { list: ['white', 'crema'] },
              initialValue: 'white',
            },
            {
              name: 'items',
              title: 'Prodotti',
              type: 'array',
              of: [
                {
                  type: 'object',
                  fields: [
                    { name: 'name', title: 'Nome', type: 'string' },
                    { name: 'description', title: 'Descrizione', type: 'text', rows: 2 },
                    { name: 'price', title: 'Prezzo', type: 'string' },
                    { name: 'image', title: 'Foto', type: 'image', options: { hotspot: true } },
                    { name: 'alt', title: 'Alt immagine', type: 'string' },
                  ],
                  preview: {
                    select: { title: 'name', subtitle: 'price', media: 'image' },
                  },
                },
              ],
            },
          ],
          preview: {
            select: { title: 'title' },
          },
        },
      ],
    }),
  ],
  preview: {
    prepare: () => ({ title: 'Menu' }),
  },
});

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
              name: 'layout',
              title: 'Tipo di layout',
              type: 'string',
              options: {
                list: [
                  { title: 'Prodotti (card con foto)', value: 'products' },
                  { title: 'Gelato (card colorate)', value: 'gelato' },
                ],
                layout: 'radio',
              },
              initialValue: 'products',
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
                    { name: 'badge', title: 'Badge (es. "Iconico")', type: 'string' },
                    {
                      name: 'variants',
                      title: 'Varianti',
                      description: 'Lascia vuoto o una sola variante per un prezzo unico.',
                      type: 'array',
                      of: [
                        {
                          type: 'object',
                          fields: [
                            { name: 'name', title: 'Nome variante', type: 'string' },
                            { name: 'price', title: 'Prezzo (solo numero, es. 3.50)', type: 'number' },
                          ],
                          preview: { select: { title: 'name', subtitle: 'price' } },
                        },
                      ],
                    },
                    { name: 'price', title: 'Prezzo (legacy — se non usi varianti)', type: 'string' },
                    { name: 'image', title: 'Foto', type: 'image', options: { hotspot: true } },
                    { name: 'alt', title: 'Alt immagine', type: 'string' },
                    {
                      name: 'gelatoColor',
                      title: 'Colore card gelato',
                      description: 'Solo per sezioni Gelato. Hex (es. #BBC25C)',
                      type: 'string',
                    },
                    {
                      name: 'gelatoKicker',
                      title: 'Kicker gelato (es. "Sicilia", "IGP")',
                      type: 'string',
                    },
                  ],
                  preview: {
                    select: { title: 'name', subtitle: 'badge', media: 'image' },
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

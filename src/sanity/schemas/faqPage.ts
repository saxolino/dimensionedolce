import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'faqPage',
  title: 'Spedizioni & FAQ',
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
      title: 'Sezioni FAQ',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'title', title: 'Titolo sezione', type: 'string' },
            {
              name: 'faqs',
              title: 'Domande',
              type: 'array',
              of: [
                {
                  type: 'object',
                  fields: [
                    { name: 'question', title: 'Domanda', type: 'string' },
                    { name: 'answer', title: 'Risposta', type: 'text' },
                  ],
                  preview: {
                    select: { title: 'question' },
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
    prepare: () => ({ title: 'Spedizioni & FAQ' }),
  },
});

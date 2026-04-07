import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'contactPage',
  title: 'Contatti',
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
      name: 'formTitle',
      title: 'Titolo form',
      type: 'string',
    }),
    defineField({
      name: 'contactSubjects',
      title: 'Opzioni soggetto',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'value', title: 'Valore', type: 'string' },
            { name: 'label', title: 'Etichetta', type: 'string' },
          ],
        },
      ],
    }),
  ],
  preview: {
    prepare: () => ({ title: 'Contatti' }),
  },
});

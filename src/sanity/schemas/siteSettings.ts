import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'siteSettings',
  title: 'Impostazioni Sito',
  type: 'document',
  fields: [
    defineField({
      name: 'phone',
      title: 'Telefono',
      type: 'string',
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
    }),
    defineField({
      name: 'address',
      title: 'Indirizzo',
      type: 'object',
      fields: [
        { name: 'street', title: 'Via', type: 'string' },
        { name: 'city', title: 'Citta', type: 'string' },
        { name: 'zip', title: 'CAP', type: 'string' },
        { name: 'province', title: 'Provincia', type: 'string' },
      ],
    }),
    defineField({
      name: 'hours',
      title: 'Orari di apertura',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'days', title: 'Giorni', type: 'string' },
            { name: 'time', title: 'Orario', type: 'string' },
          ],
        },
      ],
    }),
    defineField({
      name: 'instagramUrl',
      title: 'URL Instagram',
      type: 'url',
    }),
    defineField({
      name: 'instagramHandle',
      title: 'Handle Instagram',
      type: 'string',
    }),
    defineField({
      name: 'copyrightYear',
      title: 'Anno Copyright',
      type: 'string',
    }),
    defineField({
      name: 'googleMapsEmbedUrl',
      title: 'URL Embed Google Maps',
      type: 'url',
    }),
  ],
  preview: {
    prepare: () => ({ title: 'Impostazioni Sito' }),
  },
});

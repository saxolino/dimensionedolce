import type { StructureBuilder } from 'sanity/structure';

// Desk structure: show each singleton as a single document (no "create new")
export const structure = (S: StructureBuilder) =>
  S.list()
    .title('Contenuti')
    .items([
      S.listItem()
        .title('Impostazioni Sito')
        .child(S.document().schemaType('siteSettings').documentId('siteSettings')),
      S.divider(),
      S.listItem()
        .title('Homepage')
        .child(S.document().schemaType('homePage').documentId('homePage')),
      S.listItem()
        .title('Menu')
        .child(S.document().schemaType('menuPage').documentId('menuPage')),
      S.listItem()
        .title('Chi Siamo')
        .child(S.document().schemaType('aboutPage').documentId('aboutPage')),
      S.listItem()
        .title('Catering & Eventi')
        .child(S.document().schemaType('cateringPage').documentId('cateringPage')),
      S.listItem()
        .title('Contatti')
        .child(S.document().schemaType('contactPage').documentId('contactPage')),
      S.listItem()
        .title('Spedizioni & FAQ')
        .child(S.document().schemaType('faqPage').documentId('faqPage')),
    ]);

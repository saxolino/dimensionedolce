import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { presentationTool, defineLocations } from 'sanity/presentation';
import { schemaTypes } from './src/sanity/schemas';
import { structure } from './src/sanity/structure';

const singletonLocation = (title: string, href: string) =>
  defineLocations({
    locations: [{ title, href }],
    message: `Questa pagina è visibile su ${href}`,
  });

export default defineConfig({
  name: 'dimensione-dolce',
  title: 'Dimensione Dolce',
  projectId: 'gk5zqp4d',
  dataset: 'production',
  plugins: [
    structureTool({ structure }),
    presentationTool({
      previewUrl: '/',
      resolve: {
        locations: {
          homePage: singletonLocation('Home', '/'),
          aboutPage: singletonLocation('Chi Siamo', '/chi-siamo'),
          menuPage: singletonLocation('Menu', '/menu'),
          cateringPage: singletonLocation('Catering & Eventi', '/catering-eventi'),
          contactPage: singletonLocation('Contatti', '/contatti'),
          faqPage: singletonLocation('Spedizioni & FAQ', '/spedizioni-faq'),
          siteSettings: defineLocations({
            locations: [
              { title: 'Home', href: '/' },
              { title: 'Menu', href: '/menu' },
              { title: 'Chi Siamo', href: '/chi-siamo' },
              { title: 'Catering & Eventi', href: '/catering-eventi' },
              { title: 'Contatti', href: '/contatti' },
            ],
            message: 'Impostazioni globali del sito (header, footer, SEO)',
          }),
        },
      },
    }),
  ],
  schema: {
    types: schemaTypes,
  },
});

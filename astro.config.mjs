import { defineConfig } from 'astro/config';
import sanity from '@sanity/astro';
import react from '@astrojs/react';
import vercel from '@astrojs/vercel';

export default defineConfig({
  output: 'server',
  adapter: vercel(),
  build: {
    format: 'file',
  },
  integrations: [
    sanity({
      projectId: 'gk5zqp4d',
      dataset: 'production',
      useCdn: false,
      stega: {
        studioUrl: 'https://dimensionedolce.sanity.studio',
      },
    }),
    react(),
  ],
});

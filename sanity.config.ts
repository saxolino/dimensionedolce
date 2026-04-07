import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { presentationTool } from 'sanity/presentation';
import { schemaTypes } from './src/sanity/schemas';
import { structure } from './src/sanity/structure';

export default defineConfig({
  name: 'dimensione-dolce',
  title: 'Dimensione Dolce',
  projectId: 'gk5zqp4d',
  dataset: 'production',
  plugins: [
    structureTool({ structure }),
    presentationTool({
      previewUrl: '/',
    }),
  ],
  schema: {
    types: schemaTypes,
  },
});

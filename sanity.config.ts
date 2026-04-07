import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { schemaTypes } from './src/sanity/schemas';
import { structure } from './src/sanity/structure';

export default defineConfig({
  name: 'dimensione-dolce',
  title: 'Dimensione Dolce',
  projectId: 'gk5zqp4d',
  dataset: 'production',
  plugins: [structureTool({ structure })],
  schema: {
    types: schemaTypes,
  },
});

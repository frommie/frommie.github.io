// @ts-check
import { defineConfig } from 'astro/config';

import sanity from '@sanity/astro';

// https://astro.build/config
export default defineConfig({
  site: 'https://frommie.dev',
  integrations: [sanity({
      projectId: "o11nd7s5",
      dataset: "production",
      useCdn: false, // for static builds
  })]
});
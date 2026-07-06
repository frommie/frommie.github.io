// @ts-check
import { defineConfig } from 'astro/config';

import sanity from '@sanity/astro';

// https://astro.build/config
export default defineConfig({
  site: 'https://frommie.dev',
  build: {
    // CSS inline ausliefern statt als render-blockende /_astro/*.css —
    // auf GitHub Pages (max-age=600) bringt externes CSS ohnehin kaum Cache-Nutzen
    inlineStylesheets: 'always',
  },
  integrations: [sanity({
      projectId: "o11nd7s5",
      dataset: "production",
      useCdn: false, // for static builds
  })]
});
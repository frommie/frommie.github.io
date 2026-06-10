import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'

export default defineConfig({
  name: 'default',
  title: 'Homepage',

  projectId: 'o11nd7s5',
  dataset: 'production',

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            S.documentTypeListItem('photo'),
            S.documentTypeListItem('micro'),
            S.documentTypeListItem('article'),
            S.documentTypeListItem('now'),
            S.listItem()
              .title('Site Settings')
              .child(
                S.document()
                  .schemaType('siteSettings')
                  .documentId('siteSettings')
              )
          ])
    }), 
    visionTool()
  ],

  schema: {
    types: schemaTypes,
  },
})

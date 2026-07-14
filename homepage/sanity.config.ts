import {defineConfig, isDev} from 'sanity'
import {structureTool, type StructureBuilder} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {codeInput} from '@sanity/code-input'
import {ImageIcon, CommentIcon, DocumentTextIcon, ClockIcon, CogIcon} from '@sanity/icons'
import {schemaTypes} from './schemaTypes'

// Dokumentliste, standardmäßig nach Veröffentlichungsdatum sortiert
const byPublishedAt = (S: StructureBuilder, type: string, title: string) =>
  S.listItem()
    .title(title)
    .schemaType(type)
    .child(
      S.documentTypeList(type)
        .title(title)
        .defaultOrdering([{field: 'publishedAt', direction: 'desc'}])
    )

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
            byPublishedAt(S, 'photo', 'Photos').icon(ImageIcon),
            byPublishedAt(S, 'micro', 'Micro Posts').icon(CommentIcon),
            byPublishedAt(S, 'article', 'Articles').icon(DocumentTextIcon),
            S.documentTypeListItem('now').icon(ClockIcon),
            S.listItem()
              .title('Site Settings')
              .icon(CogIcon)
              .child(
                S.document()
                  .schemaType('siteSettings')
                  .documentId('siteSettings')
              )
          ])
    }),
    codeInput(),
    ...(isDev ? [visionTool()] : [])
  ],

  schema: {
    types: schemaTypes,
  },
})

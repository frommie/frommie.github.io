// schemas/article.ts

import { defineType, defineField, defineArrayMember } from "sanity";
import { formatPreviewDate } from "./lib/formatDate";

export default defineType({
  name: "article",
  title: "Article",
  type: "document",

  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: Rule => Rule.required(),
    }),

    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      of: [{ type: "string" }],
      options: { layout: "tags" },
    }),

    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: Rule => Rule.required(),
    }),

    defineField({
      name: "excerpt",
      title: "Excerpt",
      description: "Kurze Zusammenfassung — erscheint als Lede über dem Artikel und als Meta-Description.",
      type: "text",
      rows: 3,
      validation: Rule =>
        Rule.max(160).warning("Über 160 Zeichen wird die Meta-Description in Suchergebnissen abgeschnitten."),
    }),

    defineField({
      name: "content",
      title: "Content",
      type: "array",
      of: [
        defineArrayMember({
          type: "block",
          // Nur Styles anbieten, die das Frontend auch stylt (siehe articles/[slug].astro).
          styles: [
            { title: "Normal", value: "normal" },
            { title: "Überschrift", value: "h2" },
            { title: "Zwischenüberschrift", value: "h3" },
            { title: "Zitat", value: "blockquote" },
          ],
          lists: [
            { title: "Aufzählung", value: "bullet" },
            { title: "Nummerierung", value: "number" },
          ],
          marks: {
            decorators: [
              { title: "Fett", value: "strong" },
              { title: "Kursiv", value: "em" },
              { title: "Code", value: "code" },
            ],
            annotations: [
              defineArrayMember({
                name: "link",
                title: "Link",
                type: "object",
                fields: [
                  defineField({
                    name: "href",
                    title: "URL",
                    type: "url",
                    validation: Rule =>
                      Rule.required().uri({ scheme: ["http", "https", "mailto"] }),
                  }),
                ],
              }),
            ],
          },
        }),
        defineArrayMember({
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({
              name: "alt",
              title: "Alt-Text",
              description: "Beschreibung des Bilds für Screenreader und wenn das Bild nicht lädt.",
              type: "string",
            }),
            defineField({
              name: "caption",
              title: "Bildunterschrift",
              type: "string",
            }),
          ],
        }),
        defineArrayMember({
          type: "code",
          options: { withFilename: true },
        }),
      ],
    }),

    defineField({
      name: "publishedAt",
      title: "Published At",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
      validation: Rule => Rule.required(),
    }),
  ],

  orderings: [
    {
      title: "Veröffentlichung (neueste zuerst)",
      name: "publishedAtDesc",
      by: [{ field: "publishedAt", direction: "desc" }],
    },
  ],

  preview: {
    select: {
      title: "title",
      excerpt: "excerpt",
      date: "publishedAt",
    },
    prepare({ title, excerpt, date }) {
      return {
        title,
        subtitle: [formatPreviewDate(date), excerpt].filter(Boolean).join(" — "),
      };
    },
  },
});

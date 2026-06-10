// schemas/now.ts
// Singleton: only one "now" document should exist. The site renders the
// most recently edited one and uses Sanity's _updatedAt as "Stand: …".

import { defineType, defineField } from "sanity";

export default defineType({
  name: "now",
  title: "Now",
  type: "document",

  fields: [
    defineField({
      name: "intro",
      title: "Intro",
      description: "Optionaler Einstiegssatz — wird kursiv in Serif gerendert.",
      type: "text",
      rows: 2,
    }),

    defineField({
      name: "sections",
      title: "Sections",
      type: "array",
      of: [
        {
          type: "object",
          name: "nowSection",
          title: "Section",
          fields: [
            defineField({
              name: "label",
              title: "Label",
              description: "z. B. „Baue gerade“, „Lese“, „Höre“, „Fotografiere“",
              type: "string",
              validation: Rule => Rule.required(),
            }),
            defineField({
              name: "items",
              title: "Einträge",
              description: "Ein Eintrag pro Zeile; URLs werden automatisch verlinkt.",
              type: "array",
              of: [{ type: "text", rows: 2 }],
              validation: Rule => Rule.required().min(1),
            }),
          ],
          preview: {
            select: { title: "label", items: "items" },
            prepare({ title, items }) {
              const count = Array.isArray(items) ? items.length : 0;
              return {
                title,
                subtitle: `${count} ${count === 1 ? "Eintrag" : "Einträge"}`,
              };
            },
          },
        },
      ],
    }),
  ],

  preview: {
    prepare() {
      return { title: "Jetzt / Now" };
    },
  },
});

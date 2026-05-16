// schemas/micro.ts

import { defineType, defineField } from "sanity";

export default defineType({
  name: "micro",
  title: "Micro Post",
  type: "document",

  fields: [
    defineField({
      name: "text",
      title: "Text",
      type: "text",
      rows: 4,
      validation: Rule => Rule.required().max(300),
    }),

    defineField({
      name: "publishedAt",
      title: "Published At",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
      validation: Rule => Rule.required(),
    }),
  ],

  preview: {
    select: {
      title: "text",
      subtitle: "publishedAt",
    },
    prepare({ title, subtitle }) {
      return {
        title: title?.slice(0, 50),
        subtitle: subtitle,
      };
    },
  },
});
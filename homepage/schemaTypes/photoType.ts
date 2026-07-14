import { defineType, defineField } from "sanity";
import { ExifImageInput } from "../components/ExifImageInput";
import { formatPreviewDate } from "./lib/formatDate";

export default defineType({
  name: "photo",
  title: "Photo",
  type: "document",
  fields: [
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      components: { input: ExifImageInput as any },
      options: {
        hotspot: true,
        metadata: ["blurhash", "lqip", "palette", "image", "exif", "location"],
      },
      fields: [
        defineField({
          name: "exif",
          title: "EXIF",
          type: "object",
          readOnly: true,
          options: { collapsible: true, collapsed: true },
          fields: [
            defineField({ name: "make",        title: "Hersteller",     type: "string" }),
            defineField({ name: "model",       title: "Kameramodell",  type: "string" }),
            defineField({ name: "lens",        title: "Objektiv",      type: "string" }),
            defineField({ name: "focalLength", title: "Brennweite",    type: "number" }),
            defineField({ name: "aperture",    title: "Blende",        type: "string" }),
            defineField({ name: "shutterSpeed",title: "Verschluss",    type: "string" }),
            defineField({ name: "iso",         title: "ISO",           type: "number" }),
            defineField({ name: "takenAt",     title: "Aufnahmedatum", type: "datetime" }),
          ],
        }),
      ],
      validation: Rule => Rule.required(),
    }),

    defineField({ name: "caption",  title: "Caption",  type: "string" }),
    defineField({ name: "camera",   title: "Camera",   type: "string", initialValue: "Fujifilm X100VI" }),
    defineField({ name: "location", title: "Location", type: "string" }),
    defineField({
      name: "publishedAt", title: "Published At", type: "datetime",
      initialValue: () => new Date().toISOString(),
      validation: Rule => Rule.required(),
    }),
  ],
  preview: {
    select: { media: "image", title: "caption", subtitle: "publishedAt" },
    prepare({ media, title, subtitle }) {
      return {
        media,
        title: title || "Ohne Caption",
        subtitle: formatPreviewDate(subtitle),
      };
    },
  },
});

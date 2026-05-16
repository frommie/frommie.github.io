// src/lib/sanity.ts
import { createClient } from "@sanity/client";
import { createImageUrlBuilder, type SanityImageSource } from '@sanity/image-url'

export const client = createClient({
  projectId: "o11nd7s5",
  dataset: "production",
  useCdn: true,
  apiVersion: "2024-01-01"
});

export async function getStream() {
  return client.fetch(`
    *[_type in ["article", "micro", "photo"]]
    | order(publishedAt desc)
  `);
}

const builder = createImageUrlBuilder(client)

export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}
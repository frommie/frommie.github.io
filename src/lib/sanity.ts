// src/lib/sanity.ts
import { createClient } from "@sanity/client";
import { createImageUrlBuilder, type SanityImageSource } from '@sanity/image-url'

export const client = createClient({
  projectId: "o11nd7s5",
  dataset: "production",
  // All fetches happen at build time — skip the CDN so rebuilds
  // always see freshly published content instead of a stale cache.
  useCdn: false,
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
// src/lib/queries.ts

export const streamQuery = `
*[_type in ["micro", "photo", "article"]]
| order(publishedAt desc) {
  _type,
  _id,
  publishedAt,

  // micro
  text,
  link,

  // photo
  caption,
  image {
    crop,
    hotspot,
    exif {
      make, model, lens,
      focalLength, aperture, shutterSpeed,
      iso, takenAt
    },
    asset->{
      url,

      metadata {
        exif,
        blurhash, 
        lqip, 
        palette,
        location
      }
    }
  },

  // article
  title,
  slug,
  excerpt,
  tags
}
`;

export const articleQuery = `
*[_type == "article" && slug.current == $slug][0] {
  title,
  excerpt,
  content,
  publishedAt,
  tags,
  "readingTime": coalesce(round(length(pt::text(content)) / 5 / 200), 1)
}
`;

export const slugsQuery = `
*[_type == "article" && defined(slug.current)][].slug.current
`;
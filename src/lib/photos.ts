import { client, urlFor } from './sanity';

export interface PhotoExif {
  make?:         string | null;
  model?:        string | null;
  lens?:         string | null;
  focalLength?:  number | null;
  aperture?:     string | null;
  shutterSpeed?: string | null;
  iso?:          number | null;
  takenAt?:      string | null;
}

export interface SanityPhoto {
  _id:          string;
  caption?:     string;
  publishedAt?: string;
  camera?:      string;
  location?:    string;
  image: {
    crop?:    { top: number; bottom: number; left: number; right: number };
    hotspot?: { x: number; y: number; width: number; height: number };
    exif?:    PhotoExif;
    asset: {
      _id: string;
      metadata: {
        dimensions: {
          width:  number;
          height: number;
          aspectRatio: number;
        };
      } | null;
    };
  };
}

export const PHOTOS_QUERY = `
  *[_type == "photo"] | order(publishedAt desc, _createdAt desc) {
    _id, caption, publishedAt, camera, location,
    image {
      crop, hotspot,
      exif {
        make, model, lens,
        focalLength, aperture, shutterSpeed,
        iso, takenAt
      },
      asset->{
        _id,
        metadata {
          dimensions { width, height, aspectRatio }
        }
      }
    }
  }
`;

export function fetchPhotos(): Promise<SanityPhoto[]> {
  return client.fetch(PHOTOS_QUERY);
}

export function lightboxImageUrl(photo: SanityPhoto): string {
  return urlFor(photo.image)
    .width(1600)
    .fit('max')
    .url();
}

export function photoImageUrl(photo: SanityPhoto, span: string): string {
  const w = span === 'pg-wide' ? 960 : 470;
  const h = span === 'pg-tall' ? 800 : 400;
  return urlFor(photo.image).width(w).height(h).fit('crop').url();
}

export function effectiveAspectRatio(photo: SanityPhoto): number {
  const dims = photo.image?.asset?.metadata?.dimensions;
  const baseRatio = dims?.aspectRatio ?? 1;

  const { left = 0, right = 0, top = 0, bottom = 0 } = photo.image?.crop ?? {};
  const wFactor = 1 - left - right;
  const hFactor = 1 - top - bottom;

  if (wFactor <= 0 || hFactor <= 0) return 1;
  return baseRatio * (wFactor / hFactor);
}

export function spanClass(ratio: number): 'pg-tall' | 'pg-wide' | '' {
  if (ratio < 0.80) return 'pg-tall';
  if (ratio > 1.65) return 'pg-wide';
  return '';
}

export function formatExifSummary(exif?: PhotoExif | null): string {
  if (!exif) return '';
  return [
    exif.aperture,
    exif.shutterSpeed,
    exif.iso ? `ISO ${exif.iso}` : null,
  ].filter(Boolean).join(' · ');
}

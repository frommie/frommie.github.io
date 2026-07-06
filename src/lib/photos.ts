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
        lqip?: string;
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
          lqip,
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

/* Width-only URLs — the photo keeps its true (editor-cropped) aspect ratio,
   the justified grid adapts to the photo instead of cropping it. */
export function photoImageUrl(photo: SanityPhoto, width = 700): string {
  return urlFor(photo.image).width(width).fit('max').auto('format').quality(75).url();
}

export function photoSrcSet(photo: SanityPhoto): string {
  const widths = [320, 480, 700, 960];
  return widths
    .map(w => `${urlFor(photo.image).width(w).fit('max').auto('format').quality(75).url()} ${w}w`)
    .join(', ');
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

/* Per DESIGN.md: "ƒ/2.8 · 1/250s · ISO 200 · 35mm" — middle dot separators,
   normalised regardless of how the values were entered in Sanity. */
export function formatExifSummary(exif?: PhotoExif | null): string {
  if (!exif) return '';
  const aperture = exif.aperture
    ? `ƒ/${String(exif.aperture).replace(/^[fƒ]\s*\/?\s*/i, '')}`
    : null;
  const shutter = exif.shutterSpeed
    ? (/s$/i.test(exif.shutterSpeed) ? exif.shutterSpeed : `${exif.shutterSpeed}s`)
    : null;
  return [
    aperture,
    shutter,
    exif.iso ? `ISO ${exif.iso}` : null,
    exif.focalLength ? `${exif.focalLength}mm` : null,
  ].filter(Boolean).join(' · ');
}

// Formats ISO datetimes for Studio list previews (de-DE, e.g. "11. Juli 2026").
export function formatPreviewDate(iso?: string): string {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("de-DE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

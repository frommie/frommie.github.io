import { client } from './sanity';

// ── Types ──────────────────────────────────────────────────────────
export interface NowSection {
  _key?: string;
  label: string;     // "Baue gerade", "Lese", "Höre", …
  items: string[];   // free-form lines; bare URLs become links on render
}

export interface NowDoc {
  updatedAt: string; // Sanity _updatedAt — no manual date field needed
  intro?: string;
  sections?: NowSection[];
}

// ── Query ──────────────────────────────────────────────────────────
// Singleton: there should only ever be one `now` document; if more
// exist we take the most recently edited one.
export const NOW_QUERY = `
  *[_type == "now"] | order(_updatedAt desc)[0] {
    "updatedAt": _updatedAt,
    intro,
    sections[]{ _key, label, items }
  }
`;

export function fetchNow(): Promise<NowDoc | null> {
  return client.fetch(NOW_QUERY);
}

// ── Helpers ────────────────────────────────────────────────────────
export function fmtNowDate(iso?: string): string {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('de-DE', {
    day: 'numeric', month: 'long', year: 'numeric',
  });
}

import { client } from './sanity';

// ── Types ──────────────────────────────────────────────────────────
export interface MicroPost {
  _id:          string;
  text:         string;
  publishedAt?: string;
}

export interface MonthGroup {
  label: string;   // "May 2026"
  year:  number;
  posts: MicroPost[];
}

export interface MicroStats {
  total:       number;
  thisYear:    number;
  avgPerMonth: number;
  mostActive:  string;
  allYears:    number[];
}

// ── Query ─────────────────────────────────────────────────────────
// Adjust field names to match your schema.
export const MICRO_QUERY = `
  *[_type == "micro"] | order(publishedAt desc, _createdAt desc) {
    _id,
    text,
    publishedAt
  }
`;

export function fetchMicros(): Promise<MicroPost[]> {
  return client.fetch(MICRO_QUERY);
}

// ── Grouping ──────────────────────────────────────────────────────
export function groupByMonth(posts: MicroPost[]): MonthGroup[] {
  const map = new Map<string, MonthGroup>();

  for (const post of posts) {
    const d     = post.publishedAt ? new Date(post.publishedAt) : new Date();
    const label = d.toLocaleDateString('de-DE', { month: 'long', year: 'numeric' });
    const year  = d.getFullYear();

    if (!map.has(label)) map.set(label, { label, year, posts: [] });
    map.get(label)!.posts.push(post);
  }

  return Array.from(map.values());
}

// ── Stats ─────────────────────────────────────────────────────────
export function computeStats(posts: MicroPost[]): MicroStats {
  const currentYear  = new Date().getFullYear();
  const thisYear     = posts.filter(
    p => p.publishedAt && new Date(p.publishedAt).getFullYear() === currentYear
  ).length;

  // Count posts per calendar month for avg + most-active
  const monthCounts = new Map<string, number>();
  for (const post of posts) {
    if (!post.publishedAt) continue;
    const key = post.publishedAt.slice(0, 7); // "2026-05"
    monthCounts.set(key, (monthCounts.get(key) ?? 0) + 1);
  }

  const months      = Array.from(monthCounts.entries());
  const avgPerMonth = months.length
    ? Math.round((posts.length / months.length) * 10) / 10
    : 0;

  const mostActiveKey = months.sort((a, b) => b[1] - a[1])[0]?.[0] ?? '';
  const mostActive    = mostActiveKey
    ? new Date(`${mostActiveKey}-01`).toLocaleDateString('de-DE', {
        month: 'short', year: '2-digit',
      })
    : '—';

  const allYears = [
    ...new Set(
      posts
        .map(p => (p.publishedAt ? new Date(p.publishedAt).getFullYear() : null))
        .filter((y): y is number => y !== null)
    ),
  ].sort((a, b) => b - a);

  return { total: posts.length, thisYear, avgPerMonth, mostActive, allYears };
}

// ── Body processing ───────────────────────────────────────────────
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

const URL_RE = /(https?:\/\/[^\s<>"']+)/g;

/** Escapes HTML, wraps paragraphs, and converts bare URLs to <a> tags. */
export function processBody(raw: string): string {
  return raw
    .trim()
    .split(/\n{2,}/)
    .map(para =>
      `<p>${escapeHtml(para)
        .split('\n')
        .join('<br>')
        .replace(
          URL_RE,
          '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>',
        )}</p>`,
    )
    .join('');
}

// ── Date helpers ──────────────────────────────────────────────────
export function fmtShortDate(iso?: string): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('de-DE', {
    month: 'short', day: 'numeric',
  });
}
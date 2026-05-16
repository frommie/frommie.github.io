import { client } from './sanity';

// ── Types ──────────────────────────────────────────────────────────
export interface Article {
  _id:          string;
  title:        string;
  slug:         string;
  excerpt?:     string;
  publishedAt?: string;
  tags?:        string[];
  readingTime:  number;  // minutes
}

export interface ArticleStats {
  total:        number;
  totalMinutes: number;
  avgMinutes:   number;
  topTag:       string;
  allTags:      string[];
  allYears:     number[];
}

export type TimeBucket = 'quick' | 'medium' | 'long';

// ── Query ─────────────────────────────────────────────────────────
// pt::text() extracts plain text from Portable Text for word counting.
// Adjust field names to match your schema.
export const ARTICLES_QUERY = `
  *[_type == "article"] | order(publishedAt desc, _createdAt desc) {
    _id,
    title,
    "slug": slug.current,
    excerpt,
    publishedAt,
    tags,
    "readingTime": coalesce(
      round(length(pt::text(content)) / 5 / 200),
      1
    )
  }
`;

export const FEATURED_QUERY = `
  *[_id == "siteSettings"][0]{
    featuredArticle-> {
      ...,
      "slug": slug.current
    }
  }
`;

export const ARTICLES_BY_TAG_QUERY = `
  *[_type == "article" && $tag in tags] | order(publishedAt desc, _createdAt desc) {
    _id,
    title,
    "slug": slug.current,
    excerpt,
    publishedAt,
    tags,
    "readingTime": coalesce(
      round(length(pt::text(content)) / 5 / 200),
      1
    )
  }
`;

export function fetchArticles(): Promise<Article[]> {
  return client.fetch(ARTICLES_QUERY);
}

export function fetchArticlesByTag(tag: string): Promise<Article[]> {
  return client.fetch(ARTICLES_BY_TAG_QUERY, { tag });
}

export async function fetchFeaturedArticle(): Promise<Article | null> {
  const result = await client.fetch(FEATURED_QUERY);
  return result?.featuredArticle ?? null;
}

// ── Stats ─────────────────────────────────────────────────────────
export function computeStats(articles: Article[]): ArticleStats {
  const totalMinutes = articles.reduce((n, a) => n + (a.readingTime ?? 0), 0);
  const avgMinutes   = articles.length
    ? Math.round(totalMinutes / articles.length)
    : 0;

  const tagCounts = new Map<string, number>();
  for (const a of articles)
    for (const t of (a.tags ?? []))
      tagCounts.set(t, (tagCounts.get(t) ?? 0) + 1);

  const topTag  = [...tagCounts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? '—';
  const allTags = [...tagCounts.keys()].sort();

  const allYears = [...new Set(
    articles
      .map(a => a.publishedAt ? new Date(a.publishedAt).getFullYear() : null)
      .filter((y): y is number => y !== null),
  )].sort((a, b) => b - a);

  return { total: articles.length, totalMinutes, avgMinutes, topTag, allTags, allYears };
}

// ── Grouping ──────────────────────────────────────────────────────
export function groupByYear(articles: Article[]): [number, Article[]][] {
  const map = new Map<number, Article[]>();
  for (const a of articles) {
    const year = a.publishedAt ? new Date(a.publishedAt).getFullYear() : 0;
    if (!map.has(year)) map.set(year, []);
    map.get(year)!.push(a);
  }
  return [...map.entries()].sort((a, b) => b[0] - a[0]);
}

// ── Helpers ───────────────────────────────────────────────────────
export function timeBucket(minutes: number): TimeBucket {
  if (minutes <= 5)  return 'quick';
  if (minutes <= 15) return 'medium';
  return 'long';
}

export function fmtTotalTime(minutes: number): string {
  if (minutes < 60) return `${minutes}m`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

export function fmtDate(iso?: string, opts?: Intl.DateTimeFormatOptions): string {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('de-DE', opts ?? {
    month: 'short', day: 'numeric', year: 'numeric',
  });
}

export function fmtShortDate(iso?: string): string {
  return fmtDate(iso, { month: 'short', day: 'numeric' });
}
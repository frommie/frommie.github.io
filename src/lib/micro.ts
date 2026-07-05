import { client } from './sanity';

// ── Types ──────────────────────────────────────────────────────────
export interface MicroPost {
  _id:          string;
  text:         string;
  publishedAt?: string;
  link?:        string;
}

export interface LinkPreview {
  url:          string;
  domain:       string;
  title:        string;
  description?: string;
  image?:       string;
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
    publishedAt,
    link
  }
`;

export function fetchMicros(): Promise<MicroPost[]> {
  return client.fetch(MICRO_QUERY);
}

// ── Link previews ─────────────────────────────────────────────────
// Fetched at build time by scraping OG/meta tags off the target page.
// Cached per URL for the lifetime of the build process.
const linkPreviewCache = new Map<string, Promise<LinkPreview | null>>();

function decodeHtmlEntities(str: string): string {
  return str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/&#x27;/g, "'")
    .trim();
}

function matchMeta(html: string, name: string): string | undefined {
  const attrFirst = new RegExp(
    `<meta[^>]+(?:property|name)=["']${name}["'][^>]+content=["']([^"']*)["']`, 'i',
  );
  const contentFirst = new RegExp(
    `<meta[^>]+content=["']([^"']*)["'][^>]+(?:property|name)=["']${name}["']`, 'i',
  );
  return html.match(attrFirst)?.[1] ?? html.match(contentFirst)?.[1];
}

async function fetchLinkPreviewUncached(url: string): Promise<LinkPreview | null> {
  const domain = new URL(url).hostname.replace(/^www\./, '');

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 5000);
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; thestream-linkpreview/1.0)' },
    });
    clearTimeout(timer);

    if (!res.ok || !(res.headers.get('content-type') ?? '').includes('text/html')) {
      return { url, domain, title: domain };
    }

    const html  = await res.text();
    const title = matchMeta(html, 'og:title') ?? html.match(/<title[^>]*>([^<]*)<\/title>/i)?.[1];
    const desc  = matchMeta(html, 'og:description') ?? matchMeta(html, 'description');
    let image   = matchMeta(html, 'og:image');
    if (image && !/^https?:\/\//i.test(image)) image = new URL(image, url).toString();

    return {
      url,
      domain,
      title: title ? decodeHtmlEntities(title) : domain,
      description: desc ? decodeHtmlEntities(desc) : undefined,
      image,
    };
  } catch {
    // Network failure, timeout, or blocked bot — degrade to a plain link card.
    return { url, domain, title: domain };
  }
}

/** Scrapes OG/meta tags for a link preview card. Never throws; degrades gracefully. */
export function fetchLinkPreview(url: string): Promise<LinkPreview | null> {
  if (!linkPreviewCache.has(url)) {
    linkPreviewCache.set(url, fetchLinkPreviewUncached(url));
  }
  return linkPreviewCache.get(url)!;
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
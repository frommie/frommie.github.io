# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start dev server (Astro, http://localhost:4321)
npm run build     # Production build
npm run preview   # Preview production build
```

The `homepage/` directory is a separate Sanity Studio app with its own `package.json`. To run it:
```bash
cd homepage && npm run dev   # Sanity Studio at http://localhost:3333
```

## Architecture

This is a personal site ("thestream") built with **Astro 6 + Sanity CMS** (projectId `o11nd7s5`, dataset `production`). All content is fetched from Sanity at build time.

### Content model

Three Sanity document types drive the entire site:
- **`article`** — long-form posts with `content` (Portable Text: blocks, image and code blocks), `slug`, `tags`, `excerpt`, `publishedAt`; `readingTime` is computed in GROQ (`queries.ts`), not stored
- **`micro`** — short-form text posts with `text`, `publishedAt`, optional `link` (rendered as link preview); permalink pages at `/micros/[slug]` with the slug derived from `publishedAt` (`microSlug()` in `src/lib/micro.ts`), no slug field in Sanity
- **`photo`** — images with `image` (including `crop`/`hotspot`/`exif`), `caption`, `camera`, `location`, `publishedAt`

The homepage renders a **chronological mixed feed** of all three types via `Stream.astro`.

### Data layer (`src/lib/`)

| File | Responsibility |
|---|---|
| `sanity.ts` | Sanity client + `urlFor()` image URL builder |
| `api.ts` | Generic `sanityFetch<T>()` wrapper; `getStream()`, `getArticle()`, `getAllSlugs()` |
| `queries.ts` | GROQ queries for the stream and article pages |
| `articles.ts` | `fetchArticles()`, `fetchFeaturedArticle()`, stats computation, year grouping, reading time |
| `micro.ts` | `fetchMicros()`, month grouping, stats, `processBody()` (plain text → HTML with link detection) |
| `photos.ts` | `fetchPhotos()`, image URL generation, EXIF helpers, aspect ratio → span class logic |
| `image.ts` | Duplicate `urlFor()` — prefer the one in `sanity.ts` |

### Pages and components

Pages in `src/pages/` map directly to routes. `articles/[slug].astro` handles dynamic article routes (slugs fetched at build time via `getAllSlugs()`).

Each section page delegates rendering to a dedicated feed component:
- `ArticleFeed.astro` — featured card, search/filter/view-toggle (all client-side JS, no framework)
- `MicroFeed.astro` — month-grouped micro posts
- `PhotoGrid.astro` — masonry-style photo grid with lightbox

The `stream/` component tree handles the homepage mixed feed:
- `Stream.astro` → `StreamItem.astro` → `items/{Article,Micro,Photo}Item.astro`

### Styling

**`DESIGN.md` is the binding design system — consult it before any UI work.** It defines the philosophy (personal, editorial, warm — explicitly *not* SaaS-styled), all tokens, component specs, and anti-patterns. Personality elements (serif display headlines, EXIF rows, handmade accents, first-person microcopy) are part of the system and must not be "cleaned up".

All styles use CSS custom properties defined in `src/styles/global.css`. Theme switching (light/dark) is driven by `data-theme` on `<html>`, toggled via `localStorage`. No CSS framework — all styles are scoped within component `<style>` blocks or the global file.

Fonts loaded from Google Fonts: **Sora** (sans), **Lora** (serif), **JetBrains Mono** (mono).

### Sanity Studio

The `homepage/` directory is a standalone Sanity Studio project (v5). Schemas live in code under `homepage/schemaTypes/` (`article`, `micro`, `photo`, `siteSettings`, `now`) and are registered in `schemaTypes/index.ts`. Article body blocks use `@sanity/code-input` for code blocks; custom Portable Text renderers for the frontend live in `src/components/portabletext/`. Schema changes require redeploying the Studio (`cd homepage && npm run deploy`) or running it locally.

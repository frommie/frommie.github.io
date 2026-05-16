# Design System

Reference document for coding agents. Every UI decision for this project is derived from
the tokens and rules below. When building new components or pages, consult this file first.

---

## Philosophy

- **Typography-driven.** Hierarchy comes from font size, weight, and letter-spacing —
  not colour, icons, or decoration.
- **Borders over shadows.** Separation between surfaces is achieved with `1px solid
  var(--c-border)`. Drop shadows are never used.
- **Whitespace is structure.** Generous, consistent spacing creates rhythm. Cramming
  elements together to fit more content is always wrong.
- **One accent colour.** Blue (`--c-accent`) is the only chromatic colour in the UI.
  Everything else is neutral. Callout variants (note, warning) are the only exceptions.
- **Calm and technical.** No gradients, no animations beyond subtle fades/slides,
  no decorative flourishes. The aesthetic targets Vercel, Linear, and Stripe docs.

---

## Tokens

### Spacing

Based on an 8 px grid. All spacing values **must** come from these tokens.

```
--sp-1:  4px
--sp-2:  8px
--sp-3:  12px
--sp-4:  16px
--sp-5:  20px
--sp-6:  24px
--sp-8:  32px
--sp-10: 40px
--sp-12: 48px
--sp-16: 64px
--sp-20: 80px
--sp-24: 96px
```

Do not use arbitrary pixel values (e.g. `margin: 14px`). If an 8 px increment doesn't
fit, prefer the nearest token.

### Border Radius

```
--radius-sm:   6px   → tags, badges, code inline, small chips
--radius-md:   8px   → buttons, inputs, nav links, small cards
--radius-lg:   10px  → image containers, larger cards, callouts, code blocks
--radius-full: 9999px → pill shapes (rare)
```

### Typography

**Fonts**

| Role | Family | Import |
|---|---|---|
| UI + body | `'Sora Variable', 'Sora', sans-serif` → `--font-sans` | Self-hosted via `@fontsource-variable/sora` |
| Article body | `'Lora', Georgia, serif` → `--font-serif` | Self-hosted via `@fontsource/lora` |
| Code + metadata | `'JetBrains Mono Variable', 'JetBrains Mono', monospace` → `--font-mono` | Self-hosted via `@fontsource-variable/jetbrains-mono` |

Use `--font-serif` only for article long-form body text (`font-size: 17px`, `line-height: 1.8`).
All other UI uses `--font-sans`. Timestamps, labels, character counts, slugs, and
code-adjacent metadata always use `--font-mono`.

**Size scale**

```
--text-xs:   11px   → metadata labels, timestamps, badges, captions
--text-sm:   13px   → secondary text, nav links, button labels, small prose
--text-base: 15px   → body text, stream items, form inputs
--text-md:   17px   → article lede, hero bio
--text-lg:   20px   → H4-level headings
--text-xl:   24px   → H3, article card titles
--text-2xl:  30px   → H2
--text-3xl:  38px   → H1 on inner pages
--text-4xl:  50px   → Display / hero headline
```

**Weight**: 400 (regular) and 600 (bold) only. Never use 700.

**Letter-spacing convention** — tighten headings, loosen uppercase labels:

```
Display / H1  → letter-spacing: -0.03em
H2            → letter-spacing: -0.025em
H3            → letter-spacing: -0.02em
H4            → letter-spacing: -0.015em
Uppercase meta labels → letter-spacing: 0.04–0.06em
Mono labels           → letter-spacing: 0.03–0.05em
```

**Line heights**

```
--leading-tight:   1.2   → display headings
--leading-snug:    1.4   → card titles, subheadings
--leading-normal:  1.6   → default body
--leading-relaxed: 1.75  → article prose, long descriptions
```

### Transitions

```
--ease:     cubic-bezier(0.16, 1, 0.3, 1)   → spring-like, used for all transforms
--t-fast:   120ms   → hover colour/background changes
--t-normal: 200ms   → show/hide, panel opens
--t-slow:   320ms   → theme switch, page fade-in
```

Always pair transitions: `transition: background var(--t-fast), color var(--t-fast)`.
Transforms use `var(--ease)`: `transition: transform var(--t-normal) var(--ease)`.

---

## Colour Tokens

Toggled by `[data-theme="light"]` / `[data-theme="dark"]` on `<html>`.
**Never hardcode hex values** in component CSS. Always reference a token.

### Light mode `[data-theme="light"]`

```css
/* Backgrounds */
--c-bg:        #fafafa   /* page background */
--c-surface:   #ffffff   /* card / raised surface */
--c-surface-2: #f5f5f5   /* secondary surface, hover backgrounds */
--c-surface-3: #efefef   /* tertiary surface, striped rows */

/* Borders */
--c-border:        #e5e5e5   /* default separator */
--c-border-strong: #d0d0d0   /* hover state, emphasis */

/* Text */
--c-text:           #111111   /* primary — headings, body */
--c-text-secondary: #6b6b6b   /* captions, metadata, secondary labels */
--c-text-tertiary:  #666666   /* timestamps, placeholders, decorative — min 4.8:1 contrast */

/* Accent (blue — the only chromatic colour) */
--c-accent:        #2f54eb
--c-accent-hover:  #1d3fbf
--c-accent-subtle: #eef1fd   /* accent tinted backgrounds */
--c-accent-text:   #2244cc   /* accent text on subtle bg */

/* Code */
--c-code-bg:   #f4f4f4
--c-code-text: #cc3366

/* Tags */
--c-tag-bg:   #f0f0f0
--c-tag-text: #555555

/* Callouts */
--c-callout-info-bg:    #eef1fd
--c-callout-info-border:#c5cff7
--c-callout-note-bg:    #fefce8
--c-callout-note-border:#fde047
--c-callout-warn-bg:    #fff4f0
--c-callout-warn-border:#f97316
```

### Dark mode `[data-theme="dark"]`

```css
--c-bg:        #0d0d0d
--c-surface:   #141414
--c-surface-2: #1a1a1a
--c-surface-3: #212121

--c-border:        #262626
--c-border-strong: #333333

--c-text:           #f0f0f0
--c-text-secondary: #888888
--c-text-tertiary:  #808080   /* min 4.9:1 contrast on #0d0d0d */

--c-accent:        #5b81ff
--c-accent-hover:  #7b9aff
--c-accent-subtle: #1a2140
--c-accent-text:   #7b9aff

--c-code-bg:   #1e1e1e
--c-code-text: #ff6b9d

--c-tag-bg:   #1e1e1e
--c-tag-text: #aaaaaa

--c-callout-info-bg:    #111827
--c-callout-info-border:#2f54eb
--c-callout-note-bg:    #1a180a
--c-callout-note-border:#ca8a04
--c-callout-warn-bg:    #1a0f08
--c-callout-warn-border:#ea580c
```

**Dark mode rule for custom colours**: if a component uses a colour not covered by
the tokens above (e.g. reading-time badges with green/purple), define both light and
dark overrides explicitly using `[data-theme="dark"] .component` selectors.

Example:
```css
.rt-quick  { background: #eaf3de; color: #3b6d11; }
[data-theme="dark"] .rt-quick { background: #172b0b; color: #86c04e; }
```

---

## Layout

### Content column

```
--content-width: 720px   → all pages except article detail
--article-width: 680px   → article body only
```

The `.container` utility applies the content width:

```css
.container {
  width: 100%;
  max-width: var(--content-width);
  margin: 0 auto;
  padding: 0 var(--sp-6);  /* 24px side padding */
}
```

### Page sections

Page-level sections use generous vertical padding:
- Top of page content: `padding-top: var(--sp-12)` (48px)
- Bottom of page: `padding-bottom: var(--sp-24)` (96px)
- Section separators within a page: `border-bottom: 1px solid var(--c-border)`

### Responsive breakpoint

A single breakpoint at **560px** covers mobile. Typical changes at this width:
- 4-column stat grids → 2 columns
- Side-by-side hero → stacked
- Photo grid multi-column → single column
- Filters row → vertical stack

---

## Components

### Navigation

Height: **56px**, sticky at `top: 0`, `z-index: 100`.  
Background: `var(--c-bg)` (not `--c-surface`). Separated from content by
`border-bottom: 1px solid var(--c-border)`.

Three regions: logo left, nav links centre, actions right.

```
Logo          → --text-base, weight 600, letter-spacing -0.02em
Nav links     → --text-sm, weight 400, color --c-text-secondary
               padding: var(--sp-2) var(--sp-3), radius --radius-md
               hover: background --c-surface-2, color --c-text
               active: same as hover (background + text upgrade)
Theme toggle  → 36×36px, border 1px solid --c-border, radius --radius-md
```

Sticky header offset: any sticky sub-header within a page must use `top: 56px`
to sit flush below the nav without overlapping.

### Buttons

All buttons share a base: `font-family: --font-sans`, `font-size: --text-sm`,
`font-weight: 500`, `border-radius: --radius-md`, `border: 1px solid transparent`,
`letter-spacing: -0.01em`.

**Primary** — high emphasis, dark fill:
```
background: var(--c-text)        color: var(--c-bg)
border-color: var(--c-text)
hover → background/border: --c-accent, translateY(-1px)
```

**Secondary** — medium emphasis, outlined:
```
background: var(--c-surface)     color: var(--c-text)
border-color: var(--c-border)
hover → background: --c-surface-2, border-color: --c-border-strong, translateY(-1px)
```

**Ghost** — low emphasis, no border:
```
background: transparent          color: var(--c-text-secondary)
border-color: transparent
hover → background: --c-surface-2, color: --c-text
```

**Size modifier** — `.btn-sm`: `padding: var(--sp-1) var(--sp-3)`, `font-size: --text-xs`

Default padding for primary/secondary: `var(--sp-2) var(--sp-4)`.
Ghost: `var(--sp-2) var(--sp-3)`.

### Tags / Chips

```
height: 22px
padding: 0 var(--sp-2)
font-size: var(--text-xs), font-weight: 500, letter-spacing: 0.02em
border-radius: var(--radius-sm)
background: var(--c-tag-bg)     color: var(--c-tag-text)
border: 1px solid var(--c-border)
hover → background: --c-accent-subtle, color: --c-accent-text, border-color: --c-accent-subtle
```

**Accent variant** `.tag-accent`: same hover colours but applied statically.

### Stream Item

Every stream item follows this structure:

```html
<article class="stream-item stream-item--{micro|photo|article}">
  <div class="stream-meta">
    <span class="stream-type">micro</span>   <!-- mono, uppercase, tertiary -->
    <span class="stream-dot"></span>          <!-- 3px dot separator -->
    <time class="stream-date">Apr 28</time>   <!-- mono, tertiary -->
  </div>
  <!-- variant-specific content -->
</article>
```

Base item: `padding: var(--sp-8) 0`, `border-bottom: 1px solid var(--c-border)`,
`display: flex; flex-direction: column; gap: var(--sp-4)`.

Stream items animate in with staggered `fadeUp` (opacity 0 + translateY 12px → normal),
`280ms`, `40ms` delay increments per child.

**Micro variant** — text-only:
```
body: --text-base, --leading-relaxed, --c-text, max-width 580px
links: --c-accent, underline, text-decoration-color: --c-accent-subtle
```

**Photo variant** — image with caption:
```
container: border-radius --radius-lg, border 1px solid --c-border
image:     aspect-ratio 16/9, object-fit cover
           hover → scale(1.015), transition 500ms --ease
caption:   --text-sm, --font-serif, italic, --c-text-tertiary, margin-top --sp-3
```

**Article variant** — title + excerpt + footer:
```
title:    --text-xl, weight 600, letter-spacing -0.02em, --leading-snug
          hover → color: --c-accent
excerpt:  --text-base, --leading-relaxed, --c-text-secondary, max-width 560px
footer:   flex row, space-between: tags left, "Read article →" right
read-more: --text-sm, weight 500, --c-accent
           hover → arrow translates +4px
```

### Code Block

```
container: border-radius --radius-lg, border 1px solid --c-border
           background: --c-surface, overflow hidden

header:    background: --c-surface-2, border-bottom 1px solid --c-border
           padding: var(--sp-3) var(--sp-5)
           flex row: filename (--text-xs, --c-text-secondary, mono) |
                     language label (--text-xs, --c-text-tertiary, mono) |
                     copy button (right)

pre:       padding: var(--sp-5), font-size: --text-sm, line-height 1.7
           color: --c-text, font-family: --font-mono
```

Syntax token colours (same light and dark — adjust opacity as needed):
```
.kw  (keyword)   → #5b81ff
.fn  (function)  → #61d4b3
.str (string)    → #f4a261
.cm  (comment)   → --c-text-tertiary, font-style italic
.num (number)    → #c084fc
.op  (operator)  → --c-text-secondary
```

Inline code: `font-family: --font-mono`, `font-size: 0.88em`, `background: --c-code-bg`,
`color: --c-code-text`, `padding: 2px 6px`, `border-radius: --radius-sm`,
`border: 1px solid --c-border`.

### Callouts

```
border-radius: --radius-lg
padding: var(--sp-5) var(--sp-6)
margin: var(--sp-8) 0
display: flex; gap: var(--sp-4)
font-family: --font-sans, --text-base, --leading-relaxed
```

Title: weight 600, `--text-sm`, coloured per variant.
Body: inherits, `--c-text`.

| Variant | Background | Border | Title colour |
|---|---|---|---|
| `--info` | `--c-callout-info-bg` | `--c-callout-info-border` | `--c-accent` |
| `--note` | `--c-callout-note-bg` | `--c-callout-note-border` | `#ca8a04` |
| `--warning` | `--c-callout-warn-bg` | `--c-callout-warn-border` | `#ea580c` |

### Stat Cards

Used in overview pages (articles, micro, photos) to surface key metrics.

```
background: var(--c-surface)
border: 1px solid var(--c-border)
border-radius: var(--radius-md)
padding: var(--sp-4) var(--sp-5)
display: flex; flex-direction: column; gap: var(--sp-1)

label: --text-xs, --font-mono, letter-spacing 0.05em,
       text-transform uppercase, --c-text-tertiary
value: --text-xl, weight 600, letter-spacing -0.02em, --c-text
value--sm modifier: --text-base, padding-top 3px
```

Default grid: `repeat(4, 1fr)`, `gap: var(--sp-3)`.
Mobile (≤560px): `repeat(2, 1fr)`.

### Section / Group Headers

Used for year groups (articles), month groups (micro), stream section labels, etc.

```
display: flex; align-items: center; gap: var(--sp-3)
position: sticky; top: 56px         /* flush below nav */
background: var(--c-bg)              /* must match page bg to mask scrolled content */
padding: var(--sp-2) 0; z-index: 10

label: --text-xs, weight 500, letter-spacing 0.06em, uppercase, --font-mono, --c-text-secondary
line:  flex 1, height 1px, background --c-border   /* the ── separator ── */
count: --text-xs, --font-mono, --c-text-tertiary
```

### Filter Controls

**Search input**:
```
padding: var(--sp-3) var(--sp-10) var(--sp-3) var(--sp-8)
border: 1px solid var(--c-border); border-radius: var(--radius-md)
background: var(--c-surface); font-size: --text-sm; color: --c-text
focus → border-color: var(--c-accent)
search icon: absolute left var(--sp-3), --c-text-tertiary
kbd hint: absolute right var(--sp-3), fades out on focus
```

**Tab group** (year / reading-time / view-type filters):
```
height: 28px; padding: 0 var(--sp-3)
border-radius: var(--radius-md); border: 1px solid var(--c-border)
background: --c-surface; font-size: --text-xs; weight 500; --c-text-secondary
hover → background: --c-surface-2, --c-text
active → background: --c-text, color: --c-bg, border-color: --c-text
```

**Tag pill** (filter strip):
```
height: 24px; padding: 0 var(--sp-2)
border-radius: var(--radius-sm); border: 1px solid var(--c-border)
font-family: --font-mono; font-size: --text-xs; --c-text-secondary
hover → border-color: --c-border-strong, --c-text
active → background: --c-accent-subtle, color: --c-accent-text,
         border-color: --c-accent-subtle
```

### Photo Grid

3-column CSS grid, `grid-auto-rows: 196px`, `gap: var(--sp-3)`.

Span classes:
```
.pg-wide  → grid-column: span 2            (landscape ratio > 1.65)
.pg-tall  → grid-row: span 2               (portrait ratio < 0.80)
.pg-feat  → grid-column: span 2; grid-row: span 2
default   → 1×1                            (square / near-square)
```

Each cell:
```
border-radius: var(--radius-lg); overflow: hidden
border: 1px solid var(--c-border); cursor: pointer
hover → border-color: --c-border-strong
img: width/height 100%, object-fit cover
img hover → scale(1.04), transition 600ms --ease
```

Overlay (hover reveal):
```
background: linear-gradient(to top, rgba(0,0,0,0.72) 0%, transparent 70%)
opacity 0 → 1 on parent hover, transition --t-normal
caption: --text-sm, weight 500, #fff
meta: --text-xs, rgba(255,255,255,0.65), --font-mono
```

Mobile (≤560px): `repeat(2, 1fr)`, `grid-auto-rows: 150px`. Feature span collapses to
1 row.

### Lightbox

Fullscreen overlay: `background: rgba(0,0,0,0.92)`, `backdrop-filter: blur(6px)`.
Inner panel: `max-width: min(860px, 100%)`, scales in via `transform: scale(0.94)
→ scale(1)`, `transition: var(--t-slow) var(--ease)`.

Image: `max-height: 70vh`, `object-fit: contain`.
Caption: `--text-base`, `rgba(255,255,255,0.9)`.
Meta: `--text-xs`, `--font-mono`, `rgba(255,255,255,0.4)`.

Close button: `36×36px`, `border: 1px solid rgba(255,255,255,0.15)`,
`background: rgba(255,255,255,0.08)`.

Prev/next nav buttons: `40×40px`, same border/background treatment.
Positioned via `absolute`, `top: 50%`, outside the inner panel on desktop
(`left/right: -52px`), inside on narrow viewports (≤1020px: `left/right: var(--sp-3)`).
`disabled` state: `opacity: 0.2`, `pointer-events: none`.

Counter: `--text-xs`, `--font-mono`, `rgba(255,255,255,0.35)`.

### Article Page

```
max-width: var(--article-width)   /* 680px */
padding: var(--sp-16) var(--sp-6) var(--sp-24)

h1: clamp(--text-2xl, 4vw, --text-4xl), weight 600, letter-spacing -0.03em
lede: --text-md, --c-text-secondary, --leading-relaxed

body font: --font-serif, 17px, line-height 1.8
h2 in body: --font-sans, --text-xl, weight 600, letter-spacing -0.02em, margin-top 2.5em
h3 in body: --font-sans, --text-lg, weight 600, letter-spacing -0.015em, margin-top 2em
paragraphs: margin-bottom 1.6em
```

### Hero Section

Two-column grid: `grid-template-columns: 1fr auto`, `gap: var(--sp-12)`.

Profile photo: `176×176px`, `border-radius: 14px`, `border: 1px solid --c-border`.
Hover ring: `::before` pseudo, `inset: -5px`, `border-radius: 18px`,
`border: 1px solid --c-accent`, `opacity: 0.18` → `0.35` on hover.
Image hover: `scale(1.03)`, `500ms --ease`.

Mobile (≤560px): single column, photo first (`order: -1`), shrinks to `96×96px`,
`border-radius: 10px`.

---

## Patterns

### Metadata rows

Metadata always uses `--font-mono`, `--text-xs`, `--c-text-tertiary`. Items are
separated by a 3×3px dot `(background: --c-border-strong; border-radius: 50%)`.

```html
<div class="stream-meta">
  <span class="stream-type">article</span>
  <span class="stream-dot"></span>
  <time class="stream-date">May 1, 2026</time>
  <span class="stream-dot"></span>
  <span class="stream-date">8 min read</span>
</div>
```

### "Read more" affordance

```html
<span class="read-more">
  Read article <span class="read-more-arrow">→</span>
</span>
```

Arrow translates `+3px` → `+6px` on hover via gap increase. Colour: `--c-accent`,
weight 500, `--text-sm`.

### Page entry animation

Pages fade and slide up on activation:
```css
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}
/* Applied as: animation: fadeUp 320ms var(--ease) both */
```

### Empty states

Centred column, `padding: var(--sp-20) 0`:
```
icon:  32×32px SVG, --c-text-tertiary, stroke-width 1.5
title: --text-base, weight 500, --c-text
body:  --text-sm, --c-text-secondary
CTA:   --text-sm, --c-accent, ghost button style
```

### Skeleton / loading

```css
@keyframes shimmer {
  from { background-position: -200% 0; }
  to   { background-position:  200% 0; }
}
.pg-skeleton {
  background: linear-gradient(
    90deg,
    var(--c-surface-2) 25%,
    var(--c-surface-3) 50%,
    var(--c-surface-2) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.6s ease-in-out infinite;
  border: 1px solid var(--c-border);
  border-radius: var(--radius-lg);
}
```

---

## Anti-Patterns

The following are explicitly prohibited. If you find yourself about to do any of
these, stop and use the correct token/pattern instead.

| ❌ Don't | ✅ Do instead |
|---|---|
| `box-shadow: 0 4px 12px rgba(0,0,0,0.1)` | `border: 1px solid var(--c-border)` |
| `background: linear-gradient(...)` on UI elements | Flat `var(--c-surface)` or `var(--c-surface-2)` |
| Hardcoded hex values in component CSS | Use a token from the colour table above |
| `font-weight: 700` | `font-weight: 600` (max) |
| `font-size: 14px` | `var(--text-sm)` = 13px or `var(--text-base)` = 15px |
| `margin: 14px` or any non-8px-multiple | Nearest `--sp-*` token |
| Multiple accent colours | `--c-accent` only; callout colours for semantic roles |
| Using `--font-serif` for UI text | `--font-serif` is for article body prose only |
| Using `--font-sans` for timestamps / slugs / counts | `--font-mono` for all code-adjacent metadata |
| `border-radius: 4px` | `--radius-sm` = 6px minimum |
| `transition: all 0.3s ease` | Explicit properties + specific `--t-*` + `--ease` |
| Hardcoded light-mode colours without dark override | Token pair that works in both themes |
| `position: fixed` for overlays | Fullscreen `position: fixed` is fine for lightbox/modal only |
| `letter-spacing: normal` on uppercase labels | Always `letter-spacing: 0.04–0.06em` on `text-transform: uppercase` |
| Omitting `font-family` on monospace elements | Always set `font-family: var(--font-mono)` explicitly |
| Clickable elements without a visible hover state | Every interactive element needs `transition` + hover colour/background change |

---

## Quick Reference

```
Page max-width      720px  (var(--content-width))
Article max-width   680px  (var(--article-width))
Nav height          56px   (sticky top offset for sub-headers)
Base font           15px   Sora (var(--font-sans))
Article font        17px   Lora (var(--font-serif))
Mono font           JetBrains Mono (var(--font-mono))
Accent              #2f54eb light / #5b81ff dark
Mobile breakpoint   560px
Spacing unit        8px
```
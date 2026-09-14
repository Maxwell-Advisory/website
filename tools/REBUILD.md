# Clean-rebuild progress (resumable)

**THE PORT IS COMPLETE (2026-09-14).** All 8 routes are hand-authored Astro on
`layouts/Site.astro`. The legacy system — `layouts/Base.astro`, `src/chunks/`
(88 files) and the old chunk-injecting `components/{Header,Footer}.astro` — has
been deleted. This file is kept as the record of how the site was reverse-
engineered and what remains open.

## How to resume in a new session

```bash
npm run dev                 # http://localhost:4321/website/
bash tools/mirror-all.sh    # refresh ALL live page HTML (do this first!)
npm run compare:refresh     # refresh live CSS (homepage stylesheets, shared)
npm run compare             # homepage diff: type, boxes, rhythm, 6 viewports
```

Then read the status table below and continue at the first `todo` row.

### Non-negotiable lessons (learned the hard way — see memory file)

1. **Refresh the mirror before trusting it.** A stale cache cost a whole round
   (the `.shine` button effect simply wasn't in it).
2. **Never infer an effect from CSS alone.** Read the live element's own
   `className`/`outerHTML` in the **Browser pane** (it has working network;
   Playwright in this sandbox does not) and then look up the classes you find.
3. **Enumerate every custom-CSS block**, don't grep by guessed selector — the
   site-wide `<style id="wp-custom-css">` plus each `/* Start custom CSS for X */`
   block is where nearly all bespoke behaviour lives.
4. **A declared value can be overridden** — the sectors progressbar declares
   `96%` but measures full width. Trust the measurement.
5. **Restart the dev server before comparing** — stale scoped CSS produces
   phantom mismatches.
6. **Astro scoping specificity:** with `scopedStyleStrategy: 'where'` a component
   rule and a global rule are both 0,1,0 and the component (injected later) wins
   ties. Remove component overrides rather than fighting them.

## Structural clustering of the live site

Derived from the widget sequence of every live page (`tools/mirror-all.sh` +
signature diff). **16 remaining pages are only 7 templates.**

| # | Template | Pages | Status |
|---|----------|-------|--------|
| 0 | homepage | `index` | **done** (matches: rhythm 0/6, no overlap/overflow) |
| 1 | ~~title-only stub~~ | 7 sectors + 2 team members | **DELETED** (orphaned + empty; Joe's call) |
| 2 | legal text | `legal-notice`, `privacy-policy` | **done** |
| 3 | contact | `contact` | **done** |
| 4 | for-companies | `for-companies` | **done** |
| 5 | for-investors | `for-investors` | **done** |
| 6 | team (loop-carousel) | `team` | **done** |
| 7 | track-record (loop-grid + off-canvas) | `track-record` | **done** |

Suggested order: 1 → 2 → 3 → 4 → 5 → 6 → 7 (cheapest first; 7 is by far the
most complex and is the one Joe already wanted redesigned).

### Template 1 — DELETED (2026-09-14)

The 7 sector pages and 2 team-member pages had **no content on live** (just the
theme's default page title) AND were **orphaned** — verified across all 17 live
pages, nothing linked to them: the homepage sector cards aren't links, and the
team page's member names are headings, not links. Joe's call: delete.

Removed: `pages/sectors/[slug].astro`, `pages/team/[slug].astro`,
`data/stubPages.ts` and 36 legacy chunk files. The site is now 8 routes.

NB the homepage strip shows 6 sectors; there were 7 pages
(`industrial-decarbonisation` had no card). Sector cards remain content-only.
If sector/bio pages are ever wanted, `data/sectors.ts` and `data/team.ts`
already hold the content.

## Per-page status

| Route | Template | Layout now | Status | Notes |
|-------|----------|-----------|--------|-------|
| `/` | 0 | Site | **done** | 25 box flags left, 13 = intentional Roboto→PP deviation |
| `/legal-notice/` | 2 | Site | **done** | copy in `src/content/legal/*.html`, rendered by `Prose.astro` |
| `/privacy-policy/` | 2 | Site | **done** | same |
| `/contact/` | 3 | Site | **done** | green half-panel; button offset flagged below |
| `/for-companies/` | 4 | Site | **done** | `data/forCompanies.ts`; PageIntro + ReadMore + CtaBanner |
| `/for-investors/` | 5 | Site | **done** | `data/forInvestors.ts`; TypeReveal + per-char darken |
| `/team/` | 6 | Site | **done** | reuses `data/team.ts`; drag carousel, 2-up |
| `/track-record/` | 7 | Site | **done** | `data/trackRecord.ts`; 2-col grid + full-screen panels |

## Custom live behaviours ported (all were bespoke JS/CSS, not Elementor defaults)

| Effect | Where on live | Our implementation |
|---|---|---|
| `.smooth-readmore` | for-companies | `components/site/ReadMore.astro` — excerpt + collapsed continuation (max-height 0.5s / opacity 0.4s), button label swaps READ MORE + / READ LESS − |
| `.typing-target` | for-investors | `components/site/TypeReveal.astro` — empties the paragraph and types it back 10ms/char once 20% in view |
| `.scroll-darken` | homepage intro, for-investors intro | per-character spans lit in sequence |

⚠️ **`.scroll-darken` discrepancy:** live's script lights the letters
**automatically on load, 17ms apart** (`autoAnimate()` on DOMContentLoaded).
Our homepage version is **scroll-position driven** instead. for-investors uses
live's timing (IntersectionObserver then 17ms/char). Worth reconciling — and
the two copies should be extracted into one shared component.

⚠️ When splitting text into per-character spans, use the **plain character**.
Using `&nbsp;` for spaces makes the line unbreakable and causes horizontal
overflow at every width (hit on for-investors).

## Tooling built for this workstream

| Command | What it does |
|---|---|
| `bash tools/mirror-all.sh` | mirrors every live page's HTML to `live-cache/pages/<slug>.html` |
| `npm run compare:refresh` | refreshes live stylesheets |
| `npm run compare [width]` | homepage type/box/rhythm diff vs live, 6 viewports |
| `MSYS_NO_PATHCONV=1 node tools/pagecheck.mjs /path/ ...` | per-page health: header mode, overlaps, h-overflow, console errors, at 375/768/1280 |
| `python tools/outline.py <slug>` | prints a live page's container/widget skeleton — the fastest way to understand a page before porting |

⚠️ In Git Bash **always prefix `pagecheck` with `MSYS_NO_PATHCONV=1`**, or leading
`/` args get rewritten to `C:/Program Files/Git/...`.

## Shared infrastructure added

- `Site.astro` takes **`overlayHeader`** — the header is `position:absolute` +
  white only on the homepage (over the hero). Every other page gets live's
  in-flow dark header. All new pages should omit the prop.
- `components/site/PageTitle.astro` — live's stub `<h1>` geometry (40/48, w500,
  #333, left) in the brand face.
- `data/stubPages.ts` + `pages/sectors/[slug].astro` + `pages/team/[slug].astro`
  replace 9 one-off files.
- `.shine` is now a **global utility** in `global.css` (live defines it site-wide
  and puts it on every button widget); the contact CTA uses it. Hero still has
  its own scoped copy — worth de-duplicating.
- `components/site/Prose.astro` — long-form copy: centred 1140 column,
  13px/19.5px #787575, h2 32px/38.4px w500 (live's measured values). Content
  is raw HTML in `src/content/legal/`, so its rules are `:global()`.

### Open question on /contact/

Live's mailto button sits at x=142 while the address above it starts at x=25 —
it is neither left-aligned with the copy nor centred in the 632px panel. We
left-align it with the copy, which looks tidier. Worth a look.

## Images

All images live in `src/assets/images/` and go through Astro, which emits
responsive WebP with fingerprinted names. `src/lib/images.ts` maps a plain
filename to the processed asset and **throws at build time if it is missing**,
so a bad path fails the build instead of 404-ing in the browser. It also
normalises WordPress size-variant names (`foo-1024x576.jpg` -> `foo-scaled.jpg`),
so the data files did not have to change.

CSS backgrounds (hero, sector cards, contact photo) use `getImage()` rather than
`<Image>`, since they are not `<img>` elements.

`public/wp-content` (52MB) and `public/wp-includes` (20MB) are gone — nothing
referenced them. `dist` is now 3.3MB, of which 2.8MB is imagery.

## Still open

- Homepage has ~25 minor box/type flags (13 are the intentional PP-Neue-Montreal
  -instead-of-Roboto button deviation). Run `npm run compare` to see them.
- The data files still spell image paths as `__BASE__/wp-content/uploads/...`.
  Harmless (only the filename is used) but worth simplifying to bare filenames.
- The track-record panel entrance is a short fade/scale: live sets no CSS
  transition on it, so there was nothing to copy.

## Definition of done (per page)

- Uses `layouts/Site.astro`, no `src/chunks/` import.
- Content lives in `src/data/*.ts` where it repeats.
- Built (`npm run build`) with no console errors.
- Checked at 375 / 768 / 1024 / 1280 / 1440 / 1920: no overlap, no h-overflow.
- Spot-compared against the live page for type, box and spacing.

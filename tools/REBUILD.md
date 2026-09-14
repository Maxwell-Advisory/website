# Clean-rebuild progress (resumable)

Tracks the port of the remaining pages from the legacy Elementor chunks
(`layouts/Base.astro`) to the hand-authored rebuild (`layouts/Site.astro`).
**Update the status table as you go** — this file is the handoff between sessions.

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
| 1 | **title-only stub** | 7 sectors + 2 team members (9 pages) | **done** |
| 2 | legal text | `legal-notice`, `privacy-policy` | todo |
| 3 | contact | `contact` | todo |
| 4 | for-companies | `for-companies` | todo |
| 5 | for-investors | `for-investors` | todo |
| 6 | team (loop-carousel) | `team` | todo |
| 7 | track-record (loop-grid + off-canvas) | `track-record` | todo |

Suggested order: 1 → 2 → 3 → 4 → 5 → 6 → 7 (cheapest first; 7 is by far the
most complex and is the one Joe already wanted redesigned).

### Template 1 — title-only stubs ⚠️ DECISION FOR JOE

On live these 9 pages have **no Elementor content at all**. The entire `<main>` is:

```html
<main>
  <div class="page-header"><h1 class="entry-title">Renewables</h1></div>
  <div class="page-content"></div>
</main>
```

i.e. the hello-elementor default template — header, a bare page title, footer.
They are placeholders. Options: (a) replicate the bare stub to stay visually
identical, or (b) design real sector/bio pages. Defaulting to (a); flagged.

Pages: `/sectors/{renewables,storage,grids,green-gases,clean-transport,
circular-economy,industrial-decarbonisation}/`, `/team/{joe-davis,
adrien-dormesson}/`.

## Per-page status

| Route | Template | Layout now | Status | Notes |
|-------|----------|-----------|--------|-------|
| `/` | 0 | Site | **done** | 25 box flags left, 13 = intentional Roboto→PP deviation |
| `/sectors/renewables/` | 1 | Site | **done** | via `sectors/[slug].astro` |
| `/sectors/storage/` | 1 | Site | **done** | via `sectors/[slug].astro` |
| `/sectors/grids/` | 1 | Site | **done** | via `sectors/[slug].astro` |
| `/sectors/green-gases/` | 1 | Site | **done** | via `sectors/[slug].astro` |
| `/sectors/clean-transport/` | 1 | Site | **done** | via `sectors/[slug].astro` |
| `/sectors/circular-economy/` | 1 | Site | **done** | via `sectors/[slug].astro` |
| `/sectors/industrial-decarbonisation/` | 1 | Site | **done** | via `sectors/[slug].astro` |
| `/team/joe-davis/` | 1 | Site | **done** | via `team/[slug].astro` |
| `/team/adrien-dormesson/` | 1 | Site | **done** | via `team/[slug].astro` |
| `/legal-notice/` | 2 | Base | todo | ~2.5k chars of body copy |
| `/privacy-policy/` | 2 | Base | todo | |
| `/contact/` | 3 | Base | todo | address + email + button |
| `/for-companies/` | 4 | Base | todo | 27 widgets |
| `/for-investors/` | 5 | Base | todo | 28 widgets |
| `/team/` | 6 | Base | todo | member loop-carousel |
| `/track-record/` | 7 | Base | todo | loop-grid + off-canvas popups |

## Tooling built for this workstream

| Command | What it does |
|---|---|
| `bash tools/mirror-all.sh` | mirrors every live page's HTML to `live-cache/pages/<slug>.html` |
| `npm run compare:refresh` | refreshes live stylesheets |
| `npm run compare [width]` | homepage type/box/rhythm diff vs live, 6 viewports |
| `MSYS_NO_PATHCONV=1 node tools/pagecheck.mjs /path/ ...` | per-page health: header mode, overlaps, h-overflow, console errors, at 375/768/1280 |

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

## Definition of done (per page)

- Uses `layouts/Site.astro`, no `src/chunks/` import.
- Content lives in `src/data/*.ts` where it repeats.
- Built (`npm run build`) with no console errors.
- Checked at 375 / 768 / 1024 / 1280 / 1440 / 1920: no overlap, no h-overflow.
- Spot-compared against the live page for type, box and spacing.

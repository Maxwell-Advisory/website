# Maxwell Advisory website — project context

Static, non-WordPress **Astro** rebuild of the Maxwell Advisory website (the live
WordPress site is at `maxwelladvisory.eu`). The goal is to replace the WordPress
version with this static build once we're happy with it.

> This file is auto-loaded by Claude Code as project context. It is a handoff note
> for continuing work in a new session. If you'd rather it not be committed to the
> (public) repo, add `CLAUDE.md` to `.gitignore`.

---

## Repo & hosting

- **GitHub:** `Maxwell-Advisory/website` (org: Maxwell-Advisory; Joe = `Joe16534187`).
- **Hosting:** GitHub Pages, deployed by GitHub Actions (`.github/workflows/deploy.yml`,
  uses `withastro/action`). Pages **Source is set to "GitHub Actions"** (done 2026-07-23),
  so the old failing "Jekyll" `pages-build-deployment` no longer runs.
- **Live URL:** https://maxwell-advisory.github.io/website/
- **Base path:** `/website` (set in `astro.config.mjs`). When moving to the real root
  domain later, change `base` to `/` and `site` to the real domain.

## Local development

```bash
npm install
npm run dev      # dev server at http://localhost:4321/website/
npm run build    # static build into dist/  (currently 17 pages)
npm run preview  # serve the built dist/
```

- **Windows:** this repo needs `git config core.longpaths true` (some Elementor asset
  paths exceed the default limit — checkout/reset fails without it).
- Line endings: source is committed with LF; git may warn "LF will be replaced by
  CRLF" — harmless.

## ⚠️ Why the repo was moved out of Proton Drive

The repo previously lived inside a live-syncing **Proton Drive** folder. Proton's sync
client repeatedly corrupted `.git` mid-session — renaming `.git/config` (wiping the
`origin` remote and `core.longpaths`), `.git/HEAD`, `.git/index`, refs, and even
`dist/` and page files to `"<name> (# Name clash <date> <hash> #)"` copies. Symptoms:
`fatal: not a git repository`, `unknown revision origin/…`, `Filename too long`.

**Keep the working git repo OUT of any live cloud-sync folder.** If it ever recurs:
restore the correct `(# Name clash #)` copy over the real filename, delete duplicates,
re-add origin (`git remote add origin https://github.com/Maxwell-Advisory/website.git`),
and `git config core.longpaths true`. Everything is safe on GitHub — push early/often.

---

## Architecture

Each page is a thin wrapper that injects scraped **Elementor HTML chunks** as raw
strings. Do **not** convert the chunks into Astro templates — they contain inline
`<script>`/`<style>` with `{`, `}` and backticks that Astro would try to interpret.

- `src/chunks/*.{head,pre,mid,post}.html` — raw HTML per page, with `__BASE__/`
  placeholders that get swapped for the base URL at render.
- `src/layouts/Base.astro` — **shared scaffold**: owns `<!doctype>`, `<html>`,
  `<head>`, `<body>`, `Header`, `Footer`, and the `__BASE__` → base-URL substitution.
  Pages pass it `head/pre/mid/post` chunks + a `bodyClass`.
- `src/components/{Header,Footer}.astro` — inject `_header.html` / `_footer.html`.
- `src/pages/**/*.astro` — one per route; minimal (import chunks + `<Base … />`).

### Data-driven content (edit these to change the site)

Repeating content is generated from typed data files — **edit the array, the page
updates**. Each has a `renderX()` that emits the exact Elementor markup; the chunk
carries a `<!--LOOP:name-->` marker the page replaces.

| File | Controls | Add an item by… |
|------|----------|-----------------|
| `src/data/team.ts` | `/team` carousel | adding `{ name, role, bio, image }` |
| `src/data/sectors.ts` | homepage sector strip | adding `{ title, image, id }` |
| `src/data/services.ts` | homepage service accordion | adding `{ title, body, image, … }` |
| `src/data/stats.ts` | homepage counters | adding `{ label, value, suffix }` |
| `src/data/trackRecord.ts` | track-record grid + popups | adding `{ id, title, description, logo? }` |

To edit plain text/images elsewhere, edit the relevant `src/chunks/*.html`.

---

## Work completed (refactor plan A–D)

1. **A — asset cleanup:** removed ~145 MB of unreferenced WordPress/Elementor assets
   (repo 218 MB → ~73 MB). Kept only assets reachable from the built pages.
2. **B — self-hosted fonts:** `@font-face` now points at local `.woff` files instead
   of the live `maxwelladvisory.eu` domain.
3. **C — data-driven content:** team, sectors, services, stats, track record moved to
   `src/data/*.ts` (see table above). Removed 4 orphaned `/samples/` stub pages
   (21 → 17 pages).
4. **D — shared layout:** `src/layouts/Base.astro`; all 17 pages routed through it.

Each step was verified as a **content-equivalent** change (token-multiset diff of
rendered HTML vs the previous version; body classes checked page-by-page; carousels,
accordion, counters, and off-canvas popups confirmed working in-browser). The only
intentional deviations: fonts now local (B), and two track-record popup logos lost a
cosmetic `loading="lazy"` hint (C).

## Branch state

- **`main`** — has A + B + C (merged via PR #1 and PR #2).
- **`draft-changes`** — has A + B + C + **D** (commit `043689c`). **D is not yet in
  `main`.** Push ongoing work here (this is the testing/integration branch).
- To preview a branch on the Pages URL: Actions → "Deploy to GitHub Pages" →
  Run workflow → pick the branch (temporarily points the live site at it).

## Next steps

1. **Open a PR from `draft-changes` → `main`** to land step D (the shared layout).
2. **Track-record popup redesign** — Joe wants the off-canvas popups to feel smoother.
   `src/data/trackRecord.ts` is the starting point; design the new popup UX and update
   the `renderTrackItem()` markup / data shape accordingly.

## Working preferences

- Present findings and options; let Joe decide the direction (don't prescribe).
- Verify changes against the original (content-equivalence) and in the browser before
  declaring done. Push to `draft-changes` early and often.

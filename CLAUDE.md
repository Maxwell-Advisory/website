# Maxwell Advisory website — project context

A from-scratch, code-first **Astro** rebuild of maxwelladvisory.eu, replacing the
WordPress/Elementor site. See `README.md` for how the repo is laid out and how to
run it; this file is the working context that isn't obvious from the code.

> Auto-loaded by Claude Code. If you'd rather it not be in the (public) repo, add
> `CLAUDE.md` to `.gitignore`.

---

## The standing objective

> The two versions of the site should be visually identical — as a static image
> and in motion — irrespective of viewport size or browser. Use screenshots and
> other verification methods to confirm it.

## Repo & hosting

- **GitHub:** `Maxwell-Advisory/website` (org: Maxwell-Advisory; Joe = `Joe16534187`).
- **Hosting:** GitHub Pages via Actions; Pages Source = "GitHub Actions".
- **Live:** https://maxwelladvisory.eu/ (custom domain on GitHub Pages), base path `/`.
- **Branch:** `main` is the production branch, and every push to it deploys to
  the live domain. Make changes on a short-lived branch (e.g.
  `site-updates-sep-2026`), test locally, and merge by pull request. The earlier
  `rebuild-clean` branch no longer exists; its work is on `main`.
- **Status:** since 5 October 2026, maxwelladvisory.eu serves this Astro build
  from GitHub Pages. The WordPress/Elementor original is no longer at the
  domain, so "live" in the notes below and in code comments means that
  original, not the current site.

## ⚠️ Keep the repo out of cloud sync

Proton Drive repeatedly corrupted `.git` mid-session when the repo lived inside a
syncing folder — renaming `.git/config` (wiping `origin` and `core.longpaths`),
`.git/HEAD`, `.git/index` and refs to `"<name> (# Name clash <date> <hash> #)"`.
If it recurs: restore the correct clash copy over the real filename, delete the
duplicates, re-add `origin`, and set `git config core.longpaths true`.

## Comparison tooling — lives OUTSIDE this repo

> **After the cutover:** the mirror scripts fetch from maxwelladvisory.eu, which
> now serves this build. Check what they point at before refreshing the cache,
> or the WordPress reference copy will be overwritten with the rebuild itself.

The live-vs-rebuild harness is in the sibling folder **`../04. Comparison Tools/`**
(moved out on 2026-09-14 to keep this repo to site code only). It has its own
`package.json` and finds this repo via `SITE_DIR`, defaulting to
`../03. Github Website`. `REBUILD.md` in there is the resumable handoff note and
records the hard-won lessons; **read it before doing comparison work.**

```bash
cd "../04. Comparison Tools" && npm install
bash mirror-all.sh && bash mirror-uploads.sh     # cache live HTML *and* images
MSYS_NO_PATHCONV=1 node shots.mjs /track-record/ 1280   # side-by-side screenshots
MSYS_NO_PATHCONV=1 node rhythm.mjs /contact/ 768        # vertical-rhythm diff
MSYS_NO_PATHCONV=1 node boxes.mjs /for-companies/ 1280  # per-element box/type diff
MSYS_NO_PATHCONV=1 node pagecheck.mjs /team/            # overlaps, overflow, errors
```

In Git Bash **always** prefix with `MSYS_NO_PATHCONV=1`, or a leading `/` arg is
rewritten to `C:/Program Files/Git/...`.

### Non-negotiable lessons

1. **Look at the rendered page.** Measuring a property and declaring a match has
   produced a wrong answer repeatedly; a screenshot has caught every one.
2. **Refresh the mirror — HTML *and* images — before trusting it.** A stale cache
   hid the button shimmer; a mirror with no images hid two whole photographs.
3. **Elementor's JS does not run against the mirror.** `/team/` (Swiper) and
   `/track-record/` (loop grid) must be measured on the real site in the browser.
4. **Never infer an effect from CSS alone** — read the live element's own
   `className`/`outerHTML` in the browser.
5. **Check the breakpoint, not just the value.** Elementor's tablet range is
   768–1024; several components stay in a row at 768 and stack only at ≤767.
6. **Astro scoping:** with `scopedStyleStrategy: 'where'` a component rule and a
   global rule are both 0,1,0, and the component (injected later) wins ties.
7. **`mix-blend-mode` in the header is inert.** The header is positioned with a
   z-index, so it forms its own stacking context and anything inside it blends
   against the header's transparent box, not the page. Set header colours
   explicitly instead (see the header flags below).

## Known deliberate deviations from live

- **Typeface:** PP Neue Montreal throughout (live deviates from it in places).
  This is why long pages drift ~1–2% in height — the text wraps differently.
- `--ink-weight` in `tokens.css` is an overbold compensation, still uncalibrated.
- The 7 `/sectors/` pages and 2 `/team/<person>/` pages were empty stubs on live
  and were not ported. Since the cutover they redirect (in `astro.config.mjs`):
  sectors to `/`, profiles to `/team/`. The homepage sector cards are deliberately not links.

## Header colour flags

The header's colours are set per page through props on `Site.astro`:

| Prop | Effect | Used on |
|---|---|---|
| `headerOnDark` | header text and marks go white | `/` (hero photo) |
| `headerLightMark` | wordmark lifted to a pale off-white | `/track-record/`, `/contact/` |
| `headerDarkToggle` | mobile burger grey instead of white | `/team/` (white first band), `404` |

A new page whose first band is white needs `headerDarkToggle`, or its mobile
burger will be invisible.

## Working preferences

- Present findings and options; let Joe decide the direction (don't prescribe).
- Verify against the original, in the browser, before declaring done.
- Token budget runs out fast — work so you can stop and restart cleanly.

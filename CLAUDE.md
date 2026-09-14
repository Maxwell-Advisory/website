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
- **Live:** https://maxwell-advisory.github.io/website/ — base path `/website`.
- **Branch:** work is on `rebuild-clean`. `main` still holds the old chunk-based
  build; `rebuild-clean` replaces it wholesale.

## ⚠️ Keep the repo out of cloud sync

Proton Drive repeatedly corrupted `.git` mid-session when the repo lived inside a
syncing folder — renaming `.git/config` (wiping `origin` and `core.longpaths`),
`.git/HEAD`, `.git/index` and refs to `"<name> (# Name clash <date> <hash> #)"`.
If it recurs: restore the correct clash copy over the real filename, delete the
duplicates, re-add `origin`, and set `git config core.longpaths true`.

## Comparison tooling — lives OUTSIDE this repo

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

## Known deliberate deviations from live

- **Typeface:** PP Neue Montreal throughout (live deviates from it in places).
  This is why long pages drift ~1–2% in height — the text wraps differently.
- `--ink-weight` in `tokens.css` is an overbold compensation, still uncalibrated.
- The 7 `/sectors/` pages and 2 `/team/<person>/` pages were empty stubs on live
  and were not ported. The homepage sector cards are deliberately not links.

## Working preferences

- Present findings and options; let Joe decide the direction (don't prescribe).
- Verify against the original, in the browser, before declaring done.
- Token budget runs out fast — work so you can stop and restart cleanly.

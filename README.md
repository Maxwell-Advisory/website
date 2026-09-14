# Maxwell Advisory website

A static [Astro](https://astro.build) site, hand-authored from scratch. No
WordPress, no page builder, no database, no build-time content fetching — the
whole site is the source in `src/`.

**Live:** https://maxwell-advisory.github.io/website/

## Running it

```bash
npm install
npm run dev      # http://localhost:4321/website/
npm run build    # static output into dist/
npm run preview  # serve the built dist/
```

Astro is the only dependency.

## Layout

```
src/
  pages/        one file per route (8 routes)
  layouts/      Site.astro — the document shell, header and footer
  components/
    site/       shared: Header, Footer, PageIntro, PageTitle, Prose,
                CtaBanner, ReadMore, ScrollDarken, TypeReveal
    home/       homepage sections: Hero, IntroStatement, ServiceAccordion,
                SectorStrip, StatCounters
  data/         the editable content (see below)
  legal/        the legal-notice and privacy-policy body copy, as HTML
  styles/       tokens.css (design tokens), global.css (reset + base), fonts.css
  assets/       images and fonts, processed by Astro's build
  lib/          site.ts (nav + URL helper), images.ts (the image registry)
```

Every page is plain Astro with scoped `<style>` blocks. There is no CSS
framework and no client framework; the handful of interactive pieces (the
service accordion, the two carousels, the counters, the overlay menu) are small
inline scripts.

## Editing content

Repeating content lives in typed data files — edit the array and the page
follows.

| File | Controls |
|---|---|
| `src/data/services.ts` | homepage service accordion |
| `src/data/sectors.ts` | homepage sector strip |
| `src/data/stats.ts` | homepage "Our data" counters |
| `src/data/team.ts` | the /team carousel |
| `src/data/trackRecord.ts` | the /track-record grid and its panels |
| `src/data/forCompanies.ts` | /for-companies copy |
| `src/data/forInvestors.ts` | /for-investors copy |

One-off copy lives directly in the relevant `src/pages/*.astro`. The two legal
pages read their body from `src/legal/*.html`.

### Images

Put the file in `src/assets/images/` and refer to it **by filename** from a data
file or a page. `src/lib/images.ts` maps the name to the processed asset and
**fails the build** if it is missing, so a typo never ships as a 404. Astro
generates the responsive WebP variants.

### Design tokens

Colours, type sizes, spacing and timings are all in `src/styles/tokens.css`.
They step at breakpoints (>1360 / 1024–1360 / <1024 / ≤767) rather than scaling
fluidly, because the design they were taken from does the same. Change a value
there and it applies everywhere.

## Deployment

GitHub Actions builds and publishes to GitHub Pages on every push to `main`
(`.github/workflows/deploy.yml`). Pages "Source" is set to **GitHub Actions**.

`astro.config.mjs` sets `base: '/website'` for the project-pages URL. When the
site moves to the root domain, set `base` to `/` and `site` to the real domain —
or override them at build time with `BASE_PATH` and `SITE_URL`.

## Windows note

This repo needs `git config core.longpaths true`, and it must **not** live
inside a live cloud-sync folder — Proton Drive corrupted `.git` repeatedly when
it did.

# Maxwell Advisory website

A static [Astro](https://astro.build) site, hand-authored from scratch. No
WordPress, no page builder, no database, no build-time content fetching — the
whole site is the source in `src/`.

**Live:** https://maxwelladvisory.eu/

## Running it

```bash
npm install
npm run dev      # http://localhost:4321/
npm run build    # static output into dist/
npm run preview  # serve the built dist/
```

Astro is the only dependency (its bundled image library, sharp, also generates
the icons and share image).

## Layout

```
src/
  pages/        one file per page (7 pages plus 404.astro; two legacy
                redirects are set in astro.config.mjs)
  layouts/      Site.astro — the document shell, header and footer
  components/
    site/       shared: Header, Footer, PageIntro, PageTitle, Prose,
                CtaBanner, ReadMore, ScrollDarken
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
| `src/data/ourServices.ts` | /our-services copy (the old /for-companies and /for-investors paths redirect here) |

One-off copy lives directly in the relevant `src/pages/*.astro`. The two legal
pages read their body from `src/legal/*.html`.

### Images

Put the file in `src/assets/images/` and refer to it **by filename** from a data
file or a page. `src/lib/images.ts` maps the name to the processed asset and
**fails the build** if it is missing, so a typo never ships as a 404. Astro
generates the responsive WebP variants.

### Search and sharing

- **Page titles and descriptions:** each page passes `title` to `Site.astro`,
  and the document title becomes "Title | Maxwell Advisory" (the homepage sets
  its full title with `documentTitle`). Meta descriptions are listed by path in
  `pageDescriptions` in `src/lib/site.ts`; keep each under about 155
  characters.
- **Organisation details** (address, email, logo, official profiles) live in
  `siteMeta` in `src/lib/site.ts` and feed the homepage structured data
  (`src/components/site/OrganisationSchema.astro`). Official profiles, such as
  the LinkedIn company page, are listed in `sameAs` there.
- **Sitemap:** `src/pages/sitemap.xml.ts` builds `/sitemap.xml` from the page
  files, so new pages are included automatically. It is referenced from
  `public/robots.txt`.
- **Icons and share image** are generated at build time from the logo and hero
  photo in `src/assets/images/` (`src/lib/brandImages.ts`, served by the
  matching endpoints in `src/pages/`): `favicon.ico`, `favicon-32.png`,
  `apple-touch-icon.png`, `logo.png` (structured data) and `og-image.jpg`
  (1200x630, used for link previews on LinkedIn and elsewhere). Change the
  source assets and they update on the next build.
- **404:** `src/pages/404.astro` builds `404.html`, which GitHub Pages serves
  for any missing path. It is marked `noindex`.

### Header colours

Per-page header colours (white over the hero photo, a pale wordmark on dark
bands, a grey mobile burger on white bands) are set with props on `Site.astro`.
`CLAUDE.md` lists them and which pages use each.

### Design tokens

Colours, type sizes, spacing and timings are all in `src/styles/tokens.css`.
They step at breakpoints (>1360 / 1024–1360 / <1024 / ≤767) rather than scaling
fluidly, because the design they were taken from does the same. Change a value
there and it applies everywhere.

## Deployment

GitHub Actions builds and publishes to GitHub Pages on every push to `main`
(`.github/workflows/deploy.yml`). Pages "Source" is set to **GitHub Actions**.

The custom domain `maxwelladvisory.eu` is set in the repo's Pages settings and
verified at organisation level (keep the `_github-pages-challenge-Maxwell-Advisory`
TXT record in DNS). DNS is managed in the o2switch cPanel Zone Editor: four apex
`A` records to GitHub Pages and `www` as a `CNAME` to `maxwell-advisory.github.io`.

`astro.config.mjs` sets `base: '/'` and `site: 'https://maxwelladvisory.eu'`.
To build for a sub-path instead, override them at build time with `BASE_PATH`
and `SITE_URL`.

## Windows note

This repo needs `git config core.longpaths true`, and it must **not** live
inside a live cloud-sync folder — Proton Drive corrupted `.git` repeatedly when
it did.

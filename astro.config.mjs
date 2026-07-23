import { defineConfig } from 'astro/config';

// For the GitHub Pages TEST deploy, the site lives at:
//   https://<user>.github.io/<repo>/
// Set `base` to "/<repo>". When you later move to maxwelladvisory.eu
// (a root domain), change `base` to "/" and `site` to the real domain.
export default defineConfig({
  site: process.env.SITE_URL || 'https://maxwell-advisory.github.io',
  base: process.env.BASE_PATH || '/website',
  trailingSlash: 'always',
  build: { format: 'directory' },
  // The ported pages already contain full, hand-written <head> markup,
  // so let Astro pass it through untouched.
  scopedStyleStrategy: 'where',
});

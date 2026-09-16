import { defineConfig } from 'astro/config';

const base = process.env.BASE_PATH || '/website';
/** Astro prepends `base` to a redirect's SOURCE but not to its DESTINATION,
 *  so the target has to carry it or the redirect lands on a 404. */
const to = (path) => `${base.replace(/\/$/, '')}${path}`;

// On GitHub Pages the site lives at https://<user>.github.io/<repo>/, so `base`
// is "/<repo>". When it moves to maxwelladvisory.eu (a root domain), set `base`
// to "/" and `site` to the real domain — or override both at build time with
// the BASE_PATH and SITE_URL environment variables.
export default defineConfig({
  site: process.env.SITE_URL || 'https://maxwell-advisory.github.io',
  base,
  trailingSlash: 'always',
  build: { format: 'directory' },
  // Scope component styles with :where(), so a component rule and a global rule
  // both weigh 0,1,0 and the component (injected later) wins ties. Keeps
  // tokens.css and global.css overridable from a component without !important.
  scopedStyleStrategy: 'where',

  // The live WordPress site served /for-companies/ and /for-investors/, and
  // both carry inbound links and search ranking. The pages are now one page at
  // /our-services/, so keep the old paths alive rather than 404ing them.
  // On a static build Astro emits a small meta-refresh page at each path.
  redirects: {
    '/for-companies/': to('/our-services/'),
    '/for-investors/': to('/our-services/'),
  },
});

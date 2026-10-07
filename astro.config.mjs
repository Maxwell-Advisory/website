import { defineConfig } from 'astro/config';

const base = process.env.BASE_PATH || '/';
/** Astro prepends `base` to a redirect's SOURCE but not to its DESTINATION,
 *  so the target has to carry it or the redirect lands on a 404. */
const to = (path) => `${base.replace(/\/$/, '')}${path}`;

// The site is served from the root of maxwelladvisory.eu (GitHub Pages with a
// custom domain), so `base` is "/". To build for a sub-path instead (e.g. the
// project-pages URL https://<org>.github.io/<repo>/), override both at build
// time with the BASE_PATH and SITE_URL environment variables.
export default defineConfig({
  site: process.env.SITE_URL || 'https://maxwelladvisory.eu',
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
  //
  // The other old WordPress pages were thin stubs that were not ported. They
  // were indexable, so send them to the nearest page that now covers them: the
  // sector pages to the homepage (which carries the sector strip), the
  // individual profiles to /team/, and WordPress's duplicate /homepage/ to /.
  redirects: {
    '/for-companies/': to('/our-services/'),
    '/for-investors/': to('/our-services/'),
    '/homepage/': to('/'),
    '/sectors/circular-economy/': to('/'),
    '/sectors/clean-transport/': to('/'),
    '/sectors/green-gases/': to('/'),
    '/sectors/grids/': to('/'),
    '/sectors/industrial-decarbonisation/': to('/'),
    '/sectors/renewables/': to('/'),
    '/sectors/storage/': to('/'),
    '/team/adrien-dormesson/': to('/team/'),
    '/team/joe-davis/': to('/team/'),
  },
});

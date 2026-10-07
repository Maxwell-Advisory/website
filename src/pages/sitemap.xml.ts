import type { APIRoute } from 'astro';

// /sitemap.xml, built from the page files in this folder, so a new page is
// listed automatically. The 404 page and the legacy redirects (set in
// astro.config.mjs, with no page file) are not included.
const pages = Object.keys(import.meta.glob('./**/*.astro'))
  .map((file) => file.replace(/^\.\//, '').replace(/\.astro$/, ''))
  .filter((name) => name !== '404' && !name.split('/').some((part) => part.startsWith('_')))
  .map((name) => (name === 'index' ? '' : `${name.replace(/\/index$/, '')}/`))
  .sort();

export const GET: APIRoute = ({ site }) => {
  const base = new URL(import.meta.env.BASE_URL, site);
  const urls = pages.map((path) => `  <url><loc>${new URL(path, base).href}</loc></url>`).join('\n');
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml' } });
};

/** Compare the box of every text-bearing element, matched by text, live vs mine.
 *  MSYS_NO_PATHCONV=1 node tools/boxes.mjs /for-companies/ [width]
 *  Reports width / x / font-size / line-height differences. */
import { chromium } from 'playwright';
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const HERE = dirname(fileURLToPath(import.meta.url));
const CACHE = join(HERE, 'live-cache'), PAGES = join(CACHE, 'pages'), PUBLIC = join(HERE, '..', 'public');
const path = process.argv[2] || '/', width = Number(process.argv[3] || 1280);
const slug = path.replace(/^\/|\/$/g, '').replace(/\//g, '__') || 'index';
function collect() {
  const seen = new Map();
  for (const el of document.querySelectorAll('h1,h2,h3,h4,p,li,a,div,span')) {
    if (!el.getClientRects().length) continue;
    if (el.closest('footer,.site-footer,header,.site-header,.elementor-location-header,.elementor-location-footer,[data-elementor-type="header"],[data-elementor-type="footer"],[data-elementor-type="popup"],#catapult-cookie-bar')) continue;
    const txt = (el.textContent || '').replace(/\s+/g, ' ').trim();
    if (txt.length < 10) continue;
    if ([...el.children].some((c) => (c.textContent || '').replace(/\s+/g,' ').trim() === txt)) continue;
    const k = txt.slice(0, 50);
    if (seen.has(k)) continue;
    const r = el.getBoundingClientRect(), cs = getComputedStyle(el);
    seen.set(k, { k, w: Math.round(r.width), x: Math.round(r.left), h: Math.round(r.height), fs: cs.fontSize, lh: cs.lineHeight, ta: cs.textAlign, c: cs.color });
  }
  return [...seen.values()];
}
const b = await chromium.launch();
const load = async (isLive) => {
  const ctx = await b.newContext({ viewport: { width, height: 900 } }); const p = await ctx.newPage();
  if (isLive) {
    const html = readFileSync(join(PAGES, `${slug}.html`), 'utf8');
    await p.route('**/*', async (route) => {
      const u = route.request().url();
      if (/^https:\/\/(?:www\.)?maxwelladvisory\.eu\/?$/.test(u) || u.endsWith(path)) return route.fulfill({ status: 200, contentType: 'text/html; charset=utf-8', body: html });
      const m = u.match(/^https:\/\/(?:www\.)?maxwelladvisory\.eu\/(.+?)(?:\?|$)/);
      if (m) for (const base of [CACHE, PUBLIC]) { const f = join(base, decodeURIComponent(m[1])); if (existsSync(f)) return route.fulfill({ path: f }); }
      return route.abort();
    });
    await p.goto('https://maxwelladvisory.eu' + path, { waitUntil: 'load', timeout: 60000 }).catch(() => {});
  } else await p.goto('http://localhost:4321/website' + path, { waitUntil: 'load', timeout: 60000 });
  await p.waitForTimeout(1800);
  const d = await p.evaluate(collect); await ctx.close(); return d;
};
const L = await load(true), M = await load(false); await b.close();
const mm = new Map(M.map((d) => [d.k, d]));
console.log(`\n${path} @${width}`);
let bad = 0;
for (const l of L) {
  const m = mm.get(l.k); if (!m) continue;
  const diffs = [];
  if (Math.abs(l.w - m.w) > 8) diffs.push(`w ${l.w}->${m.w}`);
  if (Math.abs(l.x - m.x) > 8) diffs.push(`x ${l.x}->${m.x}`);
  if (l.fs !== m.fs) diffs.push(`fs ${l.fs}->${m.fs}`);
  if (l.lh !== m.lh) diffs.push(`lh ${l.lh}->${m.lh}`);
  if (l.ta !== m.ta) diffs.push(`align ${l.ta}->${m.ta}`);
  if (l.c !== m.c) diffs.push(`color ${l.c}->${m.c}`);
  if (diffs.length) { bad++; console.log(`  ${l.k.slice(0,44).padEnd(46)} ${diffs.join('  ')}`); }
}
console.log(bad ? `  ${bad} box/type difference(s)` : '  boxes match');

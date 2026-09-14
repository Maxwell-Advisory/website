/**
 * Text-anchored vertical-rhythm comparison, live vs rebuild, for ANY page.
 *
 *   MSYS_NO_PATHCONV=1 node tools/rhythm.mjs /for-companies/ [width]
 *
 * The two sites have completely different DOM structures, so landmarks are
 * located by their TEXT rather than by selector. For each anchor we record the
 * element's document-relative top, then compare the GAP between consecutive
 * anchors. Absolute offsets differ (headers differ in height), gaps do not.
 *
 * Live is served from tools/live-cache (see tools/mirror-all.sh) because this
 * sandbox aborts headless subresource requests to the live domain.
 *
 * ⚠️ LIMITATION: Elementor's JS does not run against the mirror, so on pages
 * with JS-built layout the mirrored "live" geometry is WRONG:
 *   /team/          - the Swiper carousel never initialises, so every slide
 *                     renders stacked at full width
 *   /track-record/  - the off-canvas content stays inline, inflating each card
 *                     from ~436px to ~1064px
 * Those two pages must be measured against the REAL site in the Browser pane.
 * Pages without JS layout (for-companies, for-investors, contact, legal) are
 * reliable here.
 */
import { chromium } from 'playwright';
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const CACHE = join(HERE, 'live-cache');
const PAGES = join(CACHE, 'pages');
const PUBLIC = join(HERE, '..', 'public');
const MINE = 'http://localhost:4321/website';

const path = process.argv[2] || '/';
const width = Number(process.argv[3] || 1280);
const slug = path.replace(/^\/|\/$/g, '').replace(/\//g, '__') || 'index';
const TOL = 12; // px — below this a gap difference is not worth chasing

if (!existsSync(join(PAGES, `${slug}.html`))) {
  console.error(`No mirror for "${slug}". Run: bash tools/mirror-all.sh`);
  process.exit(1);
}

/** Collect every visible text block with its document position. */
function collect() {
  const seen = new Set();
  const out = [];
  const walk = document.querySelectorAll('h1,h2,h3,h4,p,li,span,a,button,img');
  for (const el of walk) {
    if (!el.getClientRects().length) continue;
    // page content only — header, footer and the menu popup differ structurally
    // and would pair the wrong things together
    if (el.closest('footer, .site-footer, header, .site-header, nav, .site-menu, .elementor-location-header, .elementor-location-footer, .e-off-canvas, .tr-panel, [data-elementor-type="header"], [data-elementor-type="footer"], [data-elementor-type="popup"]')) continue;
    const cs = getComputedStyle(el);
    if (cs.visibility === 'hidden' || cs.opacity === '0') continue;
    // leaf-ish text only, so we do not record a wrapper and its child twice
    const txt = (el.textContent || '').replace(/\s+/g, ' ').trim();
    if (el.tagName !== 'IMG') {
      if (!txt || txt.length < 6) continue;
      if ([...el.children].some((c) => (c.textContent || '').trim() === txt)) continue;
    }
    const key = el.tagName === 'IMG' ? 'IMG:' + (el.currentSrc || el.src).split('/').pop() : txt.slice(0, 60);
    if (seen.has(key)) continue;
    seen.add(key);
    const r = el.getBoundingClientRect();
    out.push({ key, top: Math.round(r.top + window.scrollY), bottom: Math.round(r.bottom + window.scrollY), h: Math.round(r.height) });
  }
  return out.sort((a, b) => a.top - b.top);
}

const browser = await chromium.launch();

const load = async (isLive) => {
  const ctx = await browser.newContext({ viewport: { width, height: 900 } });
  const page = await ctx.newPage();
  if (isLive) {
    const html = readFileSync(join(PAGES, `${slug}.html`), 'utf8');
    await page.route('**/*', async (route) => {
      const u = route.request().url();
      if (/^https:\/\/(?:www\.)?maxwelladvisory\.eu\/?$/.test(u) || u.endsWith(path)) {
        return route.fulfill({ status: 200, contentType: 'text/html; charset=utf-8', body: html });
      }
      const m = u.match(/^https:\/\/(?:www\.)?maxwelladvisory\.eu\/(.+?)(?:\?|$)/);
      if (m) {
        for (const base of [CACHE, PUBLIC]) {
          const f = join(base, decodeURIComponent(m[1]));
          if (existsSync(f)) return route.fulfill({ path: f });
        }
      }
      return route.abort();
    });
    await page.goto('https://maxwelladvisory.eu' + path, { waitUntil: 'load', timeout: 60000 }).catch(() => {});
  } else {
    await page.goto(MINE + path, { waitUntil: 'load', timeout: 60000 });
  }
  await page.waitForTimeout(1500);
  const data = await page.evaluate(collect);
  const docH = await page.evaluate(() => Math.round(document.documentElement.scrollHeight));
  await ctx.close();
  return { data, docH };
};

const live = await load(true);
const mine = await load(false);
await browser.close();

// pair anchors that appear on both sides, in document order
const mineByKey = new Map(mine.data.map((d) => [d.key, d]));
const paired = live.data.filter((d) => mineByKey.has(d.key)).map((d) => ({ key: d.key, live: d, mine: mineByKey.get(d.key) }));

console.log(`\n${path}  @${width}px`);
console.log(`  doc height: live ${live.docH}  mine ${mine.docH}  (${mine.docH - live.docH >= 0 ? '+' : ''}${mine.docH - live.docH})`);
console.log(`  matched ${paired.length} of ${live.data.length} live anchors\n`);

let bad = 0;
for (let i = 1; i < paired.length; i++) {
  const a = paired[i - 1], b = paired[i];
  const lg = b.live.top - a.live.bottom;
  const mg = b.mine.top - a.mine.bottom;
  const d = mg - lg;
  if (Math.abs(d) <= TOL) continue;
  bad++;
  console.log(`  ${d > 0 ? '+' : ''}${d}px   ${a.key.slice(0, 34)} -> ${b.key.slice(0, 34)}`);
  console.log(`          live ${lg}px | mine ${mg}px`);
}
console.log(bad ? `\n  ${bad} gap(s) off by more than ${TOL}px` : `\n  rhythm matches (within ${TOL}px)`);

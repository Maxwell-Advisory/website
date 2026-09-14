/**
 * Full-page screenshots of live (from tools/live-cache) and the rebuild, side
 * by side, for eyeballing.
 *
 *   MSYS_NO_PATHCONV=1 node tools/shots.mjs /track-record/ 1280 [outdir]
 *
 * Writes <outdir>/<slug>-<width>-live.png and -mine.png.
 *
 * Run tools/mirror-all.sh AND tools/mirror-uploads.sh first, or live renders
 * without its images.
 *
 * ⚠️ Elementor's JS does not run against the mirror, so /team/ (Swiper) and
 * /track-record/ (off-canvas) render wrong on the live side — screenshot those
 * against the real site in the Browser pane instead.
 */
import { chromium } from 'playwright';
import { readFileSync, existsSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const CACHE = join(HERE, 'live-cache');
const PAGES = join(CACHE, 'pages');
const PUBLIC = join(HERE, '..', 'public');
const MINE = 'http://localhost:4321/website';

const path = process.argv[2] || '/';
const width = Number(process.argv[3] || 1280);
const OUT = process.argv[4] || join(HERE, '..', '.shots');
const slug = path.replace(/^\/|\/$/g, '').replace(/\//g, '__') || 'index';
mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();

const shoot = async (isLive) => {
  const ctx = await browser.newContext({ viewport: { width, height: 900 }, deviceScaleFactor: 1 });
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
    // the cookie bar overlays the footer on every live page
    await page.addStyleTag({ content: '#catapult-cookie-bar,.cli-bar-container,#cookie-law-info-bar{display:none!important}' }).catch(() => {});
  } else {
    await page.goto(MINE + path, { waitUntil: 'load', timeout: 60000 });
  }
  // settle: let scroll-driven and typing effects finish, and lazy images load
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 60)); }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(2500);
  const file = join(OUT, `${slug}-${width}-${isLive ? 'live' : 'mine'}.png`);
  await page.screenshot({ path: file, fullPage: true });
  const h = await page.evaluate(() => Math.round(document.documentElement.scrollHeight));
  await ctx.close();
  return { file, h };
};

const live = existsSync(join(PAGES, `${slug}.html`)) ? await shoot(true) : null;
const mine = await shoot(false);
await browser.close();
console.log(`${path} @${width}  live ${live ? live.h : '-'}px  mine ${mine.h}px  (${live ? (mine.h - live.h >= 0 ? '+' : '') + (mine.h - live.h) : '?'})`);
if (live) console.log('  ' + live.file);
console.log('  ' + mine.file);

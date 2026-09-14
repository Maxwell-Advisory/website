/**
 * Live-vs-rebuild comparison harness.
 *
 * Why this exists: eyeballing screenshots and probing the in-app browser proved
 * error-prone — that pane silently rewrites the viewport (asking for 1920 can
 * render 966) and won't composite pages that use a fixed background. Playwright
 * gives exact viewports and honest screenshots, so this script can compare the
 * two sites at every breakpoint and report ONLY the mismatches.
 *
 * It checks three things:
 *   1. TYPOGRAPHY  — font family/size/weight/leading/tracking/colour/transform
 *   2. BOXES       — each landmark's width and height
 *   3. RELATIONSHIPS — the vertical gap between consecutive landmarks, so the
 *      rhythm between components is compared, not just the components. Absolute
 *      page offsets are not comparable (total page heights differ), but the gap
 *      between one element's bottom and the next element's top is.
 *
 * Usage:
 *   npm run compare               # all viewports
 *   npm run compare -- 1280       # a single viewport
 *   npm run compare -- --shots    # also write full-page screenshots
 *
 * IMPORTANT: restart the Astro dev server before running — stale scoped CSS
 * silently masks fixes and produces phantom mismatches.
 */
import { chromium } from 'playwright';
import { mkdirSync, writeFileSync, readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, '..');
const CACHE = join(HERE, 'live-cache');
const PUBLIC = join(ROOT, 'public');
const LIVE = 'https://maxwelladvisory.eu/';
const MINE = 'http://localhost:4321/website/';

const args = process.argv.slice(2);
const WANT_SHOTS = args.includes('--shots');
const ONLY = args.find((a) => /^\d+$/.test(a));
const VIEWPORTS = ONLY ? [Number(ONLY)] : [375, 768, 1024, 1280, 1440, 1920];

/* This sandbox aborts headless subresource requests to the live domain, so the
   live page would render unstyled (Times New Roman, blue links) and every
   comparison would be meaningless. We therefore serve the live page from a local
   mirror: tools/live-cache (HTML + its 22 stylesheets, fetched with curl) plus
   ./public for images and fonts, which are byte-identical assets.
   Refresh with:  npm run compare:refresh                                     */
async function serveLiveFromMirror(page) {
  const html = readFileSync(join(CACHE, 'live.html'), 'utf8');
  await page.route('**/*', async (route) => {
    const url = route.request().url();
    if (url.startsWith('http://localhost')) return route.continue();
    if (/^https:\/\/(?:www\.)?maxwelladvisory\.eu\/?$/.test(url)) {
      return route.fulfill({ status: 200, contentType: 'text/html; charset=utf-8', body: html });
    }
    const m = url.match(/^https:\/\/(?:www\.)?maxwelladvisory\.eu\/(.+?)(?:\?|$)/);
    if (m) {
      const rel = decodeURIComponent(m[1]);
      for (const base of [CACHE, PUBLIC]) {
        const f = join(base, rel);
        if (existsSync(f)) return route.fulfill({ path: f });
      }
    }
    return route.abort(); // third-party JS/analytics: not needed for layout
  });
}

/**
 * Landmarks, in page order. `kind: 'text'` compares typography + box;
 * `'box'` compares geometry only. `live`/`mine` accept a selector or an array
 * of candidates tried in order. `liveText` + `liveTag` does a text match when
 * no stable class exists. Elementor element ids came from the live stylesheet.
 */
const LANDMARKS = [
  // --- header ---
  { name: 'logo',             kind: 'box',  live: '.logo-hover img',                                      mine: '.site-header__logo img' },
  /* menu icon deliberately omitted: it spins continuously on both sites, so its
     bounding box oscillates (~40-56px) and would report phantom diffs. Its size
     is pinned by --acc-icon/40px tokens and verified from the live stylesheet. */
  // --- hero ---
  { name: 'hero section',     kind: 'box',  live: '.elementor-element-161c30d',                           mine: '.hero' },
  { name: 'hero h1',          kind: 'text', live: '.elementor-element-e0a070a .elementor-heading-title',  mine: '.hero__title' },
  { name: 'hero tagline',     kind: 'text', liveText: 'Advisors for the energy transition', liveTag: 'p', mine: '.hero__tagline' },
  { name: 'hero btn',         kind: 'text', live: '.elementor-element-161c30d .elementor-button',        mine: '.hero__btn--ghost' },
  // --- intro band ---
  { name: 'intro band',       kind: 'box',  live: '.elementor-element-9c27dfc',                           mine: '.intro' },
  { name: 'intro text',       kind: 'text', live: '.elementor-element-5641104',                           mine: '.intro__text' },
  // --- services / accordion ---
  // live's 710ed7f section also wraps the sectors strip, so it is not
  // like-for-like with our .services — rhythm anchor only
  { name: 'services section', kind: 'anchor', live: '.elementor-element-710ed7f',                          mine: '.services' },
  { name: 'eyebrow services', kind: 'text', live: '.elementor-element-a2abcda p',                         mine: '.services__eyebrow' },
  { name: 'acc row',          kind: 'box',  live: '.e-n-accordion-item-title',                            mine: '.service__summary' },
  { name: 'acc title',        kind: 'text', live: '.e-n-accordion-item-title-text',                       mine: '.service__title' },
  // ids for accordion CARD 1 (bdfdb59/c1775e2 belong to card 3)
  { name: 'acc body p',       kind: 'text', live: '.elementor-element-6501fe3 p',                          mine: '.service__text p' },
  { name: 'acc image',        kind: 'box',  live: '.elementor-element-e95dfba img',                        mine: '.service__image' },
  // --- sectors ---
  { name: 'eyebrow sectors',  kind: 'text', live: '.elementor-element-afd902e p',                          mine: '.sectors__eyebrow' },
  { name: 'sector card',      kind: 'box',  live: '.elementor-element-2c3b4c1',                            mine: '.sector-card' },
  { name: 'sector title',     kind: 'text', live: '.elementor-element-727bde1 .elementor-heading-title',   mine: '.sector-card__title' },
  { name: 'progress bar',     kind: 'box',  live: '.swiper-pagination',                                    mine: '.sectors__progress' },
  // --- stats ---
  { name: 'eyebrow stats',    kind: 'text', live: '.elementor-element-1115ef1 p',                          mine: '.stats .eyebrow' },
  // 86a0f45 is the SECOND counter ("successful transactions") - match ours
  { name: 'counter number',   kind: 'text', live: '.elementor-element-86a0f45 .elementor-counter-number',   mine: '.stat:nth-child(2) .stat__number' },
  { name: 'counter label',    kind: 'text', live: '.elementor-element-86a0f45 .elementor-counter-title',    mine: '.stat:nth-child(2) .stat__label' },
  // --- footer ---
  // the live 342d9d1 container spans the whole footer (incl. wordmark), so for a
  // like-for-like box/rhythm comparison use the menu list itself
  // live splits the footer menu into four separate icon-list widgets (~161px
  // each) where we use one 4-column grid — same look, different boxes, so this
  // is a rhythm anchor only
  { name: 'footer nav',       kind: 'anchor', live: '.elementor-icon-list-items',                          mine: '.site-footer__nav ul' },
  // live's footer menu is an icon-list widget, not a nav-menu
  { name: 'footer link',      kind: 'text', live: ['.elementor-element-342d9d1 .elementor-icon-list-text',
                                                   '.elementor-icon-list-item a'],                          mine: '.site-footer__nav a' },
  { name: 'wordmark img',     kind: 'box',  live: '.elementor-element-b73e63e img',                         mine: '.site-footer__word' },
];

/**
 * Relationships: the vertical gap between one landmark's bottom and the next
 * one's top. This is what makes the *rhythm* comparable, not just the parts.
 */
const RELATIONS = [
  ['hero section',     'intro band'],
  ['intro band',       'services section'],
  ['intro band',       'eyebrow services'],
  ['eyebrow services', 'acc row'],
  ['acc row',          'acc body p'],
  ['acc body p',       'acc image'],
  ['eyebrow sectors',  'sector card'],
  ['sector card',      'progress bar'],
  ['progress bar',     'eyebrow stats'],
  ['eyebrow stats',    'counter number'],
  ['counter number',   'counter label'],
  ['counter label',    'footer nav'],
  ['footer nav',       'wordmark img'],
];

const TEXT_PROPS = [
  'fontFamily', 'fontSize', 'fontWeight', 'lineHeight', 'letterSpacing',
  'color', 'textTransform', 'fontStyle', 'textAlign',
];
const BOX_TOL = 2;   // px
const GAP_TOL = 4;   // px — rhythm is coarser than box metrics

/** Runs in the page: collect metrics for each landmark. */
function collect(landmarks) {
  const vis = (el) => el && el.getClientRects().length > 0 &&
    getComputedStyle(el).visibility !== 'hidden';

  const pick = (lm) => {
    for (const sel of (lm.sels || [])) {
      for (const el of document.querySelectorAll(sel)) if (vis(el)) return el;
    }
    if (lm.text) {
      const tags = lm.tag ? [lm.tag] : ['p', 'span', 'div', 'a', 'h1', 'h2', 'h3'];
      let best = null;
      for (const el of document.querySelectorAll(tags.join(','))) {
        if (!vis(el)) continue;
        const t = (el.textContent || '').replace(/\s+/g, ' ').trim();
        if (t.startsWith(lm.text) && t.length < lm.text.length + 40) {
          if (!best || el.getBoundingClientRect().width < best.getBoundingClientRect().width) best = el;
        }
      }
      return best;
    }
    return null;
  };

  const out = {};
  for (const lm of landmarks) {
    const el = pick(lm);
    if (!el) { out[lm.name] = null; continue; }
    const r = el.getBoundingClientRect();
    const c = getComputedStyle(el);
    const rec = {
      w: Math.round(r.width), h: Math.round(r.height),
      left: Math.round(r.left),
      rightGap: Math.round(document.documentElement.clientWidth - r.right),
      docTop: Math.round(r.top + window.scrollY),
      docBottom: Math.round(r.bottom + window.scrollY),
    };
    for (const p of ['fontFamily','fontSize','fontWeight','lineHeight','letterSpacing',
                     'color','textTransform','fontStyle','textAlign']) rec[p] = c[p];
    out[lm.name] = rec;
  }
  return out;
}

/** Page-level sanity for our own build: section overlap + horizontal overflow. */
function healthCheck() {
  const sels = ['.hero', '.intro', '.services', '.sectors', '.stats', '.site-footer'];
  const b = sels.map((s) => {
    const el = document.querySelector(s);
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return { s, t: Math.round(r.top + window.scrollY), b: Math.round(r.bottom + window.scrollY) };
  }).filter(Boolean);
  const overlaps = [];
  for (let i = 1; i < b.length; i++) {
    if (b[i].t < b[i - 1].b - 1) overlaps.push(`${b[i].s} overlaps ${b[i - 1].s} by ${b[i - 1].b - b[i].t}px`);
  }
  return {
    overlaps,
    hOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 2,
    scrollW: document.documentElement.scrollWidth,
    clientW: document.documentElement.clientWidth,
  };
}

const norm = (v) => String(v ?? '').replace(/"/g, '').replace(/\s+/g, ' ')
  .replace(/^normal$/, '0px').trim();

const run = async () => {
  const browser = await chromium.launch();
  if (WANT_SHOTS) mkdirSync(join(HERE, 'shots'), { recursive: true });
  const report = [];

  for (const width of VIEWPORTS) {
    const height = width < 500 ? 812 : 900;
    const results = {};

    for (const [label, url] of [['live', LIVE], ['mine', MINE]]) {
      const ctx = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 1 });
      const page = await ctx.newPage();
      if (label === 'live') await serveLiveFromMirror(page);
      try {
        await page.goto(url, { waitUntil: 'load', timeout: 60000 });
      } catch {
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 }).catch(() => {});
      }
      // Open every accordion item and force lazy images to load, BEFORE settling,
      // so bodies/images are measurable and transitions have finished.
      await page.evaluate(() => {
        // Open ONLY the first item: our accordion is exclusive (name="service"),
        // so opening all would leave just the last one open and the two sides
        // would be in different states.
        // NB: live has an unrelated bare <details> earlier in the document, so
        // query the accordion classes explicitly and in order.
        const acc = document.querySelector('details.e-n-accordion-item')
          || document.querySelector('details.service');
        if (acc) acc.open = true;
        document.querySelectorAll('img[loading="lazy"]').forEach((i) => { i.loading = 'eager'; });
      });
      await page.waitForTimeout(1800);
      const lms = LANDMARKS.map((l) => {
        const raw = label === 'live' ? l.live : l.mine;
        return {
          name: l.name,
          sels: raw ? (Array.isArray(raw) ? raw : [raw]) : [],
          text: label === 'live' ? l.liveText : undefined,
          tag: label === 'live' ? l.liveTag : undefined,
        };
      });
      results[label] = await page.evaluate(collect, lms);
      if (label === 'mine') results.health = await page.evaluate(healthCheck);
      if (WANT_SHOTS) {
        await page.screenshot({ path: join(HERE, 'shots', `${label}-${width}.png`), fullPage: true });
      }
      await ctx.close();
    }

    // ---- diff: typography + boxes -----------------------------------------
    const rows = [];
    for (const lm of LANDMARKS) {
      const a = results.live[lm.name], b = results.mine[lm.name];
      if (!a || !b) { rows.push({ name: lm.name, issue: !a ? 'not found on LIVE' : 'not found on MINE' }); continue; }
      if (lm.kind === 'anchor') continue;   // used for rhythm only
      const bad = [];
      if (lm.kind === 'text') {
        for (const p of TEXT_PROPS) {
          // compare only the primary font family — our stack lists more fallbacks
          const A = p === 'fontFamily' ? norm(a[p]).split(',')[0] : norm(a[p]);
          const B = p === 'fontFamily' ? norm(b[p]).split(',')[0] : norm(b[p]);
          if (A !== B) bad.push(`${p}: live=${A} mine=${B}`);
        }
      }
      for (const p of ['w', 'h']) {
        if (Math.abs(a[p] - b[p]) > BOX_TOL) bad.push(`${p}: live=${a[p]} mine=${b[p]}`);
      }
      if (bad.length) rows.push({ name: lm.name, diffs: bad });
    }

    // ---- diff: relationships (vertical rhythm) -----------------------------
    const gaps = [];
    for (const [from, to] of RELATIONS) {
      const a1 = results.live[from], a2 = results.live[to];
      const b1 = results.mine[from], b2 = results.mine[to];
      if (!a1 || !a2 || !b1 || !b2) { gaps.push({ pair: `${from} -> ${to}`, issue: 'landmark missing' }); continue; }
      const liveGap = a2.docTop - a1.docBottom;
      const mineGap = b2.docTop - b1.docBottom;
      if (Math.abs(liveGap - mineGap) > GAP_TOL) {
        gaps.push({ pair: `${from} -> ${to}`, liveGap, mineGap, delta: mineGap - liveGap });
      }
    }

    report.push({ width, rows, gaps, health: results.health });

    console.log(`\n${'='.repeat(74)}\nVIEWPORT ${width}px\n${'='.repeat(74)}`);
    if (results.health.overlaps.length) console.log('  ! OVERLAPS:', results.health.overlaps.join('; '));
    if (results.health.hOverflow) console.log(`  ! H-OVERFLOW: scrollW=${results.health.scrollW} clientW=${results.health.clientW}`);
    if (!rows.length) console.log('  BOXES/TYPE: all landmarks match');
    else for (const r of rows) {
      if (r.issue) { console.log(`  [${r.name}] ${r.issue}`); continue; }
      console.log(`  [${r.name}]`);
      for (const d of r.diffs) console.log(`      ${d}`);
    }
    if (!gaps.length) console.log('  RHYTHM: all gaps match');
    else for (const g of gaps) {
      if (g.issue) console.log(`  GAP ${g.pair}: ${g.issue}`);
      else console.log(`  GAP ${g.pair}: live=${g.liveGap} mine=${g.mineGap} (${g.delta > 0 ? '+' : ''}${g.delta})`);
    }
  }

  writeFileSync(join(HERE, 'compare-report.json'), JSON.stringify(report, null, 2));
  const boxes = report.reduce((n, r) => n + r.rows.length, 0);
  const rhythm = report.reduce((n, r) => n + r.gaps.length, 0);
  console.log(`\n${'-'.repeat(74)}`);
  console.log(`TOTALS across ${VIEWPORTS.length} viewport(s): ${boxes} box/type mismatches, ${rhythm} rhythm mismatches`);
  console.log(`Report: tools/compare-report.json${WANT_SHOTS ? '\nScreenshots: tools/shots/' : ''}`);
  await browser.close();
};

run().catch((e) => { console.error(e); process.exit(1); });

/**
 * Generic per-page health check for the rebuild.
 *   node tools/pagecheck.mjs /sectors/renewables/ /team/joe-davis/ ...
 * Reports, per viewport: header mode, section overlaps, horizontal overflow,
 * console errors, and the page's own title/h1 — everything needed to call a
 * page "done" per tools/REBUILD.md.
 */
import { chromium } from 'playwright';
const BASE = 'http://localhost:4321/website';
const paths = process.argv.slice(2).filter(a => !a.startsWith('-'));
const VIEWPORTS = [375, 768, 1280];
const b = await chromium.launch();
let bad = 0;
for (const path of paths) {
  console.log(`\n${'='.repeat(64)}\n${path}`);
  for (const w of VIEWPORTS) {
    const ctx = await b.newContext({ viewport: { width: w, height: 900 } });
    const p = await ctx.newPage();
    const errs = [];
    p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
    p.on('pageerror', e => errs.push('pageerror: ' + e.message));
    const resp = await p.goto(BASE + path, { waitUntil: 'load', timeout: 60000 });
    await p.waitForTimeout(900);
    const r = await p.evaluate(() => {
      const hdr = document.querySelector('.site-header');
      const main = document.querySelector('#main');
      const foot = document.querySelector('.site-footer');
      const box = e => { const r = e.getBoundingClientRect();
        return { t: Math.round(r.top + window.scrollY), b: Math.round(r.bottom + window.scrollY) }; };
      const overlaps = [];
      // An overlay header deliberately sits ON the hero, so skip that pair.
      const overlay = hdr && getComputedStyle(hdr).position === 'absolute';
      const parts = [...(overlay ? [] : [['header', hdr]]), ['main', main], ['footer', foot]].filter(x => x[1]);
      for (let i = 1; i < parts.length; i++) {
        const a = box(parts[i - 1][1]), c = box(parts[i][1]);
        if (c.t < a.b - 1) overlaps.push(`${parts[i][0]} overlaps ${parts[i - 1][0]} by ${a.b - c.t}px`);
      }
      return {
        headerPos: hdr ? getComputedStyle(hdr).position : 'MISSING',
        headerCol: hdr ? getComputedStyle(hdr).color : '',
        h1: (document.querySelector('h1') || {}).textContent?.trim().slice(0, 40) || 'NO H1',
        overlaps,
        hOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 2,
        docH: Math.round(document.documentElement.scrollHeight),
      };
    });
    const flags = [];
    if (resp.status() !== 200) flags.push(`HTTP ${resp.status()}`);
    if (r.overlaps.length) flags.push(...r.overlaps);
    if (r.hOverflow) flags.push('H-OVERFLOW');
    if (errs.length) flags.push('console: ' + errs[0].slice(0, 60));
    if (flags.length) bad++;
    console.log(`  ${String(w).padStart(4)}px  hdr=${r.headerPos}/${r.headerCol}  h1="${r.h1}"  docH=${r.docH}  ${flags.length ? '!! ' + flags.join('; ') : 'OK'}`);
    await ctx.close();
  }
}
console.log(`\n${bad ? '!! ' + bad + ' viewport(s) with issues' : 'ALL CLEAN'}`);
await b.close();

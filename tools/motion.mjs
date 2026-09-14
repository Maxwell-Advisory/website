import { chromium } from 'playwright';
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const HERE=dirname(fileURLToPath(import.meta.url)); const CACHE=join(HERE,'live-cache'); const PUB=join(HERE,'..','public');
const b=await chromium.launch();
const probe = async (label,url,mirror,sels)=>{
  const ctx=await b.newContext({viewport:{width:1280,height:900}}); const p=await ctx.newPage();
  if(mirror){ const html=readFileSync(join(CACHE,'live.html'),'utf8');
    await p.route('**/*',async r=>{const u=r.request().url();
      if(/^https:\/\/(?:www\.)?maxwelladvisory\.eu\/?$/.test(u)) return r.fulfill({status:200,contentType:'text/html; charset=utf-8',body:html});
      const m=u.match(/^https:\/\/(?:www\.)?maxwelladvisory\.eu\/(.+?)(?:\?|$)/);
      if(m){for(const base of [CACHE,PUB]){const f=join(base,decodeURIComponent(m[1])); if(existsSync(f)) return r.fulfill({path:f});}}
      return r.abort();}); }
  await p.goto(url,{waitUntil:'load',timeout:60000}); await p.waitForTimeout(1500);
  const out=await p.evaluate((sels)=>{
    const g=(sel)=>{const el=document.querySelector(sel); if(!el) return 'NOT FOUND';
      const c=getComputedStyle(el);
      return {anim:`${c.animationName} ${c.animationDuration} ${c.animationTimingFunction} ${c.animationIterationCount}`.trim(),
              trans:c.transition.slice(0,90)};};
    const o={}; for(const [k,s] of Object.entries(sels)) o[k]=g(s); return o;
  },sels);
  console.log(`\n### ${label}`); for(const [k,v] of Object.entries(out)) console.log(`  ${k}:`, typeof v==='string'?v:`anim=[${v.anim}] trans=[${v.trans}]`);
  await ctx.close();
};
await probe('LIVE','https://maxwelladvisory.eu/',true,{
  'menu icon':'.icon-rotate-hover img','cta button':'.elementor-element-161c30d .elementor-button',
  'footer mark':'.elementor-element-e28b15e img','footer link':'.elementor-icon-list-text','hero motif':'img[src*="Pictogramme"]'});
await probe('MINE','http://localhost:4321/website/',false,{
  'menu icon':'.site-header__toggle-icon','cta button':'.hero__btn--ghost',
  'footer mark':'.site-footer__mark','footer link':'.site-footer__nav a','hero motif':'.hero__motif'});
await b.close();

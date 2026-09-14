import { chromium } from 'playwright';
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const HERE=dirname(fileURLToPath(import.meta.url)); const CACHE=join(HERE,'live-cache'); const PUB=join(HERE,'..','public');
const b=await chromium.launch();
for (const w of [1280,768,375]) {
  const ctx=await b.newContext({viewport:{width:w,height:900}}); const p=await ctx.newPage();
  const html=readFileSync(join(CACHE,'live.html'),'utf8');
  await p.route('**/*',async r=>{const u=r.request().url();
    if(/^https:\/\/(?:www\.)?maxwelladvisory\.eu\/?$/.test(u)) return r.fulfill({status:200,contentType:'text/html; charset=utf-8',body:html});
    const m=u.match(/^https:\/\/(?:www\.)?maxwelladvisory\.eu\/(.+?)(?:\?|$)/);
    if(m){for(const base of [CACHE,PUB]){const f=join(base,decodeURIComponent(m[1])); if(existsSync(f)) return r.fulfill({path:f});}}
    return r.abort();});
  await p.goto('https://maxwelladvisory.eu/',{waitUntil:'load'}); await p.waitForTimeout(1200);
  const tops=await p.evaluate(()=>['55b4384','86a0f45','b74f127'].map(id=>{
    const el=document.querySelector('.elementor-element-'+id); if(!el) return 'absent';
    const r=el.getBoundingClientRect(); return `${Math.round(r.left)},${Math.round(r.top+window.scrollY)} (${Math.round(r.width)}w)`;}));
  console.log(`  LIVE @${w}: counters at`, tops.join('  |  '));
  await ctx.close();
}
await b.close();

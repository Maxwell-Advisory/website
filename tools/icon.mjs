import { chromium } from 'playwright';
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const HERE=dirname(fileURLToPath(import.meta.url)); const CACHE=join(HERE,'live-cache'); const PUB=join(HERE,'..','public');
const b=await chromium.launch();
const run=async(label,url,mirror,iconSel)=>{
  const ctx=await b.newContext({viewport:{width:1280,height:900}}); const p=await ctx.newPage();
  if(mirror){const html=readFileSync(join(CACHE,'live.html'),'utf8');
    await p.route('**/*',async r=>{const u=r.request().url();
      if(/^https:\/\/(?:www\.)?maxwelladvisory\.eu\/?$/.test(u)) return r.fulfill({status:200,contentType:'text/html; charset=utf-8',body:html});
      const m=u.match(/^https:\/\/(?:www\.)?maxwelladvisory\.eu\/(.+?)(?:\?|$)/);
      if(m){for(const base of [CACHE,PUB]){const f=join(base,decodeURIComponent(m[1])); if(existsSync(f)) return r.fulfill({path:f});}}
      return r.abort();});}
  await p.goto(url,{waitUntil:'load'}); await p.waitForTimeout(1200);
  const read=()=>p.$eval(iconSel,e=>{
    const before=getComputedStyle(e,'::before'), after=getComputedStyle(e,'::after');
    return `before[${before.transform} w=${before.width} h=${before.height} op=${before.opacity}]  after[${after.transform} op=${after.opacity}]`;});
  console.log(`\n### ${label}`);
  console.log('  CLOSED:', await read());
  await p.$eval(iconSel, e=>e.closest('details, .e-n-accordion-item').open=true);
  await p.waitForTimeout(900);
  console.log('  OPEN  :', await read());
  await ctx.close();
};
await run('LIVE','https://maxwelladvisory.eu/',true,'.e-n-accordion-item-title-icon');
await run('MINE','http://localhost:4321/website/',false,'.service__icon');
await b.close();

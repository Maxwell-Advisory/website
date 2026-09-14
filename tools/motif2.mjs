import { chromium } from 'playwright';
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const HERE=dirname(fileURLToPath(import.meta.url)); const CACHE=join(HERE,'live-cache'); const PUB=join(HERE,'..','public');
const b=await chromium.launch();
const run=async(label,url,mirror,sel,widths)=>{
  for(const w of widths){
  const ctx=await b.newContext({viewport:{width:w,height:900}}); const p=await ctx.newPage();
  if(mirror){const html=readFileSync(join(CACHE,'live.html'),'utf8');
    await p.route('**/*',async r=>{const u=r.request().url();
      if(/^https:\/\/(?:www\.)?maxwelladvisory\.eu\/?$/.test(u)) return r.fulfill({status:200,contentType:'text/html; charset=utf-8',body:html});
      const m=u.match(/^https:\/\/(?:www\.)?maxwelladvisory\.eu\/(.+?)(?:\?|$)/);
      if(m){for(const base of [CACHE,PUB]){const f=join(base,decodeURIComponent(m[1])); if(existsSync(f)) return r.fulfill({path:f});}}
      return r.abort();});}
  await p.goto(url,{waitUntil:'load'}); await p.waitForTimeout(3200);
  const info=await p.evaluate(s=>{const el=document.querySelector(s); if(!el) return 'NOT FOUND';
    const c=getComputedStyle(el);
    return `offset=${el.offsetWidth}x${el.offsetHeight} cssW=${c.width} maxW=${c.maxWidth} top=${c.top} left=${c.left} tag=${el.tagName} cls=${el.className.slice(0,40)}`;},sel);
  console.log(`  ${label} @${w}px:`, info);
  await ctx.close(); }
};
console.log('### base (untransformed) size of the motif');
await run('LIVE','https://maxwelladvisory.eu/',true,'.logo-animated',[375,768,1280,1920]);
await run('MINE','http://localhost:4321/website/',false,'.hero__motif',[375,768,1280,1920]);
await b.close();

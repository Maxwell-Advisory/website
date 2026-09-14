import { chromium } from 'playwright';
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const HERE=dirname(fileURLToPath(import.meta.url)); const CACHE=join(HERE,'live-cache'); const PUB=join(HERE,'..','public');
const b=await chromium.launch();
const run=async(label,url,mirror,sel)=>{
  const ctx=await b.newContext({viewport:{width:1280,height:900}}); const p=await ctx.newPage();
  if(mirror){const html=readFileSync(join(CACHE,'live.html'),'utf8');
    await p.route('**/*',async r=>{const u=r.request().url();
      if(/^https:\/\/(?:www\.)?maxwelladvisory\.eu\/?$/.test(u)) return r.fulfill({status:200,contentType:'text/html; charset=utf-8',body:html});
      const m=u.match(/^https:\/\/(?:www\.)?maxwelladvisory\.eu\/(.+?)(?:\?|$)/);
      if(m){for(const base of [CACHE,PUB]){const f=join(base,decodeURIComponent(m[1])); if(existsSync(f)) return r.fulfill({path:f});}}
      return r.abort();});}
  await p.goto(url,{waitUntil:'domcontentloaded'});
  const samples=await p.evaluate(async(sel)=>{
    const out=[]; const t0=performance.now();
    for(let i=0;i<13;i++){
      const el=document.querySelector(sel);
      if(!el){out.push('no element'); }
      else{const c=getComputedStyle(el);
        out.push(`t=${Math.round(performance.now()-t0)}ms op=${(+c.opacity).toFixed(2)} anim=${c.animationName}/${c.animationDuration}/${c.animationTimingFunction} rect=${Math.round(el.getBoundingClientRect().width)}px`);}
      await new Promise(r=>setTimeout(r,250));
    }
    return out;
  },sel);
  console.log(`\n### ${label} (${sel})`); samples.forEach(s=>console.log('  ',s));
  await ctx.close();
};
await run('LIVE','https://maxwelladvisory.eu/',true,'.logo-animated');
await run('MINE','http://localhost:4321/website/',false,'.hero__motif');
await b.close();

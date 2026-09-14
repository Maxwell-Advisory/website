import { chromium } from 'playwright';
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const HERE=dirname(fileURLToPath(import.meta.url));
const CACHE=join(HERE,'live-cache'), PAGES=join(CACHE,'pages'), PUB=join(HERE,'..','public');
const b=await chromium.launch();
const go=async(isLive)=>{const ctx=await b.newContext({viewport:{width:1280,height:900}});const p=await ctx.newPage();
 if(isLive){const html=readFileSync(join(PAGES,'for-companies.html'),'utf8');
  await p.route('**/*',async r=>{const u=r.request().url();
   if(/maxwelladvisory\.eu\/for-companies\/?$/.test(u)||/^https:\/\/(?:www\.)?maxwelladvisory\.eu\/?$/.test(u))
     return r.fulfill({status:200,contentType:'text/html; charset=utf-8',body:html});
   const m=u.match(/^https:\/\/(?:www\.)?maxwelladvisory\.eu\/(.+?)(?:\?|$)/);
   if(m){for(const base of [CACHE,PUB]){const f=join(base,decodeURIComponent(m[1]));if(existsSync(f))return r.fulfill({path:f});}}
   return r.abort();});
  await p.goto('https://maxwelladvisory.eu/for-companies/',{waitUntil:'load'}).catch(()=>{});
 } else await p.goto('http://localhost:4321/website/for-companies/',{waitUntil:'load'});
 await p.waitForTimeout(1400);
 const r=await p.evaluate(()=>{
  const H=e=>e?Math.round(e.getBoundingClientRect().height):0;
  const hdr=document.querySelector('.site-header, .elementor-location-header, [data-elementor-type="header"]');
  const ftr=document.querySelector('.site-footer, .elementor-location-footer, [data-elementor-type="footer"]');
  const wm=document.querySelector('.site-footer__wordmark, .elementor-element-483c599');
  return {header:H(hdr), footer:H(ftr), wordmark:H(wm), doc:Math.round(document.documentElement.scrollHeight)};});
 await ctx.close(); return r;};
const live=await go(true), mine=await go(false);
console.log('  LIVE:',JSON.stringify(live));
console.log('  MINE:',JSON.stringify(mine));
console.log('  delta header',mine.header-live.header,' footer',mine.footer-live.footer,' doc',mine.doc-live.doc);
await b.close();

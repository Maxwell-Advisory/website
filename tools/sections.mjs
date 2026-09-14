// Print live's top-level section boxes for a mirrored page.
//   MSYS_NO_PATHCONV=1 node tools/sections.mjs /track-record/ [width]
import { chromium } from 'playwright';
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const HERE=dirname(fileURLToPath(import.meta.url));
const CACHE=join(HERE,'live-cache'), PAGES=join(CACHE,'pages'), PUB=join(HERE,'..','public');
const path=process.argv[2]||'/', width=Number(process.argv[3]||1280);
const slug=path.replace(/^\/|\/$/g,'').replace(/\//g,'__')||'index';
const b=await chromium.launch();
const ctx=await b.newContext({viewport:{width,height:900}});
const p=await ctx.newPage();
const html=readFileSync(join(PAGES,`${slug}.html`),'utf8');
await p.route('**/*',async r=>{const u=r.request().url();
  if(/^https:\/\/(?:www\.)?maxwelladvisory\.eu\/?$/.test(u)||u.endsWith(path))
    return r.fulfill({status:200,contentType:'text/html; charset=utf-8',body:html});
  const m=u.match(/^https:\/\/(?:www\.)?maxwelladvisory\.eu\/(.+?)(?:\?|$)/);
  if(m){for(const base of [CACHE,PUB]){const f=join(base,decodeURIComponent(m[1])); if(existsSync(f)) return r.fulfill({path:f});}}
  return r.abort();});
await p.goto('https://maxwelladvisory.eu'+path,{waitUntil:'load'}).catch(()=>{});
await p.waitForTimeout(1500);
console.log(await p.evaluate(()=>{
  const main=document.querySelector('main')||document.body;
  const secs=[...main.querySelectorAll('.e-con.e-parent, .e-con.e-child')].filter(e=>e.getClientRects().length);
  return secs.slice(0,14).map(e=>{const c=getComputedStyle(e);const r=e.getBoundingClientRect();
    const t=(e.textContent||'').replace(/\s+/g,' ').trim().slice(0,38);
    return `${e.dataset.id||'?'} ${Math.round(r.width)}x${Math.round(r.height)}@y${Math.round(r.top+window.scrollY)} pad=${c.padding} minH=${c.minHeight} bg=${c.backgroundColor.replace(/\s/g,'')} dir=${c.flexDirection} | ${t}`;}).join('\n');
}));
await b.close();

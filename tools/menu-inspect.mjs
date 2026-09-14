import { chromium } from 'playwright';
import { readFileSync, existsSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const HERE=dirname(fileURLToPath(import.meta.url)); const CACHE=join(HERE,'live-cache'); const PUB=join(HERE,'..','public');
mkdirSync(join(HERE,'shots'),{recursive:true});
const b=await chromium.launch();

const mirror = async (p) => {
  const html=readFileSync(join(CACHE,'live.html'),'utf8');
  const missed=[];
  await p.route('**/*',async r=>{
    const u=r.request().url();
    if(/^https:\/\/(?:www\.)?maxwelladvisory\.eu\/?$/.test(u))
      return r.fulfill({status:200,contentType:'text/html; charset=utf-8',body:html});
    const m=u.match(/^https:\/\/(?:www\.)?maxwelladvisory\.eu\/(.+?)(?:\?|$)/);
    if(m){const rel=decodeURIComponent(m[1]);
      for(const base of [CACHE,PUB]){const f=join(base,rel); if(existsSync(f)) return r.fulfill({path:f});}
      missed.push(rel.slice(0,70));}
    return r.abort();});
  return missed;
};

for (const w of [1280, 768, 375]) {
  const ctx=await b.newContext({viewport:{width:w,height:900}}); const p=await ctx.newPage();
  const missed=await mirror(p);
  await p.goto('https://maxwelladvisory.eu/',{waitUntil:'load',timeout:60000});
  await p.waitForTimeout(2500);
  console.log(`\n${'='.repeat(70)}\nLIVE @ ${w}px\n${'='.repeat(70)}`);
  // what is the trigger, and is elementor-50 the header?
  console.log('  elementor-50 host:', await p.evaluate(()=>{const e=document.querySelector('.elementor-50');
    return e? `${e.tagName}.${e.className.slice(0,70)} parent=${e.parentElement?.tagName}.${(e.parentElement?.className||'').slice(0,40)}` : 'none';}));
  // find clickable menu toggles
  console.log('  candidate toggles:', await p.evaluate(()=>{
    const sels=['.elementor-menu-toggle','[role=button][aria-label*=enu]','.icon-rotate-hover','.elementor-element-20d270c',
                '.elementor-element-20d270c a','.elementor-element-20d270c img','a[href="#elementor-action"]','[data-elementor-open-lightbox]'];
    return sels.map(s=>{const n=document.querySelectorAll(s).length; return n?`${s}(${n})`:null;}).filter(Boolean).join(', ')||'none';}));
  // click the pictogram trigger
  const clicked = await p.evaluate(()=>{
    const el=document.querySelector('.elementor-element-20d270c a, .elementor-element-20d270c img, .elementor-menu-toggle, .elementor-element-20d270c');
    if(!el) return 'no trigger';
    el.dispatchEvent(new MouseEvent('click',{bubbles:true,cancelable:true}));
    if(el.click) el.click();
    return el.tagName+'.'+(el.className||'').slice(0,50);
  });
  console.log('  clicked:', clicked);
  await p.waitForTimeout(2000);
  // what became visible?
  console.log('  nav menu state:', await p.evaluate(()=>{
    const n=document.querySelector('.elementor-element-a2796ed');
    if(!n) return 'a2796ed not in DOM';
    const r=n.getBoundingClientRect(); const c=getComputedStyle(n);
    return `rect=${Math.round(r.width)}x${Math.round(r.height)} @${Math.round(r.top)} display=${c.display} vis=${c.visibility} op=${c.opacity}`;}));
  console.log('  visible menu items:', await p.evaluate(()=>{
    return [...document.querySelectorAll('.elementor-element-a2796ed a')]
      .filter(a=>a.getClientRects().length)
      .map(a=>{const r=a.getBoundingClientRect(); const c=getComputedStyle(a);
        return `"${a.textContent.trim()}" ${Math.round(r.width)}x${Math.round(r.height)}@${Math.round(r.left)},${Math.round(r.top)} fs=${c.fontSize} col=${c.color} align=${c.textAlign} bt=${c.borderTopWidth}`;}).join('\n      ')||'NONE VISIBLE';}));
  await p.screenshot({path:join(HERE,'shots',`live-menu-${w}.png`),fullPage:false});
  if(missed.length) console.log('  missed assets:', [...new Set(missed)].slice(0,6));
  await ctx.close();
}
await b.close();

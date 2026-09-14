import { chromium } from 'playwright';
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const HERE=dirname(fileURLToPath(import.meta.url)); const CACHE=join(HERE,'live-cache'); const PUB=join(HERE,'..','public');
const b=await chromium.launch();
const run = async (label,url,mirror,S)=>{
  const ctx=await b.newContext({viewport:{width:1280,height:900}}); const p=await ctx.newPage();
  if(mirror){ const html=readFileSync(join(CACHE,'live.html'),'utf8');
    await p.route('**/*',async r=>{const u=r.request().url();
      if(/^https:\/\/(?:www\.)?maxwelladvisory\.eu\/?$/.test(u)) return r.fulfill({status:200,contentType:'text/html; charset=utf-8',body:html});
      const m=u.match(/^https:\/\/(?:www\.)?maxwelladvisory\.eu\/(.+?)(?:\?|$)/);
      if(m){for(const base of [CACHE,PUB]){const f=join(base,decodeURIComponent(m[1])); if(existsSync(f)) return r.fulfill({path:f});}}
      return r.abort();}); }
  await p.goto(url,{waitUntil:'load',timeout:60000}); await p.waitForTimeout(1200);
  console.log(`\n### ${label}`);
  // CTA hover: colour + border before/after
  const btn=await p.$(S.btn);
  if(btn){
    const before=await btn.evaluate(e=>{const c=getComputedStyle(e);return c.color+' | '+c.borderTopColor+' | '+c.backgroundColor;});
    await btn.hover({force:true}); await p.waitForTimeout(1000);
    const after=await btn.evaluate(e=>{const c=getComputedStyle(e);return c.color+' | '+c.borderTopColor+' | '+c.backgroundColor;});
    console.log('  CTA  rest :',before); console.log('  CTA  hover:',after);
  } else console.log('  CTA not found');
  // menu icon hover animation name
  const ic=await p.$(S.icon);
  if(ic){
    await ic.hover({force:true}); await p.waitForTimeout(200);
    console.log('  ICON hover anim:', await ic.evaluate(e=>{const c=getComputedStyle(e);return `${c.animationName} ${c.animationDuration} ${c.animationIterationCount} playState=${c.animationPlayState}`;}));
  }
  // accordion: closed title colour, hover colour, open colour + icon transform
  const t=await p.$(S.accTitle);
  if(t){
    console.log('  ACC  closed colour:', await t.evaluate(e=>getComputedStyle(e).color));
    await t.hover({force:true}); await p.waitForTimeout(700);
    console.log('  ACC  hover colour :', await t.evaluate(e=>getComputedStyle(e).color));
  }
  const row=await p.$(S.accRow);
  if(row){ await row.click({force:true}); await p.waitForTimeout(900);
    console.log('  ACC  open colour  :', await p.$eval(S.accTitle,e=>getComputedStyle(e).color));
    const icon=await p.$(S.accIcon);
    if(icon) console.log('  ACC  icon(open) after-transform:', await icon.evaluate(e=>{
      const ps=getComputedStyle(e,'::after'); return `${ps.transform} opacity=${ps.opacity}`; }));
  }
  await ctx.close();
};
await run('LIVE','https://maxwelladvisory.eu/',true,{btn:'.elementor-element-161c30d .elementor-button',icon:'.icon-rotate-hover img',
  accTitle:'.e-n-accordion-item-title-text',accRow:'.e-n-accordion-item-title',accIcon:'.e-n-accordion-item-title-icon'});
await run('MINE','http://localhost:4321/website/',false,{btn:'.hero__btn--ghost',icon:'.site-header__toggle-icon',
  accTitle:'.service__title',accRow:'.service__summary',accIcon:'.service__icon'});
await b.close();

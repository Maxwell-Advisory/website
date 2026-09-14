import { chromium } from 'playwright';
const b=await chromium.launch();
const ctx=await b.newContext({viewport:{width:1440,height:900}}); const p=await ctx.newPage();
await p.goto('http://localhost:4321/website/',{waitUntil:'load'}); await p.waitForTimeout(1000);
await p.evaluate(()=>{document.querySelector('.service').open=true;});
await p.waitForTimeout(500);
console.log(await p.evaluate(()=>{
  const t=document.querySelector('.service__text'); const c=getComputedStyle(t);
  const body=document.querySelector('.service__body'); const cb=getComputedStyle(body);
  const img=document.querySelector('.service__image');
  return {
    textW: Math.round(t.getBoundingClientRect().width),
    flex: `${c.flexGrow}/${c.flexShrink}/${c.flexBasis}`,
    boxSizing: c.boxSizing, padLeft: c.paddingLeft, maxW: c.maxWidth,
    bodyW: Math.round(body.getBoundingClientRect().width), bodyPad: cb.padding, gap: cb.gap,
    imgW: Math.round(img.getBoundingClientRect().width),
    sum: Math.round(t.getBoundingClientRect().width + img.getBoundingClientRect().width),
  };
}));
await b.close();

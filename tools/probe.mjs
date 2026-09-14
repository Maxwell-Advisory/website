import { chromium } from 'playwright';
const b=await chromium.launch(); const ctx=await b.newContext({viewport:{width:1280,height:900}});
const p=await ctx.newPage(); await p.goto('http://localhost:4321/website/',{waitUntil:'load'});
await p.waitForTimeout(1200);
console.log(await p.evaluate(()=>{
  const v=document.querySelector('.stat__value'), s=document.querySelector('.stat__suffix'), n=document.querySelector('.stat__number');
  const cv=getComputedStyle(v);
  return { valueH:Math.round(v.getBoundingClientRect().height), cssHeight:cv.height, lineHeight:cv.lineHeight,
    display:cv.display, margin:cv.margin, suffixPos:getComputedStyle(s).position, suffixLH:getComputedStyle(s).lineHeight,
    suffixFS:getComputedStyle(s).fontSize, numberH:Math.round(n.getBoundingClientRect().height) };
}));
await b.close();

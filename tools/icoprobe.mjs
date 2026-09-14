import { chromium } from 'playwright';
const b=await chromium.launch();
const ctx=await b.newContext({viewport:{width:1280,height:900}}); const p=await ctx.newPage();
await p.goto('http://localhost:4321/website/',{waitUntil:'load'}); await p.waitForTimeout(1000);
await p.click('[data-menu-open]',{force:true}); await p.waitForTimeout(900);
console.log(await p.$eval('.site-menu__close-icon',e=>{const c=getComputedStyle(e); const r=e.getBoundingClientRect();
  return {rect:`${r.width.toFixed(1)}x${r.height.toFixed(1)}`, cssW:c.width, cssH:c.height, transform:c.transform,
    natural:`${e.naturalWidth}x${e.naturalHeight}`, attrs:`${e.getAttribute('width')}x${e.getAttribute('height')}`, maxW:c.maxWidth};}));
await b.close();

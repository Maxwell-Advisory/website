import { chromium } from 'playwright';
const b=await chromium.launch();
const ctx=await b.newContext({viewport:{width:1280,height:900}}); const p=await ctx.newPage();
const errs=[]; p.on('console',m=>{if(m.type()==='error') errs.push(m.text());});
await p.goto('http://localhost:4321/website/',{waitUntil:'load'}); await p.waitForTimeout(1200);
const out=await p.evaluate(async()=>{
  const log=[]; const ds=[...document.querySelectorAll('.service')];
  const h=d=>Math.round(d.getBoundingClientRect().height);
  const wait=ms=>new Promise(r=>setTimeout(r,ms));
  // open item 1
  ds[0].querySelector('.service__summary').click(); await wait(750);
  log.push(`after open #1: h=${h(ds[0])} open=${ds[0].open}`);
  // collapse item 1
  ds[0].querySelector('.service__summary').click();
  await wait(250); log.push(`mid-collapse #1: h=${h(ds[0])} open=${ds[0].open}`);
  await wait(600); log.push(`after collapse #1: h=${h(ds[0])} open=${ds[0].open} inlineH="${ds[0].style.height}" overflow=${getComputedStyle(ds[0]).overflow}`);
  // open #1 then switch to #2
  ds[0].querySelector('.service__summary').click(); await wait(750);
  ds[1].querySelector('.service__summary').click();
  await wait(250); log.push(`mid-switch: #1 h=${h(ds[0])} open=${ds[0].open} | #2 h=${h(ds[1])} open=${ds[1].open}`);
  await wait(700); log.push(`after switch: #1 h=${h(ds[0])} open=${ds[0].open} | #2 h=${h(ds[1])} open=${ds[1].open}`);
  return log;
});
out.forEach(l=>console.log('  ',l));
console.log('  console errors:', errs.length?errs.slice(0,3):'none');
await b.close();

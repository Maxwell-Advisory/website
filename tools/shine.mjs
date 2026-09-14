import { chromium } from 'playwright';
const b=await chromium.launch();
const ctx=await b.newContext({viewport:{width:1280,height:900}}); const p=await ctx.newPage();
const errs=[]; p.on('console',m=>{if(m.type()==='error')errs.push(m.text());});
await p.goto('http://localhost:4321/website/',{waitUntil:'load'}); await p.waitForTimeout(1200);
const read = sel => p.$eval(sel, e => {
  const a = getComputedStyle(e, '::after'); const c = getComputedStyle(e);
  return `left=${a.left} w=${a.width} bg=${a.backgroundImage.slice(0,58)}... skew=${a.transform} trans=${a.transitionDuration} | host pos=${c.position} of=${c.overflow}`;
});
for (const sel of ['.hero__btn--ghost', '.hero__btn--solid']) {
  console.log(`\n### ${sel}`);
  console.log('  rest :', await read(sel));
  const el = await p.$(sel);
  await el.hover({force:true});
  await p.waitForTimeout(500);  console.log('  +0.5s:', (await read(sel)).split(' | ')[0]);
  await p.waitForTimeout(500);  console.log('  +1.0s:', (await read(sel)).split(' | ')[0]);
  await p.waitForTimeout(700);  console.log('  settled:', (await read(sel)).split(' | ')[0]);
  await p.mouse.move(2,2); await p.waitForTimeout(1600);
}
console.log('\nerrors:', errs.length?errs.slice(0,3):'none');
await b.close();

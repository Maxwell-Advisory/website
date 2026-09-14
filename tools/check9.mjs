import { chromium } from 'playwright';
const b=await chromium.launch();
for (const w of [1280, 375]) {
  const ctx=await b.newContext({viewport:{width:w,height:900}}); const p=await ctx.newPage();
  const errs=[]; p.on('console',m=>{if(m.type()==='error')errs.push(m.text());});
  await p.goto('http://localhost:4321/website/',{waitUntil:'load'}); await p.waitForTimeout(1500);
  console.log(`\n=== @${w}px ===`);
  console.log('  1 hero blur anim :', await p.$eval('.hero',e=>{const c=getComputedStyle(e);
    return `${c.animationName}/${c.animationDuration}/${c.animationTimingFunction} fill=${c.animationFillMode}`;}));
  // scroll so the stats lines engage
  await p.evaluate(()=>{const el=document.querySelector('.stats__lines'); el.scrollIntoView({block:'center'});});
  await p.waitForTimeout(700);
  console.log('  2 stats lines    :', await p.$eval('.stats__lines',e=>{
    const bf=getComputedStyle(e,'::before'), af=getComputedStyle(e,'::after');
    return `p=${getComputedStyle(e).getPropertyValue('--line-p').trim()} before[${bf.transform} origin=${bf.transformOrigin} bg=${bf.backgroundColor}] after[origin=${af.transformOrigin}]`;}));
  console.log('  4 acc divider    :', await p.$eval('.service',e=>getComputedStyle(e).borderTopColor));
  console.log('  5 progress width :', await p.$eval('.sectors__progress', e => getComputedStyle(e).width), `of ${w}`);
  console.log('  6 footer picto   :', await p.$eval('.site-footer__totop',e=>getComputedStyle(e).display));
  console.log('  7 footer link    :', await p.$eval('.site-footer__nav a',e=>{const c=getComputedStyle(e);
    return `display=${c.display} h=${Math.round(e.getBoundingClientRect().height)} lh=${c.lineHeight}`;}));
  console.log('  8 suffix margins :', await p.$eval('.stat__suffix',e=>{const c=getComputedStyle(e);
    return `ml=${c.marginLeft} mt=${c.marginTop} fs=${c.fontSize}`;}));
  console.log('  9 label shifts   :', await p.$$eval('.stat__label',els=>els.map(e=>getComputedStyle(e).marginLeft).join(' | ')));
  // 3 image fade
  const r=await p.evaluate(async()=>{
    const d=document.querySelector('.service'); const sm=d.querySelector('.service__summary');
    sm.click(); await new Promise(r=>setTimeout(r,800));
    const img=d.querySelector('.service__image');
    const o1=getComputedStyle(img).opacity;
    sm.click(); await new Promise(r=>setTimeout(r,250));
    const o2=getComputedStyle(img).opacity;
    return `open=${o1} mid-close=${o2} trans=${getComputedStyle(img).transition.slice(0,30)}`;});
  console.log('  3 image fade     :', r);
  console.log('  errors:', errs.length?errs.slice(0,3):'none');
  await ctx.close();
}
await b.close();

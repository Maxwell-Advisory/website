import { chromium } from 'playwright';
const b=await chromium.launch();
const ctx=await b.newContext({viewport:{width:1280,height:900}}); const p=await ctx.newPage();
await p.goto('http://localhost:4321/website/',{waitUntil:'load'}); await p.waitForTimeout(1500);

console.log('=== 1. MOTIF size (live: 480 @1280) ===');
console.log('  ', await p.evaluate(()=>{const el=document.querySelector('.hero__motif');
  const c=getComputedStyle(el); return `offset=${el.offsetWidth}px anim=${c.animationName}/${c.animationDuration}/${c.animationTimingFunction}`;}));

console.log('\n=== 2. SCROLL-DARKEN (live: #c7c7c7 -> #222222, 0.55s ease) ===');
console.log('  ', await p.evaluate(()=>{const s=document.querySelector('.intro__char');
  const c=getComputedStyle(s); return `base=${c.color} transition=${c.transition}`;}));
// force-lit sample
console.log('  ', await p.evaluate(async()=>{const s=document.querySelector('.intro__char');
  s.classList.add('is-lit'); await new Promise(r=>setTimeout(r,700));
  return `lit=${getComputedStyle(s).color}`;}));

console.log('\n=== 3. ACCORDION draw-down (sampling height after click) ===');
const sum = await p.$('.service__summary');
await sum.scrollIntoViewIfNeeded();
const samples = await p.evaluate(async()=>{
  const d=document.querySelector('.service'); const sm=d.querySelector('.service__summary');
  const out=[]; const t0=performance.now();
  sm.click();
  for(let i=0;i<9;i++){
    out.push(`t=${Math.round(performance.now()-t0)}ms h=${Math.round(d.getBoundingClientRect().height)}px overflow=${getComputedStyle(d).overflow} open=${d.open}`);
    await new Promise(r=>requestAnimationFrame(()=>setTimeout(r,70)));
  }
  await new Promise(r=>setTimeout(r,600));
  out.push(`settled h=${Math.round(d.getBoundingClientRect().height)}px overflow=${getComputedStyle(d).overflow} inlineH="${d.style.height}" open=${d.open}`);
  return out;
});
samples.forEach(s=>console.log('  ',s));
console.log('\n=== console errors ===');
const errs=[]; p.on('console',m=>{if(m.type()==='error') errs.push(m.text());});
await p.reload({waitUntil:'load'}); await p.waitForTimeout(1200);
console.log(errs.length?errs.slice(0,5):['  none']);
await b.close();

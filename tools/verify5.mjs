import { chromium } from 'playwright';
const b=await chromium.launch();
const ctx=await b.newContext({viewport:{width:1280,height:900}}); const p=await ctx.newPage();
const errs=[]; p.on('console',m=>{if(m.type()==='error')errs.push(m.text());});
await p.goto('http://localhost:4321/website/',{waitUntil:'load'}); await p.waitForTimeout(1400);

console.log('=== CTA buttons (live: 405px wide, no backdrop-filter, hover on ghost only) ===');
for (const sel of ['.hero__btn--ghost','.hero__btn--solid']) {
  const el=await p.$(sel);
  const rest=await el.evaluate(e=>{const c=getComputedStyle(e);
    return `w=${Math.round(e.getBoundingClientRect().width)} pad=${c.padding} bg=${c.backgroundColor} col=${c.color} bd=${c.borderTopColor} backdrop=${c.backdropFilter} trans=${c.transitionDuration}`;});
  await el.hover({force:true}); await p.waitForTimeout(1000);
  const hov=await el.evaluate(e=>{const c=getComputedStyle(e); return `col=${c.color} bd=${c.borderTopColor}`;});
  console.log(`  ${sel}\n     rest : ${rest}\n     hover: ${hov}`);
  await p.mouse.move(5,5); await p.waitForTimeout(900);
}

console.log('\n=== BURGER MENU (open it) ===');
await p.click('[data-menu-open]',{force:true}); await p.waitForTimeout(600);
console.log('  ', await p.evaluate(()=>{const m=document.querySelector('.site-menu');
  const c=getComputedStyle(m); return `open=${m.hasAttribute('data-open')} vis=${c.visibility} bg=${c.backgroundColor}`;}));
console.log('  logo w:', await p.$eval('.site-menu__logo img',e=>e.offsetWidth+'px (live 414)'));
console.log('  close icon:', await p.$eval('.site-menu__close-icon',e=>{const c=getComputedStyle(e);
  return `${e.offsetWidth}x${e.offsetHeight} filter=${c.filter}`;}));
console.log('  items:', await p.$$eval('.site-menu__list a',els=>els.map(e=>e.textContent.trim()).join(' | ')));
const link=await p.$('.site-menu__list a');
console.log('  item rest :', await link.evaluate(e=>{const c=getComputedStyle(e);
  return `fs=${c.fontSize} col=${c.color} fill=${c.webkitTextFillColor} bgSize=${c.backgroundSize} borderTop=${c.borderTopWidth} ${c.borderTopColor} pad=${c.padding} transform=${c.textTransform}`;}));
await link.hover({force:true}); await p.waitForTimeout(1400);
console.log('  item mid-hover:', await link.evaluate(e=>{const c=getComputedStyle(e);
  return `fill=${c.webkitTextFillColor} bgSize=${c.backgroundSize} padLeft=${c.paddingLeft}`;}));
console.log('\n  console errors:', errs.length?errs.slice(0,4):'none');
await b.close();

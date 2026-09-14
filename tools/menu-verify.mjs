import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const HERE=dirname(fileURLToPath(import.meta.url)); mkdirSync(join(HERE,'shots'),{recursive:true});
const b=await chromium.launch();
const LIVE={1280:'panel~568 item79 fs70 lh20 align=start logo414 close51',
            1024:'item fs53 logo360',
            375:'item71 fs35 lh20 align=center logo280 closeX'};
for (const w of [1280,1024,375]) {
  const ctx=await b.newContext({viewport:{width:w,height:900}}); const p=await ctx.newPage();
  const errs=[]; p.on('console',m=>{if(m.type()==='error')errs.push(m.text());});
  await p.goto('http://localhost:4321/website/',{waitUntil:'load'}); await p.waitForTimeout(1000);
  await p.click('[data-menu-open]',{force:true}); await p.waitForTimeout(1000);
  await p.mouse.move(2,2); await p.waitForTimeout(900);   // clear hover so no transform artifact
  const r=await p.evaluate(()=>{
    const q=s=>document.querySelector(s);
    const B=e=>({w:Math.round(e.getBoundingClientRect().width),h:Math.round(e.getBoundingClientRect().height)});
    const a=q('.site-menu__list a'), ca=getComputedStyle(a);
    const ico=q('.site-menu__close-icon'), x=q('.site-menu__close-x');
    return {panel:`${B(q('.site-menu__panel')).w}x${B(q('.site-menu__panel')).h}`,
      item:`h=${B(a).h} fs=${ca.fontSize} lh=${ca.lineHeight} align=${ca.textAlign} bt=${ca.borderTopWidth}`,
      logo:B(q('.site-menu__logo img')).w,
      close:getComputedStyle(ico).display==='none'?'picto hidden':`picto ${getComputedStyle(ico).width}`,
      closeX:getComputedStyle(x).display==='none'?'X hidden':`X ${B(x).w}`};
  });
  console.log(`\n=== MINE @${w} ===`);
  for(const[k,v]of Object.entries(r)) console.log(`  ${k}: ${v}`);
  console.log(`  live: ${LIVE[w]}`);
  if(errs.length) console.log('  errors:',errs.slice(0,3));
  await p.screenshot({path:join(HERE,'shots',`mine-menu-${w}.png`)});
  await ctx.close();
}
await b.close();

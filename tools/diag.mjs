import { chromium } from 'playwright';
const b = await chromium.launch();
const ctx = await b.newContext({ viewport:{width:1280,height:900} });
const p = await ctx.newPage();
const failed=[];
p.on('requestfailed', r => failed.push(r.url().slice(0,80)+' :: '+(r.failure()?.errorText||'')));
const resp = await p.goto('https://maxwelladvisory.eu/', { waitUntil:'domcontentloaded', timeout:60000 });
console.log('status:', resp?.status(), '| final url:', p.url());
console.log('title:', await p.title());
console.log(await p.evaluate(() => ({
  styleBlocks: document.querySelectorAll('style').length,
  linkSheets: document.querySelectorAll('link[rel=stylesheet]').length,
  sheets: document.styleSheets.length,
  bodyFont: getComputedStyle(document.body).fontFamily.slice(0,40),
  h1Size: (()=>{const h=document.querySelector('h1'); return h?getComputedStyle(h).fontSize:null;})(),
  hasElementorEl: !!document.querySelector('.elementor-element'),
  bodyClass: document.body.className.slice(0,60),
  textLen: document.body.innerText.length,
})));
console.log('failed requests:', failed.length);
failed.slice(0,8).forEach(f=>console.log('  ',f));
await b.close();

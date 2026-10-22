const{chromium}=require('playwright');const assert=require('node:assert/strict');
const rgb=s=>s.match(/[\d.]+/g).slice(0,3).map(Number);
const lum=s=>rgb(s).map(v=>{v/=255;return v<=.04045?v/12.92:((v+.055)/1.055)**2.4}).reduce((a,v,i)=>a+v*[.2126,.7152,.0722][i],0);
const contrast=(a,b)=>(Math.max(lum(a),lum(b))+.05)/(Math.min(lum(a),lum(b))+.05);
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox']});
 try{
 const defaults=await browser.newPage({colorScheme:'dark'});
 for(const file of ['index.html','unidad3.html','propiedades.html','homomorfismo.html','homomorfismo-pasos.html']){
   await defaults.goto('http://127.0.0.1:8000/'+file);
   assert.equal(await defaults.locator('html').getAttribute('data-theme'),'light',file+' must default to light');
   assert.equal(await defaults.locator('body').evaluate(e=>getComputedStyle(e).backgroundColor),'rgb(245, 246, 250)',file+' must stay light with a dark OS preference');
 }await defaults.close();console.log('PASS all five entry pages default to light with a dark OS preference');
 for(const scheme of ['dark','light'])for(const viewport of [{width:1280,height:720},{width:390,height:844},{width:320,height:568},{width:844,height:390}]){
  const p=await browser.newPage({viewport,colorScheme:scheme,reducedMotion:'reduce'});const errors=[];p.on('pageerror',e=>errors.push(e.message));
  await p.goto('http://127.0.0.1:8000/index.html');await p.locator('#squareModal').evaluate(e=>e.showModal());
  const frame=p.frames().find(f=>f.url().includes('homomorfismo-pasos'));assert.ok(frame);await frame.waitForSelector('.simulator-toolbar');
  assert.equal(await p.locator('html').getAttribute('data-theme'),'light');assert.equal(await frame.locator('html').getAttribute('data-theme'),'light');
  assert.equal(await frame.locator('body').evaluate(e=>getComputedStyle(e).backgroundColor),'rgb(245, 246, 250)');
  // Explicit dark theme still keeps pending and completed text legible.
  if(scheme==='dark')await frame.locator('html').evaluate(e=>e.dataset.theme='dark');
  async function fits(label){const shape=await frame.evaluate(()=>{const main=document.querySelector('main'),box=main.getBoundingClientRect(),visible=[...main.children].filter(x=>getComputedStyle(x).display!=='none').map(x=>x.getBoundingClientRect());return {h:main.scrollHeight-main.clientHeight,w:main.scrollWidth-main.clientWidth,min:Math.min(...visible.map(r=>r.top)),max:Math.max(...visible.map(r=>r.bottom)),height:innerHeight};});assert.ok(shape.h<=1&&shape.w<=1&&shape.min>=-1&&shape.max<=shape.height+1,label+JSON.stringify(shape));}
  await fits('Initial');
  assert.ok((await frame.locator('.step.hide').first().textContent()).includes('pendiente'));
  assert.ok(!(await frame.locator('.step.hide').first().textContent()).includes('12'));
  assert.ok((await frame.locator('.square .val').allTextContents()).includes('?'));
  const pending=await frame.locator('.square .off').evaluateAll(es=>es.map(e=>getComputedStyle(e).opacity));assert.ok(pending.every(v=>v==='1'));
  const svgColors=await frame.locator('.square text').evaluateAll(es=>es.filter(e=>e.textContent.trim()).map(e=>({fill:getComputedStyle(e).fill,bg:getComputedStyle(document.body).backgroundColor})));for(const c of svgColors)assert.ok(contrast(c.fill,c.bg)>=4.5,'SVG text contrast '+JSON.stringify(c));
  for(let step=0;step<5;step++){await frame.locator('#next').click();await fits('Step '+step);}
  assert.match(await frame.locator('.embedded-step-readout').innerText(),/llegan a 0/);
  for(const view of ['path1','path2','conclusion','setup']){
   await frame.locator('#simulatorView').selectOption(view);await fits(view);
   if(view==='path1'||view==='path2'){
    const colors=await frame.locator('.path:visible .step').evaluateAll(es=>es.map(e=>({color:getComputedStyle(e).color,bg:getComputedStyle(e.closest('.path')).backgroundColor,opacity:getComputedStyle(e).opacity})));
    for(const c of colors){assert.equal(c.opacity,'1');assert.ok(contrast(c.color,c.bg)>=4.5,'Path text contrast');}
   }
  }
  await frame.locator('#functionSelect').selectOption('5');await frame.locator('#simulatorView').selectOption('diagram');await frame.locator('#all').click();assert.match(await frame.locator('.embedded-step-readout').innerText(),/NO respeta/);await fits('Counterexample');
  await frame.locator('#simulatorView').selectOption('setup');await frame.locator('#inA').fill('bad');await frame.locator('#simulatorView').selectOption('diagram');assert.ok(await frame.locator('#next').isDisabled());assert.match(await frame.locator('.embedded-step-readout').innerText(),/Escribe un número/);
  await frame.locator('#simulatorView').selectOption('setup');await frame.locator('#inA').fill('2');await frame.locator('#simulatorView').selectOption('diagram');assert.ok(!await frame.locator('#next').isDisabled());
  await p.locator('#btnSquareClose').click();assert.ok(!await p.locator('#squareModal').isVisible());assert.deepEqual(errors,[]);console.log('PASS modal:',scheme,viewport.width+'×'+viewport.height,'contrast, pending values, steps, views, validation and close');await p.close();
 }}finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1});

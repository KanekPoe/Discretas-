// Requires the static server at http://127.0.0.1:8000.
const {chromium}=require('playwright');
const assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox']});
 try{
  for(const file of ['index.html','unidad3.html'])for(const viewport of [{width:1280,height:720},{width:390,height:844},{width:360,height:640},{width:320,height:568},{width:844,height:390}]){
   const page=await browser.newPage({viewport,reducedMotion:'reduce'});const errors=[];page.on('pageerror',e=>errors.push(e.message));
   await page.goto('http://127.0.0.1:8000/'+file);await page.locator('#topicSelect').selectOption('s37');
   while(!await page.locator('#escena-codigo').isVisible())await page.locator('#deckNext').click();
   const scene=page.locator('#escena-codigo'),reset=scene.locator('.reset-code'),note=scene.locator('.scene-message');
   async function inspect(label){
    const m=await page.locator('main>section.cur').evaluate(e=>{const r=e.getBoundingClientRect(),kids=[...e.children].filter(k=>getComputedStyle(k).display!=='none').map(k=>k.getBoundingClientRect());return {h:e.scrollHeight-e.clientHeight,w:e.scrollWidth-e.clientWidth,top:Math.min(...kids.map(k=>k.top))-r.top,bottom:Math.max(...kids.map(k=>k.bottom))-r.bottom};});
    assert.ok(m.h<=2&&m.w<=2&&m.top>=-1&&m.bottom<=1,JSON.stringify({file,viewport,label,...m}));
   }
   for(const mode of ['par','rep']){
    await scene.locator('[data-code="'+mode+'"]').click();const original=mode==='par'?'10111':'101110111011';
    const received=()=>scene.locator('[data-bit]').allTextContents().then(xs=>xs.join(''));
    assert.ok(await reset.isDisabled());assert.match(await note.innerText(),/Sin ruido añadido/);await inspect('clean-'+mode);
    await scene.locator('[data-bit="0"]').click();assert.ok(await reset.isEnabled());assert.notEqual(await received(),original);assert.equal(await scene.locator('[aria-pressed="true"]').count(),1);await inspect('one-error-'+mode);
    await scene.locator('[data-bit="0"]').click();assert.ok(await reset.isDisabled());assert.equal(await received(),original);
    for(const bit of [0,1])await scene.locator('[data-bit="'+bit+'"]').click();assert.ok(await reset.isEnabled());await inspect('two-errors-'+mode);
    await reset.click();assert.equal(await received(),original);assert.ok(await reset.isDisabled());assert.equal(await scene.locator('.code-bit.flipped').count(),0);assert.match(await note.innerText(),/Cambios deshechos/);assert.equal(await scene.locator('[data-code="'+mode+'"]').evaluate(e=>e===document.activeElement),true);await inspect('restored-'+mode);
   }
   assert.deepEqual(errors,[]);console.log('PASS reset, clean state, parity/repetition and layout',file,viewport);await page.close();
  }
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1});

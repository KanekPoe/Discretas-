const {chromium}=require('playwright');
const assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox']});
 try{
  for(const motion of ['reduce','no-preference']){
   const page=await browser.newPage({viewport:{width:1280,height:720},reducedMotion:motion});const errors=[];page.on('pageerror',e=>errors.push(e.message));
   await page.goto('http://127.0.0.1:8000/');
   await page.locator('#deckNext').click();assert.ok(await page.locator('#maquinas').isVisible());
   assert.ok(!await page.locator('#cv').isVisible(),'Graphs should be in consultation, not the live introduction');
   const run=page.locator('.machine-run');
   assert.ok(await run.evaluate(e=>getComputedStyle(e).backgroundColor!==getComputedStyle(e).color),'Primary button must have readable text');
   // Four experiments: swapping and regrouping, each with addition and subtraction.
   for(const [kind,op,a,b] of [['order','minus','5','−5'],['order','plus','11','11'],['group','minus','3','7'],['group','plus','13','13']]){
    await page.locator(`[data-kind=${kind}]`).click();await page.locator(`[data-op=${op}]`).click();
    assert.match(await page.locator('.machine-property-title').innerText(),new RegExp(kind==='order'?'conmutativa':'asociativa'));
    assert.ok(await run.isDisabled());assert.deepEqual(await page.locator('.output-number').allTextContents(),['?','?']);
    await page.locator('[name=machine-vote][value=different]').check();await run.click();
    await page.waitForFunction(()=>!document.querySelector('.machine-run').disabled);
    assert.deepEqual(await page.locator('.output-number').allTextContents(),['?','?'],'Transformation must not reveal outputs');
    await run.click();
    if(kind==='group'){
     await page.waitForFunction(()=>document.querySelector('.machine-run').textContent.includes('Comparar las salidas'));
     const intermediate=await page.locator('.number-tiles').allTextContents();
     assert.deepEqual(intermediate,op==='minus'?['5−2','8−1']:['11+2','8+5']);
     assert.deepEqual(await page.locator('.output-number').allTextContents(),['?','?']);await run.click();
    }
    await page.waitForFunction(()=>document.querySelector('#maquinas').dataset.phase==='done');
    assert.deepEqual(await page.locator('.output-number').allTextContents(),[a,b]);assert.ok(await run.isDisabled());
    assert.match(await page.locator('.machine-step').innerText(),new RegExp(kind==='order'?'Conmutar':'Asociar'));
   }
   // Reset while an animation is running must not publish stale output afterwards.
   await page.locator('.machine-reset').click();await page.locator('[name=machine-vote][value=same]').check();await run.click();
   await page.locator('.machine-reset').click();await page.waitForTimeout(motion==='reduce'?30:950);
   assert.deepEqual(await page.locator('.output-number').allTextContents(),['?','?']);assert.ok(await run.isDisabled());
   await page.screenshot({path:'/tmp/maquinas-'+motion+'.png'});
   await page.locator('#deckNext').click();assert.ok(await page.locator('#camino-inverso').isVisible());
   assert.ok(await page.locator('[data-add="-3"]').isDisabled());
   await page.locator('.start-journey').click();await page.locator('[data-add="0"]').click();
   await page.waitForFunction(()=>!document.querySelector('.unlock-integers').disabled);
   assert.match(await page.locator('.inverse-feedback').innerText(),/identidad/);
   assert.match(await page.locator('.inverse-property-title').innerText(),/identidad/);
   assert.match(await page.locator('.journey-equation').innerText(),/3 \+ \(0\).*3/);
   assert.ok(await page.locator('[data-add="-3"]').isDisabled());
   await page.locator('[data-add="3"]').click();await page.waitForFunction(()=>!document.querySelector('.unlock-integers').disabled);
   assert.match(await page.locator('.journey-equation').innerText(),/6/);
   await page.locator('.unlock-integers').click();assert.ok(!await page.locator('[data-add="-3"]').isDisabled());
   assert.match(await page.locator('.inverse-property-title').innerText(),/inverso aditivo/);
   await page.locator('[data-add="-3"]').click();await page.waitForFunction(()=>document.querySelector('#camino-inverso').classList.contains('arrived'));
   assert.match(await page.locator('.inverse-feedback').innerText(),/Volvimos a casa/);
   assert.match(await page.locator('.journey-equation').innerText(),/3 \+ \(−3\).*0/);
   await page.locator('.reset-journey').click();assert.ok(await page.locator('[data-add="-3"]').isDisabled());
   assert.equal(await page.locator('.traveler text').textContent(),'0');
   await page.locator('.start-journey').click();await page.locator('.reset-journey').click();await page.waitForTimeout(motion==='reduce'?30:950);
   assert.equal(await page.locator('.traveler text').textContent(),'0');assert.ok(!await page.locator('.start-journey').isDisabled());
   await page.screenshot({path:'/tmp/camino-'+motion+'.png'});
   await page.locator('#deckNext').click();await page.locator('#deckNext').click();
   assert.ok(await page.locator('#juego-0').isVisible());
   assert.equal(await page.locator('.property-stamp.pending').count(),5);
   await page.locator('#juego-0 input[value="1"]').check();await page.locator('#juego-0 .check-answer').click();
   assert.equal(await page.locator('.property-stamp.approved').count(),3);assert.equal(await page.locator('.property-stamp.stopped').count(),1);assert.match(await page.locator('.property-stamp.stopped').innerText(),/Inversos/);
   await page.locator('#juego-0 .next-round').click();assert.equal(await page.locator('.property-stamp.pending').count(),5);
   await page.locator('#juego-0 input[value="1"]').check();await page.locator('#juego-0 .check-answer').click();assert.equal(await page.locator('.property-stamp.approved').count(),5);
   await page.locator('#juego-0 .next-round').click();await page.locator('#juego-0 input[value="1"]').check();await page.locator('#juego-0 .check-answer').click();
   assert.match(await page.locator('.property-stamp.stopped').innerText(),/Asociativa/);
   await page.locator('#routeMode').selectOption('full');await page.locator('#nav a[href="#entrada"]').click();assert.ok(await page.locator('#cv').isVisible());
   await page.locator('#routeMode').selectOption('live');
   for(const vp of [{width:1280,height:720},{width:390,height:844}]){
    await page.setViewportSize(vp);await page.reload();await page.locator('#deckNext').click();
    for(const id of ['maquinas','camino-inverso']){
     assert.ok(await page.locator('#'+id).isVisible());
     assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
     const control=page.locator('#'+id+' .foundation-actions button').last();await control.scrollIntoViewIfNeeded();
     const box=await control.boundingBox(),bar=await page.locator('#deckBar').boundingBox();assert.ok(box.y+box.height<=bar.y+1);
     await page.locator('#entrada').evaluate(el=>el.scrollTop=0);await page.screenshot({path:'/tmp/'+id+'-'+vp.width+'.png'});
     await page.locator('#deckNext').click();
    }
   }
   assert.deepEqual(errors,[]);console.log('PASS introduction:',motion,'4 calculations, intermediate states, reset during motion, inverse, passport, keyboard-safe controls, mobile and projector');
   await page.close();
  }
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1});

// Run: node tests/exposicion.cjs (Playwright + Chromium and local server on :8000).
const { chromium } = require('playwright');
const assert = require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',headless:true,args:['--no-sandbox']});
 const errors=[]; const page=await browser.newPage({viewport:{width:1280,height:720},reducedMotion:'reduce'});
 page.on('pageerror',e=>errors.push(e.message));
 const base='http://127.0.0.1:8000';
 async function reveal(sel){
  for(let i=0;i<110;i++){
   if(await page.locator(sel).isVisible())return;
   assert.ok(!await page.locator('#deckNext').isDisabled(),`Cannot reach ${sel}`);
   await page.locator('#deckNext').click();
  }throw Error('Unreachable '+sel);
 }
 try{
  for(const file of ['index.html','unidad3.html']){
   const res=await page.goto(base+'/'+file);assert.equal(res.status(),200);
   assert.equal(await page.locator('.learning-game').count(),9);
   assert.equal(await page.locator('html').getAttribute('data-route'),'live');
   await reveal('#juego-0');assert.match(await page.locator('#speakerCue').innerText(),/Expositor 1/);
  }
  await page.goto(base+'/index.html');
  await reveal('#btnOpenSquare');
  await page.locator('#btnOpenSquare').click();
  assert.ok(await page.locator('#squareModal').isVisible());
  assert.match(await page.frameLocator('#squareModal iframe').locator('body').innerText(), /homomorfismo/i);
  const slideBefore=await page.locator('#deckInfo').innerText();
  await page.keyboard.press('ArrowRight');assert.equal(await page.locator('#deckInfo').innerText(),slideBefore);
  await page.locator('#btnSquareClose').click();assert.ok(!await page.locator('#squareModal').isVisible());
  await page.locator('#btnOpenSquare').click();await page.keyboard.press('Escape');assert.ok(!await page.locator('#squareModal').isVisible());
  console.log('PASS preserved homomorphism simulator: iframe, close, Escape, modal keyboard isolation');
  await page.goto(base+'/index.html');
  const answers=[[1,1,1],[3,1],[1,0,0],[2,1],[2,1],[2,1],[1,1],null,[1,1,1]];
  for(let i=0;i<9;i++){
   const id='#juego-'+i;await reveal(id);
   if(i===7){
    const form=page.locator(id+' form');
    assert.equal(await form.evaluate(f=>f.checkValidity()),false);
    await form.locator('[name=r3]').fill('3');
    assert.equal(await form.evaluate(f=>f.checkValidity()),false);
    // Exhaust all residue triples corresponding to numbers in the agreed range.
    const results=await form.evaluate(f=>Array.from({length:105},(_,x)=>{
      for(const m of [3,5,7])f.elements['r'+m].value=x%m;
      f.requestSubmit();return f.parentElement.querySelector('.oracle-result strong').textContent;
    }));assert.deepEqual(results,Array.from({length:105},(_,x)=>String(x)));
    await form.locator('[type=reset]').click();assert.equal(await page.locator(id+' .game-feedback').innerText(),'');
    console.log('PASS CRT: 105 values, required inputs, bounds, reset');continue;
   }
   assert.ok(await page.locator(id+' .check-answer').isDisabled());
   assert.equal(await page.locator(id+' .game-feedback').innerText(),'');
   // A wrong vote must still explain the correct concept and allow a fresh run.
   await page.locator(id+' input[value="'+((answers[i][0]+1)%(await page.locator(id+' input').count()))+'"]').check();
   await page.locator(id+' .check-answer').click();assert.match(await page.locator(id+' .game-feedback').innerText(),/Revisemos/);
   assert.equal(await page.locator(id+' input:disabled').count(),await page.locator(id+' input').count());
   await page.locator(id+' .reset-game').click();assert.ok(await page.locator(id+' .check-answer').isDisabled());
   for(let r=0;r<answers[i].length;r++){
    await page.locator(id+' input[value="'+answers[i][r]+'"]').check();
    await page.locator(id+' .check-answer').click();assert.match(await page.locator(id+' .game-feedback').innerText(),/✓ Coincide/);
    assert.equal(await page.locator(id+' .correct').count(),1);
    if(r<answers[i].length-1)await page.locator(id+' .next-round').click();
   }
   assert.ok(await page.locator(id+' .game-done').isVisible());console.log('PASS game',i+1,'all rounds, wrong vote, explanation, reset');
  }
  await reveal('#cierre');assert.match(await page.locator('#speakerCue').innerText(),/Ambos/);
  await page.locator('#routeMode').selectOption('full');assert.equal(await page.locator('html').getAttribute('data-route'),'full');
  await page.locator('#nav a[href="#s37"]').click();await reveal('#cRecv');
  await page.locator('#cRecv button').nth(0).click();assert.match(await page.locator('#cVerdict').innerText(),/DETECTADO/);
  await page.locator('#cRecv button').nth(1).click();assert.match(await page.locator('#cVerdict').innerText(),/sin detectarse/);
  await page.locator('#cReset').click();assert.equal(await page.locator('#cRecv .err').count(),0);
  await page.locator('[data-c=rep]').click();await page.locator('#cRecv button').nth(0).click();assert.match(await page.locator('#cVerdict').innerText(),/CORREGIDO/);
  await page.locator('#cRecv button').nth(4).click();assert.match(await page.locator('#cVerdict').innerText(),/incorrecta/);
  console.log('PASS noise lab: parity detection, undetected pair, majority correction and failure, reset');
  for(const viewport of [{width:1280,height:720},{width:390,height:844}]){
   await page.setViewportSize(viewport);await page.reload();
   for(let i=0;i<9;i++){
    await reveal('#juego-'+i);
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'Page horizontal overflow');
    const bottom=await page.locator('#deckBar').evaluate(e=>e.getBoundingClientRect().top);
    await page.locator('#juego-'+i+' .game-actions button').last().scrollIntoViewIfNeeded();
    const box=await page.locator('#juego-'+i+' .game-actions button').last().boundingBox();
    assert.ok(box.y+box.height<=bottom+1,'Action hidden by navigation');
   }
   await page.screenshot({path:'/workspace/setup-discretas/reto-'+viewport.width+'.png'});
   console.log('PASS layout',viewport.width);
  }
  assert.deepEqual(errors,[]);console.log('PASS no browser JavaScript errors');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1});

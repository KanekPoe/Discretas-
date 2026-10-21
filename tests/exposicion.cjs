// Requires Playwright, Chromium and the static server at http://127.0.0.1:8000.
const {chromium}=require('playwright');
const assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox']});
 const page=await browser.newPage({viewport:{width:1280,height:720},reducedMotion:'reduce'});const errors=[];page.on('pageerror',e=>errors.push(e.message));
 const base='http://127.0.0.1:8000';
 async function fresh(file='index.html'){await page.goto(base+'/'+file);await page.evaluate(()=>sessionStorage.clear());await page.reload();}
 async function reveal(selector){for(let i=0;i<100;i++){if(await page.locator(selector).isVisible())return;if(await page.locator('#deckNext').isDisabled())break;await page.locator('#deckNext').click();}throw Error('Unreachable '+selector);}
 async function stage(id,step){await page.locator('#'+id+' .advance-scene').click();assert.equal(await page.locator('#'+id).getAttribute('data-step'),String(step));}
 try{
  for(const file of ['index.html','unidad3.html']){await fresh(file);assert.equal(await page.locator('.learning-game').count(),9);assert.equal((await page.evaluate(()=>presentationState())).index,0);await reveal('#escena-homomorfismo');}
  await fresh();await reveal('#escena-cerradura');await stage('escena-cerradura',1);assert.match(await page.locator('#escena-cerradura .scene-message').innerText(),/no es una operación cerrada/);await stage('escena-cerradura',2);assert.match(await page.locator('#escena-cerradura .scene-message').innerText(),/sí es cerrada/);
  await reveal('#escena-cayley');await stage('escena-cayley',1);assert.equal(await page.locator('#escena-cayley .marked').count(),1);assert.equal(await page.locator('#escena-cayley .marked').innerText(),'3');await stage('escena-cayley',2);assert.equal(await page.locator('#escena-cayley .marked').count(),7);
  await reveal('#escena-homomorfismo');await stage('escena-homomorfismo',1);assert.match(await page.locator('#escena-homomorfismo .scene-visual').innerText(),/4 \+ 5 = 9/);await stage('escena-homomorfismo',2);assert.match(await page.locator('#escena-homomorfismo .scene-visual').innerText(),/g\(9\) = 3/);
  await reveal('#escena-gramatica');await page.locator('.grammar-wrap').click();await page.locator('.grammar-finish').click();assert.match(await page.locator('#escena-gramatica .scene-message').innerText(),/Objetivo logrado/);assert.equal(await page.locator('#escena-gramatica .scene-chips').textContent(),'aabb');
  await reveal('#escena-triangulo');await stage('escena-triangulo',1);await stage('escena-triangulo',2);assert.deepEqual(await page.locator('#escena-triangulo .tri-token.first').evaluateAll(es=>es.map(e=>e.dataset.to)),['2','1']);
  await reveal('#escena-lagrange');await stage('escena-lagrange',1);await stage('escena-lagrange',2);assert.match(await page.locator('#escena-lagrange .scene-message').innerText(),/6 = 2 · 3/);
  await reveal('#escena-distributiva');assert.equal(await page.locator('#escena-distributiva .packages .dot-box').count(),3);assert.equal(await page.locator('#escena-distributiva .packages i').count(),18);assert.equal(await page.locator('#escena-distributiva .gold-dot').count(),12);await stage('escena-distributiva',1);assert.match(await page.locator('#escena-distributiva .scene-visual').innerText(),/18/);await stage('escena-distributiva',2);assert.match(await page.locator('#escena-distributiva .scene-message').innerText(),/6 \+ 12 = 18/);
  await reveal('#escena-residuos');for(let s=1;s<=3;s++)await stage('escena-residuos',s);assert.match(await page.locator('#escena-residuos .scene-visual').innerText(),/23 \+ 41 = 64/);
  await reveal('#escena-codigo');await page.locator('#escena-codigo [data-bit="0"]').click();assert.match(await page.locator('#escena-codigo .scene-message').innerText(),/detecta error/);await page.locator('#escena-codigo [data-bit="1"]').click();assert.match(await page.locator('#escena-codigo .scene-message').innerText(),/pasar inadvertido/);await page.locator('[data-code="rep"]').click();await page.locator('#escena-codigo [data-bit="0"]').click();assert.match(await page.locator('#escena-codigo .scene-message').innerText(),/Mayoría → 1011/);await page.locator('#escena-codigo [data-bit="4"]').click();assert.match(await page.locator('#escena-codigo .scene-message').innerText(),/corrección falló/);await page.locator('.reset-code').click();assert.equal(await page.locator('.code-bit.flipped').count(),0);
  console.log('PASS staged mathematics, homomorphism paths, S3 compositions, codes and reset');
  await fresh();const answers=[[1,1,1],[3,1],[1,0,0],[2,1],[2,1],[2,1],[1,1],null,[1,1,1]];
  for(let i=0;i<9;i++){
   await reveal('#juego-'+i);const g=page.locator('#juego-'+i);
   if(i===7){
    const f=g.locator('form');assert.equal(await f.evaluate(e=>e.checkValidity()),false);
    await f.locator('[name=r3]').fill('3');assert.equal(await f.evaluate(e=>e.checkValidity()),false);
    const results=await f.evaluate(f=>Array.from({length:105},(_,x)=>{if(f.hidden)f.reset();for(const m of [3,5,7])f.elements['r'+m].value=x%m;f.requestSubmit();return f.parentElement.querySelector('.oracle-result strong').textContent;}));
    assert.deepEqual(results,Array.from({length:105},(_,x)=>String(x)));assert.ok(!await f.isVisible());await g.locator('.oracle-again').click();assert.ok(await f.isVisible());console.log('PASS CRT: all 105 values, range validation and new-number state');continue;
   }
   assert.ok(await g.locator('.check-answer').isDisabled());
   for(let r=0;r<answers[i].length;r++){
    await g.locator('input[value="'+answers[i][r]+'"]').check();await g.locator('.check-answer').click();assert.match(await g.locator('.game-feedback').innerText(),/✓ Coincide/);assert.ok(!await g.locator('.vote-options').isVisible());
    if(r<answers[i].length-1)await g.locator('.next-round').click();
   }
   await g.locator('.reset-game').click();assert.ok(await g.locator('.check-answer').isDisabled());
  }
  const position=await page.evaluate(()=>presentationState());await page.reload();assert.equal((await page.evaluate(()=>presentationState())).key,position.key);
  await page.locator('#routeMode').selectOption('full');assert.equal((await page.evaluate(()=>presentationState())).mode,'full');await page.locator('#topicSelect').selectOption('s36');assert.equal(await page.locator('section.cur').getAttribute('id'),'s36');
  assert.deepEqual(errors,[]);console.log('PASS nine challenges, page persistence, reference navigation, no browser errors');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1});

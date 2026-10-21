const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox']});
for(const vp of [{width:1280,height:720},{width:390,height:844},{width:360,height:640},{width:320,height:568},{width:844,height:390}]){
 const p=await b.newPage({viewport:vp,reducedMotion:'reduce'});const errors=[];p.on('pageerror',e=>errors.push(e.message));await p.goto('http://127.0.0.1:8000/');const failures=[];
 async function inspect(stage){const row=await p.locator('main>section.cur').evaluate(e=>{const box=e.getBoundingClientRect(),kids=[...e.children].filter(k=>getComputedStyle(k).display!=='none').map(k=>k.getBoundingClientRect());return {h:e.scrollHeight-e.clientHeight,w:e.scrollWidth-e.clientWidth,top:Math.min(...kids.map(k=>k.top))-box.top,bottom:Math.max(...kids.map(k=>k.bottom))-box.bottom};});if(row.h>2||row.w>2||row.top< -1||row.bottom>1)failures.push({key:(await p.evaluate(()=>presentationState())).key,stage,...row});}
 for(let i=0;i<60;i++){
  await inspect('initial');
  const scene=p.locator('section.cur .advance-scene:visible');
  if(await scene.isVisible())for(let j=0;j<6&&!await scene.isDisabled();j++){await scene.click();await inspect('step'+j);}
  if(await p.locator('#maquinas').isVisible()){
    for(const op of ['minus','plus']){
      await p.locator('.machine-operation').selectOption(op);await p.locator('[name=machine-vote][value=different]').check();
      for(let n=0;n<3&&!await p.locator('.machine-run').isDisabled();n++){await p.locator('.machine-run').click();await inspect('machine-'+op+'-'+n);}
    }
  }
  if(await p.locator('#camino-inverso').isVisible()){
    await p.locator('.reset-journey').click();await p.locator('.start-journey').click();await inspect('journey-start');
    await p.locator('[data-add="0"]').click();await inspect('identity');await p.locator('.unlock-integers').click();await inspect('integers');await p.locator('[data-add="-3"]').click();await inspect('inverse');
  }
  if(await p.locator('#escena-gramatica').isVisible()){
    await p.locator('.grammar-wrap').click();await p.locator('.grammar-wrap').click();await inspect('grammar-intermediate');await p.locator('.grammar-finish').click();await inspect('grammar-finished');
  }
  if(await p.locator('#escena-codigo').isVisible()){
    await p.locator('[data-code="par"]').click();await p.locator('#escena-codigo [data-bit="0"]').click();await inspect('parity-error');await p.locator('[data-code="rep"]').click();await inspect('repeat-code');
    await p.locator('#escena-codigo [data-bit="0"]').click();await inspect('repeat-correct');await p.locator('#escena-codigo [data-bit="4"]').click();await inspect('repeat-failure');
  }
  if(await p.locator('#juego-7').isVisible()){
    const form=p.locator('#juego-7 form');await form.locator('[name=r3]').fill('2');await form.locator('[name=r5]').fill('4');await form.locator('[name=r7]').fill('6');await form.locator('[type=submit]').click();await inspect('oracle-answer');await p.locator('.oracle-again').click();
  }
  const game=p.locator('section.cur .learning-game:visible');
  if(await game.isVisible()&&await game.locator('input[type=radio]').count()){
   for(let j=0;j<4;j++){
    await game.locator('input[type=radio]').first().check();await game.locator('.check-answer').click();await inspect('answer'+j);
    if(await game.locator('.next-round').count()){await game.locator('.next-round').click();await inspect('round'+j);}else break;
   }
  }
  if(await p.locator('#deckNext').isDisabled())break;await p.locator('#deckNext').click();
 }
 await p.locator('#routeMode').selectOption('full');await p.locator('#topicSelect').selectOption('entrada');let pages=0;
 for(let i=0;i<400;i++){await inspect('reference');pages++;if(await p.locator('#deckNext').isDisabled())break;await p.locator('#deckNext').click();}
 console.log(vp,JSON.stringify({pages,failures,errors}));await p.close();if(failures.length||errors.length){await b.close();throw Error('Layout or browser errors at '+vp.width+'×'+vp.height);}
}await b.close()})().catch(e=>{console.error(e);process.exit(1)});

// The challenge must explain both transformations without relying on an earlier slide.
const {chromium}=require('playwright');
const assert=require('node:assert/strict');
(async()=>{
 const b=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox']});
 try{
  for(const viewport of [{width:1280,height:720},{width:390,height:844},{width:360,height:640},{width:320,height:568},{width:844,height:390}]){
   const p=await b.newPage({viewport,reducedMotion:'reduce'});const errors=[];p.on('pageerror',e=>errors.push(e.message));
   await p.goto('http://127.0.0.1:8000');await p.locator('#topicSelect').selectOption('s35');
   async function inspect(label){
    const m=await p.locator('main>section.cur').evaluate(e=>{const r=e.getBoundingClientRect(),kids=[...e.children].filter(k=>getComputedStyle(k).display!=='none').map(k=>k.getBoundingClientRect());return {h:e.scrollHeight-e.clientHeight,w:e.scrollWidth-e.clientWidth,top:Math.min(...kids.map(k=>k.top))-r.top,bottom:Math.max(...kids.map(k=>k.bottom))-r.bottom};});
    assert.ok(m.h<=2&&m.w<=2&&m.top>=-1&&m.bottom<=1,JSON.stringify({viewport,label,...m}));
   }
   while(!await p.locator('#escena-triangulo').isVisible())await p.locator('#deckNext').click();
   for(let i=0;i<3;i++){await inspect('scene'+i);if(i<2)await p.locator('#escena-triangulo .advance-scene').click();}
   await p.locator('#deckNext').click();const g=p.locator('#juego-4');
   for(const answers of [[2,1],[0,0]]){
    for(let i=0;i<2;i++){
     const instructions=g.locator('.triangle-instructions');assert.ok(await instructions.isVisible());
     assert.match(await instructions.innerText(),/120°/);assert.match(await instructions.innerText(),/tercio de vuelta hacia la derecha/);
     assert.match(await instructions.innerText(),/alrededor del centro/);assert.match(await instructions.innerText(),/Espejo vertical/);
     assert.match(await instructions.locator('li').first().innerText(),i===0?/Gira/:/Refleja/);
     await inspect('question'+i);await g.locator('input[value="'+answers[i]+'"]').check();await g.locator('.check-answer').click();await inspect('feedback'+i);
     if(i===0)await g.locator('.next-round').click();
    }
    await g.locator('.reset-game').click();
   }
   assert.deepEqual(errors,[]);
   await p.screenshot({path:'/tmp/triangulo-'+viewport.width+'.png'});
   console.log('PASS self-contained triangle instructions, both orders and layout',viewport);await p.close();
  }
 }finally{await b.close();}
})().catch(e=>{console.error(e);process.exitCode=1});

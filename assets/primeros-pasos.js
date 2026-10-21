/* First principles through objects and actions; no automatic slide advance. */
(() => {
  const section = document.getElementById('entrada');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const animate = async (el, frames, duration = 650) => {
    if (!el || reduced.matches) return;
    const motion = el.animate(frames, {duration, easing:'cubic-bezier(.22,.8,.25,1)'});
    try { await motion.finished; } catch (_) { /* A restarted activity cancels its own motion. */ }
  };
  const make = (id, html) => {
    const el=document.createElement('div');el.id=id;el.className='lab foundations';el.innerHTML=html;section.append(el);return el;
  };
  const machines=make('maquinas',`
    <div class="foundation-heading"><div><p class="tag">01 · El laboratorio de las dos máquinas</p><h2>¿Cambió el orden o la agrupación?</h2></div><span class="activity-mark" aria-hidden="true">A ⇄ B</span></div>
    <div class="machine-toolbar"><div class="machine-tabs" role="group" aria-label="Qué cambia"><button class="btn on" data-kind="order" aria-pressed="true">1. Cambiar el orden</button><button class="btn" data-kind="group" aria-pressed="false">2. Mover paréntesis</button></div><div class="machine-tabs" role="group" aria-label="Operación de las máquinas"><button class="btn on" data-op="minus" aria-pressed="true">Resta −</button><button class="btn" data-op="plus" aria-pressed="false">Suma +</button></div></div>
    <p class="machine-mission"></p>
    <div class="machine-pair">${['A','B'].map((name,i)=>`<article class="operation-machine" data-machine="${i}"><div class="machine-label"><span class="machine-led" aria-hidden="true"></span>Máquina ${name}<span class="machine-instruction"></span></div><div class="machine-belt"><div class="group-band" aria-hidden="true"></div><div class="number-tiles"></div></div><div class="machine-output"><span class="output-caption">Salida</span><output class="output-number" aria-label="Resultado de máquina ${name}">?</output></div></article>`).join('')}</div>
    <fieldset class="machine-vote"><legend>Antes de ejecutar, voten: ¿darán lo mismo?</legend><label><input type="radio" name="machine-vote" value="same">Sí, el mismo resultado</label><label><input type="radio" name="machine-vote" value="different">No, resultados distintos</label></fieldset>
    <div class="machine-step" role="status" aria-live="polite"></div>
    <div class="foundation-actions"><button class="btn primary machine-run" disabled>Poner a prueba →</button><button class="btn machine-reset">Repetir experimento</button><span class="step-dots" aria-label="Paso 1 de 3"><i class="active"></i><i></i><i></i></span></div>
    <p class="foundation-note">Un contraejemplo basta para refutar una propiedad. Un caso que coincide no prueba que funcione siempre.</p>
  `);
  let kind='order', op='minus', step=0, vote=null, busy=false, version=0;
  const rows=[...machines.querySelectorAll('.operation-machine')];
  const signed = n => n < 0 ? '−'+Math.abs(n) : String(n);
  const operation = (a,b) => op==='minus' ? a-b : a+b;
  const symbol = () => op==='minus'?'−':'+';
  const tile = (id,value,type='number')=>`<span class="number-tile ${type}" data-tile="${id}">${value}</span>`;
  function fillTiles(row, values){row.querySelector('.number-tiles').innerHTML=values.map(v=>tile(...v)).join('');}
  function band(row,start,end){
    const belt=row.querySelector('.machine-belt'),tiles=[...row.querySelectorAll('.number-tile')];
    const strip=row.querySelector('.group-band');strip.hidden=kind!=='group';
    if(kind!=='group')return;
    const left=tiles[start].getBoundingClientRect(),right=tiles[end].getBoundingClientRect(),box=belt.getBoundingClientRect();
    strip.style.left=(left.left-box.left-5)+'px';strip.style.width=(right.right-left.left+10)+'px';
  }
  function positionBands(){if(step<2 && !machines.classList.contains('off'))rows.forEach((r,i)=>{const right=i===1&&machines.dataset.phase!=='predict';band(r,right?2:0,right?4:2);});}
  function reset(){
    version++;machines.getAnimations({subtree:true}).forEach(a=>a.cancel());step=0;vote=null;busy=false;
    machines.dataset.phase='predict';machines.querySelectorAll('[name="machine-vote"]').forEach(r=>{r.checked=false;r.disabled=false;});
    machines.querySelectorAll('[data-kind]').forEach(b=>{const on=b.dataset.kind===kind;b.classList.toggle('on',on);b.setAttribute('aria-pressed',on);});
    machines.querySelectorAll('[data-op]').forEach(b=>{const on=b.dataset.op===op;b.classList.toggle('on',on);b.setAttribute('aria-pressed',on);});
    machines.querySelector('.machine-mission').textContent=kind==='order'?'Mismos números. En B intercambiaremos las tarjetas 8 y 3. ¿Se conservará la salida?':'Mismos números y mismo orden: 8, 3, 2. Solo cambiaremos qué pareja se calcula primero.';
    rows.forEach((row,i)=>{
      row.classList.remove('processing','finished');
      row.querySelector('.machine-instruction').textContent=kind==='order'?(i?'intercambiar':'conservar orden'):(i?'primero 3 '+symbol()+' 2':'primero 8 '+symbol()+' 3');
      fillTiles(row,kind==='order'?[['a',8],['op',symbol(),'operator'],['b',3]]:[['a',8],['op1',symbol(),'operator'],['b',3],['op2',symbol(),'operator'],['c',2]]);
      row.querySelector('.output-number').textContent='?';
      row.querySelector('.group-band').hidden=kind!=='group';
    });
    machines.querySelector('.machine-step').textContent='Elijan una predicción. Después ejecuten las máquinas paso a paso.';
    const run=machines.querySelector('.machine-run');run.disabled=true;run.textContent='Poner a prueba →';
    updateDots();requestAnimationFrame(positionBands);
  }
  function updateDots(){machines.querySelectorAll('.step-dots i').forEach((dot,i)=>dot.classList.toggle('active',i<=step));machines.querySelector('.step-dots').setAttribute('aria-label',`Paso ${Math.min(step+1,3)} de 3`);}
  machines.querySelectorAll('[data-kind]').forEach(b=>b.addEventListener('click',()=>{kind=b.dataset.kind;reset();}));
  machines.querySelectorAll('[data-op]').forEach(b=>b.addEventListener('click',()=>{op=b.dataset.op;reset();}));
  machines.querySelectorAll('[name="machine-vote"]').forEach(r=>r.addEventListener('change',()=>{vote=r.value;machines.querySelector('.machine-run').disabled=false;}));
  machines.querySelector('.machine-reset').addEventListener('click',reset);
  async function swapCards(row){
    const tiles=row.querySelector('.number-tiles'),a=tiles.querySelector('[data-tile=a]'),b=tiles.querySelector('[data-tile=b]');
    const x1=a.getBoundingClientRect().left,x2=b.getBoundingClientRect().left;
    tiles.insertBefore(b,a);tiles.append(a);
    await Promise.all([animate(a,[{transform:`translate(${x1-x2}px,-8px)`},{transform:'translate(0,0)'}],800),animate(b,[{transform:`translate(${x2-x1}px,8px)`},{transform:'translate(0,0)'}],800)]);
  }
  machines.querySelector('.machine-run').addEventListener('click',async()=>{
    if(busy||!vote||step>=3)return;
    if(step===2){
      busy=true;const token=version;machines.querySelector('.machine-run').disabled=true;
      await finish(token);if(token!==version)return;step=3;busy=false;updateDots();return;
    }
    busy=true;const token=version;
    const run=machines.querySelector('.machine-run');run.disabled=true;
    machines.querySelectorAll('[name="machine-vote"]').forEach(r=>r.disabled=true);
    rows.forEach(r=>r.classList.add('processing'));
    if(step===0){
      machines.dataset.phase='execute';
      machines.querySelector('.machine-step').textContent=kind==='order'?'La máquina B intercambia las tarjetas; A conserva su orden.':'Los corchetes señalan qué operación se resuelve primero en cada máquina.';
      if(kind==='order')await swapCards(rows[1]);
      else { positionBands(); await Promise.all(rows.map(r=>animate(r.querySelector('.group-band'),[{opacity:.3,transform:'translateY(5px)'},{opacity:1,transform:'translateY(0)'}]))); }
      if(token!==version)return;
      step=1;run.textContent=kind==='order'?'Calcular y comparar →':'Resolver las parejas →';
    }else{
      if(kind==='group'){
        const values=[operation(8,3),operation(3,2)];
        await Promise.all(rows.map(r=>animate(r.querySelector('.number-tiles'),[{transform:'scale(1)'},{transform:'scale(.94)',opacity:.3}],350)));
        if(token!==version)return;
        rows.forEach((row,i)=>{row.querySelector('.group-band').hidden=true;fillTiles(row,i===0?[['ab',signed(values[0])],['op',symbol(),'operator'],['c',2]]:[['a',8],['op',symbol(),'operator'],['bc',signed(values[1])]]);});
        machines.querySelector('.machine-step').textContent=`Primera pareja resuelta: A queda en ${signed(values[0])} ${symbol()} 2; B queda en 8 ${symbol()} ${signed(values[1])}.`;
        await Promise.all(rows.map(r=>animate(r.querySelector('.number-tiles'),[{opacity:0,transform:'translateY(8px)'},{opacity:1,transform:'translateY(0)'}])));
        if(token!==version)return;
        // Explicit third click leaves the intermediate expressions available for discussion.
        step=2;run.textContent='Comparar las salidas →';run.disabled=false;busy=false;updateDots();rows.forEach(r=>r.classList.remove('processing'));return;
      }
      await finish(token);if(token!==version)return;step=3;
    }
    if(token!==version)return;
    rows.forEach(r=>r.classList.remove('processing'));busy=false;run.disabled=step>=3;updateDots();
  });
  async function finish(token){
    const a=kind==='order'?operation(8,3):operation(operation(8,3),2);
    const b=kind==='order'?operation(3,8):operation(8,operation(3,2));
    rows.forEach((r,i)=>{r.querySelector('.output-number').textContent=signed(i?b:a);r.classList.add('finished');});
    await Promise.all(rows.map(r=>animate(r.querySelector('.output-number'),[{transform:'scale(.55)',opacity:0},{transform:'scale(1.12)',opacity:1},{transform:'scale(1)',opacity:1}],500)));
    if(token!==version)return;
    const same=a===b,correct=(vote==='same')===same;
    const property=kind==='order'?'conmutatividad':'asociatividad';
    machines.dataset.phase='done';
    machines.querySelector('.machine-step').innerHTML=`<strong>${correct?'✓ Tu predicción coincide.':'Mira la diferencia.'} ${signed(a)} ${same?'=':'≠'} ${signed(b)}.</strong> ${same?'La suma cumple '+property+'; este caso la ilustra.':'La resta falla en '+property+': este contraejemplo es suficiente.'} <span>${kind==='order'?'Conmutar es cambiar el orden.':'Asociar es cambiar los paréntesis, conservando el orden.'}</span>`;
    const run=machines.querySelector('.machine-run');run.textContent='✓ Comparación terminada';run.disabled=true;
    rows.forEach(r=>r.classList.remove('processing'));
  }
  new ResizeObserver(positionBands).observe(machines);
  reset();

  const inverse=make('camino-inverso',`
    <div class="foundation-heading"><div><p class="tag">02 · El viaje de ida y vuelta</p><h2>¿Puedes deshacer el +3?</h2></div><span class="domain-badge">ℕ · solo naturales</span></div>
    <p class="inverse-mission">Partimos de 0. Sumar 3 nos lleva a la estación 3. El reto es volver a casa <strong>sumando una sola tarjeta</strong>.</p>
    <div class="journey-board"><svg viewBox="0 0 700 165" role="img" aria-label="Estaciones de menos tres a seis. Casa en cero; las estaciones negativas empiezan bloqueadas.">
      <defs><pattern id="lockStripes" width="8" height="8" patternUnits="userSpaceOnUse"><path d="M0 8L8 0" stroke="currentColor" stroke-opacity=".15"/></pattern></defs>
      <rect class="locked-territory" x="20" y="22" width="205" height="126" rx="16" fill="url(#lockStripes)"/>
      <text class="territory-label" x="120" y="18" text-anchor="middle">FUERA DE ℕ</text>
      <path d="M50 88H644" class="journey-rail"/>
      ${Array.from({length:10},(_,i)=>i-3).map(v=>`<g class="station${v<0?' negative':''}${v===0?' home':''}" transform="translate(${50+(v+3)*66},88)"><circle r="${v===0?17:8}"/><text y="35" text-anchor="middle">${signed(v)}</text>${v===0?'<text y="-31" text-anchor="middle" class="home-label">CASA</text>':''}</g>`).join('')}
      <g class="traveler" style="transform:translate(248px,88px)"><circle r="20"/><text text-anchor="middle" y="6">0</text></g>
    </svg></div>
    <div class="journey-equation" aria-live="polite">0 <span>→</span> ¿?</div>
    <div class="inverse-cards" role="group" aria-label="Tarjetas que puedes sumar">${[0,1,3,-3].map(n=>`<button class="return-card" data-add="${n}" ${n===-3?'disabled':''}><span>${n>=0?'+':''}${signed(n)}</span><small>${n===-3?'Fuera de ℕ':'Sumar esta tarjeta'}</small></button>`).join('')}</div>
    <div class="inverse-feedback" role="status" aria-live="polite">Primero hagamos el viaje de ida.</div>
    <div class="foundation-actions"><button class="btn primary start-journey">Aplicar +3 →</button><button class="btn unlock-integers" disabled>Habilitar enteros ℤ</button><button class="btn reset-journey">Reiniciar</button></div>
    <p class="foundation-note">Aquí ℕ incluye el 0. La identidad no cambia el valor; el inverso permite deshacerlo.</p>
  `);
  let phase='ready',integers=false,travelBusy=false,travelVersion=0,position=0;
  const traveler=inverse.querySelector('.traveler');
  const feedback=inverse.querySelector('.inverse-feedback');
  const start=inverse.querySelector('.start-journey');
  const unlock=inverse.querySelector('.unlock-integers');
  const cards=[...inverse.querySelectorAll('[data-add]')];
  function syncCards(){cards.forEach(c=>c.disabled=travelBusy||phase==='ready'||phase==='done'||(+c.dataset.add<0&&!integers));}
  async function travel(to,token){
    const from=position;position=to;
    const transform=v=>`translate(${50+(v+3)*66}px,88px)`;
    traveler.style.transform=transform(to);traveler.querySelector('text').textContent=signed(to);
    await animate(traveler,[{transform:transform(from)},{transform:transform(to)}],850);
    return token===travelVersion;
  }
  function resetJourney(){
    travelVersion++;inverse.getAnimations({subtree:true}).forEach(a=>a.cancel());phase='ready';integers=false;travelBusy=false;position=0;
    inverse.dataset.domain='natural';inverse.classList.remove('arrived');traveler.style.transform='translate(248px,88px)';traveler.querySelector('text').textContent='0';
    inverse.querySelector('.domain-badge').textContent='ℕ · solo naturales';inverse.querySelector('.territory-label').textContent='FUERA DE ℕ';
    inverse.querySelector('.journey-equation').innerHTML='0 <span>→</span> ¿?';feedback.textContent='Primero hagamos el viaje de ida.';
    cards.forEach(c=>{c.classList.remove('tried','winning');c.querySelector('small').textContent=+c.dataset.add<0?'Fuera de ℕ':'Sumar esta tarjeta';});
    start.disabled=false;start.hidden=false;unlock.disabled=true;unlock.hidden=false;syncCards();
  }
  start.addEventListener('click',async()=>{
    if(travelBusy)return;travelBusy=true;start.disabled=true;const token=travelVersion;
    inverse.querySelector('.journey-equation').innerHTML='0 + 3 <span>→</span> 3';
    if(!await travel(3,token))return;
    phase='choose';travelBusy=false;start.hidden=true;feedback.textContent='Ahora elige una tarjeta para sumar desde 3. ¿Cuál nos devuelve a 0?';syncCards();
  });
  cards.forEach(c=>c.addEventListener('click',async()=>{
    if(c.disabled||travelBusy)return;travelBusy=true;const token=travelVersion;syncCards();unlock.disabled=true;
    // Each experiment starts at the same checkpoint, so the inverse is always of +3.
    traveler.style.transform='translate(446px,88px)';position=3;
    const value=+c.dataset.add,target=3+value;
    inverse.querySelector('.journey-equation').innerHTML=`3 + (${signed(value)}) <span>→</span> ${target}`;
    c.classList.add('tried');
    if(!await travel(target,token))return;
    travelBusy=false;
    if(target===0){
      phase='done';inverse.classList.add('arrived');c.classList.add('winning');feedback.innerHTML='<strong>✓ Volvimos a casa: 3 + (−3) = 0.</strong> −3 pertenece a ℤ, pero no a ℕ. Por eso (ℕ, +) no es grupo y (ℤ, +) sí lo es.';unlock.hidden=true;
      await animate(inverse.querySelector('.station.home circle'),[{transform:'scale(1)'},{transform:'scale(1.65)'},{transform:'scale(1)'}],600);
      if(token!==travelVersion)return;
    }else{
      feedback.innerHTML=`<strong>${value===0?'0 es identidad: seguimos en 3.':'Llegamos a '+target+', no a 0.'}</strong> Sumar un natural a 3 nunca lo hace menor. ${integers?'Prueba −3.':'Necesitamos un número que no está en ℕ.'} <span>Cada intento vuelve a partir de 3.</span>`;
      unlock.disabled=integers;
    }
    syncCards();
  }));
  unlock.addEventListener('click',()=>{
    if(travelBusy)return;integers=true;inverse.dataset.domain='integer';inverse.querySelector('.domain-badge').textContent='ℤ · enteros habilitados';inverse.querySelector('.territory-label').textContent='AHORA DENTRO DE ℤ';
    traveler.style.transform='translate(446px,88px)';position=3;inverse.querySelector('.journey-equation').innerHTML='3 + ¿? <span>→</span> 0';
    cards.find(c=>+c.dataset.add===-3).querySelector('small').textContent='Ya pertenece al conjunto';unlock.disabled=true;
    feedback.textContent='Ampliamos el conjunto a ℤ. La tarjeta −3 ya se puede usar. ¿Qué hará con el +3?';syncCards();
    animate(cards.find(c=>+c.dataset.add===-3),[{transform:'translateY(8px)',opacity:.3},{transform:'translateY(0)',opacity:1}],600);
  });
  inverse.querySelector('.reset-journey').addEventListener('click',resetJourney);resetJourney();
})();

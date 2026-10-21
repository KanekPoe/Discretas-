/* Bounded presentation: semantic steps on the live route, paged reading in reference. */
(() => {
  const root=document.documentElement;root.classList.add('slides');
  const header=document.querySelector('header.top'),bar=document.getElementById('deckBar'),mode=document.getElementById('routeMode');
  const close=document.createElement('section');close.id='cierre';close.dataset.name='Cierre';close.className='topic';
  close.innerHTML='<div class="scene" id="escena-cierre"><div class="scene-header"><p class="scene-eyebrow">Ambos · 54–60 min</p><h2>Explica con un ejemplo nuevo</h2></div><p class="scene-prompt"></p><div class="scene-visual"></div><p class="scene-message" role="status" aria-live="polite"></p><div class="scene-actions"></div></div>';
  document.querySelector('main.wrap').append(close);
  let closing=0,answer=false;
  const questions=[
    ['¿Un caso que funciona demuestra una propiedad?','Un contraejemplo basta para refutarla.','No. Una ley universal debe cumplirse para todos los elementos. Propón un caso distinto al de las máquinas.'],
    ['¿Basta el conjunto para clasificar una estructura?','Conjunto + operación + reglas','No. (ℤ, +) es grupo; (ℤ, ·) no lo es; (ℤ, +, ·) es un anillo. Explica qué cambió.'],
    ['¿Detectar significa poder corregir?','Paridad ≠ repetición triple','No. La paridad detecta un error de un bit sin localizarlo. La repetición triple puede corregirlo por mayoría.']
  ];
  function renderClose(){const q=questions[closing];close.querySelector('.scene-prompt').textContent=q[0];close.querySelector('.scene-visual').innerHTML='<div class="math-line" style="font-family:var(--f-body);font-size:24px">'+(answer?q[1]:'Piénsalo → da un ejemplo → explica')+'</div>';close.querySelector('.scene-message').textContent=answer?q[2]:'Escuchen una respuesta del público antes de abrir la explicación.';close.querySelector('.scene-actions').innerHTML='<button class="btn primary close-answer">'+(answer?'Siguiente pregunta →':'Ver la explicación')+'</button><span class="scene-counter">'+(closing+1)+' / 3</span>';close.querySelector('.close-answer').onclick=()=>{if(answer){closing=(closing+1)%3;answer=false;}else answer=true;renderClose();};}renderClose();
  const sections=[...document.querySelectorAll('main.wrap > section')];
  const topicPicker=document.createElement('label');topicPicker.className='topic-picker';topicPicker.innerHTML='Tema <select id="topicSelect" aria-label="Ir a un tema">'+sections.map(s=>`<option value="${s.id}">${s.dataset.name}</option>`).join('')+'</select>';
  const topControls=document.createElement('div');topControls.className='top-controls';header.querySelector('.wrap').append(topControls);topControls.append(topicPicker,document.querySelector('.presentation-toolbar'));
  mode.options[1].textContent='Referencia · por páginas';
  const definitions={};
  // Preserve reference prose as semantic units, without copying interactive controls or duplicate nodes.
  function readUnits(el){
    if(el.matches('script,style,svg,canvas,button,input,select,.scene,.foundations,.learning-game,.plab,.head'))return [];
    if(el.matches('table')){
      const heads=[...el.querySelectorAll('thead th')].map(x=>x.textContent.trim());
      return [...el.querySelectorAll('tbody tr')].map(row=>[...row.children].map((c,i)=>(heads[i]?heads[i]+': ':'')+c.textContent.trim()).join(' · '));
    }
    if(el.matches('dl'))return [...el.querySelectorAll('dt')].map(dt=>dt.textContent.trim()+': '+(dt.nextElementSibling?.textContent.trim()||''));
    if(el.matches('p,li,h3,summary,.out,.verdict'))return [el.textContent.trim()];
    return [...el.children].flatMap(readUnits);
  }
  sections.forEach(sec=>{
    const units=[...sec.children].filter(el=>el.matches('.block,.app,.lab,.quiz')).flatMap(readUnits).filter(s=>s.length>2);
    definitions[sec.id]=units;
  });
  let slides=[],cur=0,readerNodes=[];
  function add(section,selector,stage,extra={}){const sec=document.getElementById(section),el=sec.querySelector(selector);if(el)slides.push({sec,show:[el],stage,key:extra.key||selector.slice(1),...extra});}
  const unitsFor=(sec)=>{
    const limit=innerWidth<400||innerHeight<650?42:75;
    const pages=[];let page=[],count=0;
    definitions[sec.id].forEach(text=>{
      const words=text.split(/\s+/);
      if(page.length&&count+words.length>limit){pages.push(page.join('\n\n'));page=[];count=0;}
      while(words.length>limit)pages.push(words.splice(0,limit).join(' '));
      if(words.length){page.push(words.join(' '));count+=words.length;}
    });
    if(page.length)pages.push(page.join('\n\n'));return pages;
  };
  function reference(sec){
    unitsFor(sec).forEach((text,i)=>{
      const el=document.createElement('article');el.className='reference-page';
      const label=document.createElement('p');label.className='reference-label';label.textContent='Ampliación opcional · '+(i+1);
      const heading=document.createElement('h2');heading.textContent=sec.querySelector('.head h2')?.textContent||sec.dataset.name;
      const p=document.createElement('p');p.textContent=text;el.append(label,heading,p);sec.append(el);readerNodes.push(el);
      slides.push({sec,show:[el],stage:'Referencia · una idea por página',key:'ref-'+sec.id+'-'+i});
    });
  }
  function build(full){
    readerNodes.forEach(n=>n.remove());readerNodes=[];slides=[];
    const intro=document.getElementById('inicio');
    const introKids=[...intro.children].filter(k=>!k.querySelector('#onionWrap')&&!k.matches('.learning-game,.scene,.reference-page'));
    slides.push({sec:intro,show:introKids,stage:'Apertura',key:'apertura'});
    add('entrada','#escena-cerradura','Cerradura · resultado dentro o fuera');
    add('entrada','#maquinas','Conmutativa · cambia el orden',{kind:'order',key:'conmutativa'});
    add('entrada','#maquinas','Asociativa · cambia los paréntesis',{kind:'group',key:'asociativa'});
    add('entrada','#camino-inverso','Identidad e inverso · volver a cero');
    const map=intro.querySelector('#onionWrap').parentElement;
    slides.push({sec:intro,show:[map],stage:'Mapa · una operación',key:'mapa-una',map:'one'});
    slides.push({sec:intro,show:[map],stage:'Mapa · dos operaciones',key:'mapa-dos',map:'two'});
    add('inicio','#juego-0','Pasaporte · clasificar con evidencia');
    if(full){reference(document.getElementById('entrada'));reference(intro);}
    const route={s31:['escena-cayley','escena-homomorfismo'],s32:['escena-cadenas'],s33:['escena-gramatica'],s35:['escena-triangulo'],lagrange:['escena-lagrange'],anillos:['escena-distributiva','escena-anillo'],s36:['escena-residuos'],s37:['escena-codigo']};
    Object.entries(route).forEach(([id,demos])=>{
      const sec=document.getElementById(id);add(id,':scope > .head','La idea esencial',{key:'idea-'+id});
      demos.forEach(demo=>add(id,'#'+demo,document.getElementById(demo).querySelector('h2').textContent));
      add(id,'.learning-game','Predice → comprueba → explica',{key:'reto-'+id});
      if(full)reference(sec);
    });
    add('cierre','#escena-cierre','Recupera las ideas y responde preguntas');
  }
  function setVars(){root.style.setProperty('--hdr',header.offsetHeight+'px');root.style.setProperty('--bar',bar.offsetHeight+'px');}
  function go(i,save=true){
    cur=Math.max(0,Math.min(slides.length-1,i));const sl=slides[cur];
    sections.forEach(sec=>{const active=sec===sl.sec;sec.classList.toggle('cur',active);sec.setAttribute('aria-hidden',String(!active));[...sec.children].forEach(k=>{k.classList.toggle('off',!active||!sl.show.includes(k));k.style.zoom='';});sec.classList.remove('compact');});
    root.dataset.map=sl.map||'';
    if(sl.kind){const machine=document.getElementById('maquinas');if(machine.dataset.kind!==sl.kind)machine.querySelector('[data-kind="'+sl.kind+'"]').click();}
    document.getElementById('deckPrev').disabled=cur===0;const next=document.getElementById('deckNext');next.disabled=cur===slides.length-1;next.textContent=cur===slides.length-1?'Fin':'Sigue →';
    document.getElementById('deckInfo').textContent=`${cur+1} / ${slides.length} · ${sl.stage}`;
    const p=window.expositionPlan[sl.sec.id];document.getElementById('speakerCue').textContent=mode.value==='full'?'Referencia':p?`Expositor ${p.speaker} · ${p.time}`:'Ambos · 54–60 min';
    document.getElementById('where').textContent=sl.sec.dataset.name;document.getElementById('topicSelect').value=sl.sec.id;
    document.querySelectorAll('#nav a').forEach(a=>a.classList.toggle('on',a.hash==='#'+sl.sec.id));document.getElementById('progress').style.width=((cur+1)/slides.length*100)+'%';
    setVars();window.dispatchEvent(new Event('resize'));
    if(save){try{sessionStorage.setItem('discretas-position',JSON.stringify({key:sl.key,mode:mode.value}));}catch(_){} }
  }
  function selectMode(full,keep){root.dataset.route=full?'full':'live';build(full);const i=keep?slides.findIndex(s=>s.key===keep.key):-1;go(i>=0?i:0);}
  mode.onchange=()=>selectMode(mode.value==='full',slides[cur]);
  document.getElementById('deckPrev').onclick=()=>go(cur-1);document.getElementById('deckNext').onclick=()=>go(cur+1);
  function topic(id){const i=slides.findIndex(s=>s.sec.id===id);if(i>=0)go(i);}
  document.getElementById('topicSelect').onchange=e=>topic(e.target.value);
  document.getElementById('nav').addEventListener('click',e=>{const a=e.target.closest('a');if(a){e.preventDefault();topic(a.hash.slice(1));}},true);
  addEventListener('keydown',e=>{if(document.querySelector('dialog[open]')||e.defaultPrevented||e.altKey||e.ctrlKey||e.metaKey||e.target.closest('input,select,textarea,[role="group"],[role="tablist"]'))return;if(['ArrowRight','PageDown'].includes(e.key)){e.preventDefault();go(cur+1);}if(['ArrowLeft','PageUp'].includes(e.key)){e.preventDefault();go(cur-1);}});
  let lastWidth=innerWidth,lastHeight=innerHeight,resizeTimer;
  addEventListener('resize',()=>{setVars();if(lastWidth===innerWidth&&lastHeight===innerHeight)return;lastWidth=innerWidth;lastHeight=innerHeight;if(mode.value==='full'){clearTimeout(resizeTimer);resizeTimer=setTimeout(()=>selectMode(true,slides[cur]),100);}});
  if('ResizeObserver'in window){new ResizeObserver(setVars).observe(header);new ResizeObserver(setVars).observe(bar);}
  let remembered;try{remembered=JSON.parse(sessionStorage.getItem('discretas-position'));}catch(_){}
  mode.value=remembered?.mode==='full'?'full':'live';selectMode(mode.value==='full',remembered);
  // Read-only hooks let tests inspect every frame without bypassing the user navigation.
  window.presentationState=()=>({index:cur,key:slides[cur].key,total:slides.length,mode:mode.value});
})();

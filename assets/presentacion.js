(() => {
  const root=document.documentElement;root.classList.add('slides');
  const header=document.querySelector('header.top'),bar=document.getElementById('deckBar');
  const mode=document.getElementById('routeMode');
  const close=document.createElement('section');close.id='cierre';close.dataset.name='Cierre y preguntas';close.className='topic';
  close.innerHTML='<div class="head"><p class="eyebrow">54–60 min · Ambos expositores</p><h2>Tres ideas para llevarnos</h2><p class="lead">Pidan una explicación con un ejemplo antes de abrir la respuesta.</p></div><div class="block"><details><summary>¿Un caso que funciona demuestra una propiedad?</summary><p>No. Una ley universal debe valer para todos los elementos; un contraejemplo basta para refutarla.</p></details><details><summary>¿El conjunto basta para clasificar una estructura?</summary><p>No. (ℤ, +) es un grupo abeliano; (ℤ, ·) no es grupo; (ℤ, +, ·) es un anillo y un dominio entero.</p></details><details><summary>¿Detectar significa poder corregir?</summary><p>No. La paridad detecta cualquier error de un bit, pero no lo localiza. La repetición triple puede corregirlo por mayoría.</p></details><p class="key-idea">De los axiomas a las aplicaciones: comprueba qué garantiza cada estructura y qué queda fuera de esa garantía.</p></div>';
  document.querySelector('main.wrap').append(close);
  const sections=[...document.querySelectorAll('main.wrap > section')];
  const originalKids=new Map(sections.map(s=>[s,[...s.children]]));
  let slides=[],cur=0;
  function add(sec,show,stage,compact=false){slides.push({sec,show:show.filter(Boolean),stage,compact});}
  function build(live){
    slides=[];
    if(live){
      const intro=document.getElementById('inicio');
      add(intro,originalKids.get(intro).filter(k=>!k.querySelector('#onionWrap')&&!k.matches('.learning-game')),'Apertura');
      const props=document.getElementById('entrada');
      add(props,[props.querySelector('#maquinas')],'Predice y ejecuta las dos máquinas');
      add(props,[props.querySelector('#camino-inverso')],'Deshacer sin salir del conjunto');
      add(intro,[intro.querySelector('#onionWrap').parentElement],'Mapa de estructuras');
      add(intro,[intro.querySelector('.learning-game')],'Predice → comprueba → explica');
      sections.filter(s=>!['entrada','inicio','cierre'].includes(s.id)).forEach(sec=>{
        const head=sec.querySelector(':scope > .head');
        add(sec,[head],'La idea esencial');
        add(sec,[head,sec.querySelector('[data-route-lab]')],'Demuestra y pregunta',true);
        if(sec.id==='s31')add(sec,[head,sec.querySelector('#hA').closest('.lab')],'Homomorfismo: dos caminos, un resultado',true);
        add(sec,[head,sec.querySelector('.learning-game')],'Predice → comprueba → explica',true);
      });
      add(close,originalKids.get(close),'Recupera las ideas y responde preguntas');
    }else{
      sections.forEach(sec=>{
        const kids=originalKids.get(sec),head=sec.querySelector(':scope > .head');
        if(sec.classList.contains('topic')){
          add(sec,[head],'Concepto');kids.filter(k=>k!==head).forEach(k=>add(sec,[head,k],k.matches('.learning-game')?'Reto participativo':'Consulta',true));
        }else if(sec.id==='inicio'){
          add(sec,kids.filter(k=>!k.querySelector('#onionWrap')&&!k.matches('.learning-game')),'Apertura');
          kids.filter(k=>k.querySelector('#onionWrap')||k.matches('.learning-game')).forEach(k=>add(sec,[k],'Mapa y reto'));
        }else kids.forEach(k=>add(sec,[k],k.id==='maquinas'?'Orden y agrupación':k.id==='camino-inverso'?'El inverso':'Laboratorio de gráficas'));
      });
    }
  }
  function setVars(){root.style.setProperty('--hdr',header.offsetHeight+'px');root.style.setProperty('--bar',bar.offsetHeight+'px');}
  function go(i){
    cur=Math.max(0,Math.min(slides.length-1,i));const sl=slides[cur];
    sections.forEach(sec=>{
      sec.classList.toggle('cur',sec===sl.sec);sec.setAttribute('aria-hidden',String(sec!==sl.sec));
      originalKids.get(sec).forEach(k=>{k.classList.toggle('off',sec!==sl.sec||!sl.show.includes(k));k.style.zoom='';});
    });
    sl.sec.classList.toggle('compact',sl.compact);sl.sec.scrollTop=0;
    document.getElementById('deckPrev').disabled=cur===0;
    const next=document.getElementById('deckNext');next.disabled=cur===slides.length-1;next.textContent=cur===slides.length-1?'Fin':'Sigue →';
    document.getElementById('deckInfo').textContent=`${cur+1} / ${slides.length} · ${sl.stage}`;
    const p=window.expositionPlan[sl.sec.id];document.getElementById('speakerCue').textContent=p?`Expositor ${p.speaker} · ${p.time}`:'Ambos · 54–60 min';
    document.getElementById('where').textContent=sl.sec.dataset.name;
    document.querySelectorAll('#nav a').forEach(a=>{
      const on=a.getAttribute('href')==='#'+sl.sec.id;a.classList.toggle('on',on);
      if(on){a.setAttribute('aria-current','step');a.scrollIntoView({block:'nearest',inline:'nearest'});}else a.removeAttribute('aria-current');
    });
    document.getElementById('progress').style.width=((cur+1)/slides.length*100)+'%';
    setVars();window.dispatchEvent(new Event('resize'));
  }
  function selectMode(live,keep){
    root.dataset.route=live?'live':'full';build(live);
    const i=keep?slides.findIndex(s=>s.sec===keep.sec&&keep.show.some(k=>s.show.includes(k))):-1;
    go(i>=0?i:0);
  }
  mode.addEventListener('change',()=>selectMode(mode.value==='live',slides[cur]));
  document.getElementById('deckPrev').addEventListener('click',()=>go(cur-1));
  document.getElementById('deckNext').addEventListener('click',()=>go(cur+1));
  function navigateTo(target){
    let i=slides.findIndex(s=>s.sec===target||s.show.some(k=>k===target||k.contains(target)));
    if(i<0){mode.value='full';selectMode(false);i=slides.findIndex(s=>s.sec===target||s.show.some(k=>k===target||k.contains(target)));}
    if(i>=0)go(i);
  }
  document.getElementById('nav').addEventListener('click',e=>{const a=e.target.closest('a');if(!a)return;e.preventDefault();navigateTo(document.getElementById(a.hash.slice(1)));},true);
  document.querySelector('main.wrap').addEventListener('click',e=>{const a=e.target.closest('a[href^="#"]');if(!a)return;const t=document.getElementById(a.hash.slice(1));if(t){e.preventDefault();navigateTo(t);}});
  addEventListener('keydown',e=>{
    if(document.querySelector('dialog[open]')||e.defaultPrevented||e.altKey||e.ctrlKey||e.metaKey||e.target.closest('input,select,textarea,[role="tablist"],[role="group"]'))return;
    if(['ArrowRight','PageDown'].includes(e.key)){e.preventDefault();go(cur+1);}
    if(['ArrowLeft','PageUp'].includes(e.key)){e.preventDefault();go(cur-1);}
  });
  addEventListener('resize',setVars);
  if('ResizeObserver'in window){new ResizeObserver(setVars).observe(header);new ResizeObserver(setVars).observe(bar);}
  selectMode(true);
})();

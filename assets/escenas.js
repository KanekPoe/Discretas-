/* Fixed-size teaching scenes: each click changes one mathematical step. */
(() => {
  const scenes={};
  const mod=(n,m)=>((n%m)+m)%m;
  const chip=(n,c='')=>`<span class="scene-chip ${c}">${n}</span>`;
  const math=s=>`<div class="math-line">${s}</div>`;
  const line=(a,op,b,result='?')=>math(`${a} ${op} ${b} = ${result}`);
  function mount(section,id,title,property){
    const el=document.createElement('div');el.id=id;el.className='scene';
    el.innerHTML=`<div class="scene-header"><p class="scene-eyebrow">${property}</p><h2>${title}</h2></div><p class="scene-prompt"></p><div class="scene-visual"></div><p class="scene-message" role="status" aria-live="polite"></p><div class="scene-actions"></div>`;
    document.getElementById(section).append(el);scenes[id]=el;return el;
  }
  function stageScene(section,id,title,property,frames){
    const el=mount(section,id,title,property);let step=0;
    function render(){
      const f=frames[step];el.dataset.step=step;
      el.querySelector('.scene-prompt').textContent=f.q;
      const visual=el.querySelector('.scene-visual');visual.classList.toggle('column',!!f.column);visual.innerHTML=f.visual;
      el.querySelector('.scene-message').textContent=f.note;
      el.querySelector('.scene-actions').innerHTML=`<button class="btn primary advance-scene" ${step===frames.length-1?'disabled':''}>${step===frames.length-1?'✓ Idea comprobada':f.action||'Ver el siguiente paso →'}</button><button class="btn restart-scene">Repetir</button><span class="scene-counter">${step+1} / ${frames.length}</span>`;
      el.querySelector('.advance-scene').onclick=()=>{if(step<frames.length-1){step++;render();}};
      el.querySelector('.restart-scene').onclick=()=>{step=0;render();};
      if(f.triangles)animateTriangles(visual,f.triangles);
      document.dispatchEvent(new CustomEvent('scenechange',{detail:{id}}));
    }
    render();return el;
  }
  stageScene('entrada','escena-cerradura','¿El resultado sigue dentro?','Propiedad de cerradura',[
    {q:'Conjunto permitido: ℕ = {0, 1, 2, …}. ¿Podemos hacer cualquier resta sin salir?',visual:line(2,'−',5),note:'Predice el resultado y decide si pertenece al conjunto.',action:'Calcular 2 − 5 →'},
    {q:'El resultado es −3. ¿Pertenece a ℕ?',visual:`${chip('ℕ')}${chip('2 − 5')}${chip('−3','outside')}`,note:'No. La resta no es una operación cerrada en ℕ: encontramos un resultado fuera del conjunto.',action:'Ampliar el conjunto a ℤ →'},
    {q:'Ahora se permiten todos los enteros.',visual:`${chip('ℤ')}${chip('2 − 5')}${chip('−3','member')}`,note:'En ℤ, la resta sí es cerrada. El conjunto y la operación deben especificarse juntos.'}
  ]);
  const dots=n=>Array.from({length:n},()=>'<i></i>').join('');
  stageScene('anillos','escena-distributiva','Una multiplicación, dos caminos','Propiedad distributiva · 3 · (2 + 4)',[
    {q:'Hay 3 paquetes. Cada uno contiene 2 fichas azules y 4 doradas.',visual:'<div class="packages">'+Array.from({length:3},()=>'<div class="dot-box">'+dots(2)+'<span class="package-divider"></span>'+Array.from({length:4},()=>'<i class="gold-dot"></i>').join('')+'</div>').join('')+'</div>',note:'Antes de contar: ¿da lo mismo sumar dentro del paquete o separar los dos colores?',action:'Primero sumar dentro →'},
    {q:'Cada paquete tiene 6 fichas.',visual:math('3 · (2 + 4) = 3 · 6 = 18'),note:'Sumamos 2 + 4 y después multiplicamos por los 3 paquetes.',action:'Ahora repartir el producto →'},
    {q:'Contamos cada color por separado.',visual:'<div class="two-paths"><div class="path-card"><h3>Azules</h3>'+math('3 · 2 = 6')+'</div><div class="path-card"><h3>Doradas</h3>'+math('3 · 4 = 12')+'</div></div>',note:'6 + 12 = 18. Multiplicar distribuye sobre la suma: 3 · (2 + 4) = 3 · 2 + 3 · 4.'}
  ]);
  const table=(n,fn,mark)=>'<table class="scene-table"><thead><tr><th>+</th>'+Array.from({length:n},(_,i)=>`<th>${i}</th>`).join('')+'</tr></thead><tbody>'+Array.from({length:n},(_,i)=>'<tr><th>'+i+'</th>'+Array.from({length:n},(_,j)=>`<td class="${mark?.(i,j)?'marked':''}">${fn(i,j)}</td>`).join('')+'</tr>').join('')+'</tbody></table>';
  stageScene('s31','escena-cayley','Cómo leer una tabla de Cayley','Suma módulo 4 · volvemos a (ℤ₄, +₄)',[
    {q:'Fila = primer número. Columna = segundo número. Busca 1 +₄ 2.',visual:table(4,(i,j)=>(i+j)%4),note:'Busca la fila 1 y la columna 2. Cada casilla representa una operación.',action:'Señalar la casilla →'},
    {q:'Fila 1, columna 2: resultado 3.',visual:table(4,(i,j)=>(i+j)%4,(i,j)=>i===1&&j===2),note:'1 +₄ 2 = 3. El subíndice recuerda que reducimos el resultado módulo 4.',action:'Buscar la identidad →'},
    {q:'¿Qué ocurre al sumar 0 por cualquiera de los dos lados?',visual:table(4,(i,j)=>(i+j)%4,(i,j)=>i===0||j===0),note:'La fila y la columna de 0 repiten los encabezados: 0 +₄ a = a +₄ 0 = a. Aquí 0 es identidad.'}
  ]);
  const homo=(l,r)=>'<div class="two-paths"><div class="path-card"><h3>Operar → transformar</h3>'+l+'</div><div class="path-card"><h3>Transformar → operar</h3>'+r+'</div></div>';
  stageScene('s31','escena-homomorfismo','Dos caminos, un resultado','Homomorfismo · g(n) = n mod 6',[
    {q:'Partimos de 4 y 5. ¿Importa cuándo tomamos el residuo?',visual:homo(math('4 + 5')+'<span class="path-arrow">↓ g</span>'+math('?'),math('g(4) +₆ g(5)')+'<span class="path-arrow">↓</span>'+math('?')),note:'g transforma cada entero en su residuo módulo 6.',action:'Recorrer el primer paso →'},
    {q:'A la izquierda sumamos; a la derecha transformamos cada número.',visual:homo(math('4 + 5 = 9')+'<span class="path-arrow">↓ g</span>'+math('?'),math('4 +₆ 5')+'<span class="path-arrow">↓</span>'+math('?')),note:'Aún falta transformar el 9 o completar la suma módulo 6.',action:'Comparar las llegadas →'},
    {q:'Ambos caminos llegan a 3.',visual:homo(math('g(9) = 3'),math('(4 + 5) mod 6 = 3')),note:'g(a + b) = g(a) +₆ g(b). Tomar residuos respeta la suma; este ejemplo ilustra la igualdad.'}
  ]);
  stageScene('s32','escena-cadenas','Concatenar conserva el orden','Monoide de cadenas · operación: concatenación',[
    {q:'x = ab, y = a. Predice xy y yx.',visual:'<div class="two-paths"><div class="path-card"><h3>Primero x</h3>'+math('ab · a')+'</div><div class="path-card"><h3>Primero y</h3>'+math('a · ab')+'</div></div>',note:'Concatenar es poner una cadena después de otra, sin reordenar sus letras.',action:'Unir las tarjetas →'},
    {q:'Los mismos símbolos producen cadenas distintas.',visual:'<div class="two-paths"><div class="path-card">'+math('aba')+'</div><div class="path-card">'+math('aab')+'</div></div>',note:'xy ≠ yx. La concatenación no es conmutativa si el alfabeto tiene al menos dos símbolos.',action:'Probar con la cadena vacía →'},
    {q:'Λ significa “ningún símbolo”.',visual:math('ab · Λ = Λ · ab = ab'),note:'Λ es identidad. A* es un monoide: la concatenación es asociativa y tiene cadena vacía.'}
  ]);
  const grammar=mount('s33','escena-gramatica','Construye aabb','Gramática · v₀ → a v₀ b | ab');let word='v',history='v₀';
  function grammarRender(){
    grammar.querySelector('.scene-prompt').textContent='v₀ es un hueco por reemplazar; a y b son símbolos finales.';
    grammar.querySelector('.scene-visual').innerHTML='<div class="scene-chips">'+[...word].map(c=>chip(c==='v'?'v₀':c,c==='v'?'outside':'')).join('')+'</div>';
    grammar.querySelector('.scene-message').textContent=word.includes('v')?'La regla “envolver” agrega una a a la izquierda y una b a la derecha.':word==='aabb'?'✓ Objetivo logrado: v₀ ⇒ a v₀ b ⇒ aabb. Ya no quedan no terminales.':'La cadena es válida, pero el objetivo era aabb. Reinicia y prueba otra derivación.';
    grammar.querySelector('.scene-actions').innerHTML=`<button class="btn primary grammar-wrap" ${!word.includes('v')||word.length>=5?'disabled':''}>Envolver: a v₀ b</button><button class="btn grammar-finish" ${!word.includes('v')?'disabled':''}>Cerrar: ab</button><button class="btn grammar-reset">Reiniciar</button>`;
    grammar.querySelector('.grammar-wrap').onclick=()=>{word=word.replace('v','avb');history+=' ⇒ '+word;grammarRender();};grammar.querySelector('.grammar-finish').onclick=()=>{word=word.replace('v','ab');grammarRender();};grammar.querySelector('.grammar-reset').onclick=()=>{word='v';history='v₀';grammarRender();};
  }grammarRender();
  const pos=[[70,22],[119,107],[21,107]],apply=(p,q)=>p.map(x=>q[x]);
  function triangle(p,caption,previous){
    return '<div class="triangle-path"><span class="tri-label">'+caption+'</span><svg viewBox="0 0 140 132" role="img" aria-label="'+caption+'"><path d="M70 22L119 107L21 107Z" fill="var(--accent-soft)" stroke="var(--accent)" stroke-width="2"/>'+p.map((point,label)=>`<g class="tri-token ${label===0?'first':''}" data-from="${previous?.[label]??point}" data-to="${point}" style="transform:translate(${pos[point][0]}px,${pos[point][1]}px)"><circle r="13"/><text text-anchor="middle" y="6">${label+1}</text></g>`).join('')+'</svg></div>';
  }
  function animateTriangles(el){if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;el.querySelectorAll('.tri-token').forEach(t=>{const a=pos[+t.dataset.from],b=pos[+t.dataset.to];if(a!==b)t.animate([{transform:`translate(${a[0]}px,${a[1]}px)`},{transform:`translate(${b[0]}px,${b[1]}px)`}],{duration:850,easing:'ease-in-out'});});}
  const identity=[0,1,2],rotation=[1,2,0],reflection=[0,2,1];
  stageScene('s35','escena-triangulo','Sigue el vértice 1','Grupo S₃ · la composición puede cambiar con el orden',[
    {q:'ρ gira 120° en sentido horario. μ refleja por el eje vertical.',visual:'<div class="two-paths">'+triangle(identity,'A · primero ρ, luego μ')+triangle(identity,'B · primero μ, luego ρ')+'</div>',note:'Los dos triángulos empiezan iguales. Predice dónde terminará la etiqueta 1.',action:'Aplicar la primera acción →'},
    {q:'A gira; B se refleja. Sigue la etiqueta dorada.',visual:'<div class="two-paths">'+triangle(rotation,'A · después de ρ',identity)+triangle(reflection,'B · después de μ',identity)+'</div>',note:'En A, el vértice 1 llega abajo a la derecha. En B, la reflexión lo deja arriba.',action:'Aplicar la segunda acción →',triangles:true},
    {q:'El vértice 1 termina en lugares distintos.',visual:'<div class="two-paths">'+triangle(apply(rotation,reflection),'A · después de μ',rotation)+triangle(apply(reflection,rotation),'B · después de ρ',reflection)+'</div>',note:'A termina en la posición 3; B, en la 2. Por eso μ ∘ ρ ≠ ρ ∘ μ: S₃ no es abeliano.',triangles:true}
  ]);
  const cosets=active=>'<div class="coset-grid">'+[[0,3],[1,4],[2,5]].map((xs,i)=>`<div class="coset-column"><strong>${i===0?'H':i+' + H'}</strong>${xs.map(x=>`<span style="${i<=active?'outline:2px solid var(--accent)':''}">${x}</span>`).join('')}</div>`).join('')+'</div>';
  stageScene('lagrange','escena-lagrange','Partir un grupo en partes iguales','Lagrange · (ℤ₆, +₆)',[
    {q:'Tomamos H = {0, 3}. Tiene identidad e inversos y es cerrado.',visual:cosets(0),note:'3 +₆ 3 = 0. Los elementos 0 y 3 se quedan dentro de H.',action:'Desplazar H una unidad →'},
    {q:'1 + H = {1, 4}. Otra parte del mismo tamaño.',visual:cosets(1),note:'Al sumar 1 a cada elemento obtenemos otra clase con 2 elementos.',action:'Completar la partición →'},
    {q:'Tres clases de 2 elementos cubren los seis elementos.',visual:cosets(2),note:'|G| = |H| · [G : H]: 6 = 2 · 3. El orden de H divide al de G. Tener un tamaño divisor no basta para ser subgrupo.'}
  ]);
  stageScene('anillos','escena-anillo','El mismo conjunto, otra operación','Anillos y campos · de la suma al producto',[
    {q:'(ℤ₆, +₆) es grupo abeliano. Ahora añadimos el producto módulo 6.',visual:line(2,'·₆',3),note:'La suma y el producto forman un anillo. ¿Qué ocurre al multiplicar estos dos elementos no nulos?',action:'Calcular el producto →'},
    {q:'2 · 3 = 6 ≡ 0 (mod 6).',visual:`${chip(2)}${chip('·')}${chip(3)}${chip('=')}${chip(0,'outside')}`,note:'Hay divisores de cero. ℤ₆ no es campo: sus elementos no nulos no tienen todos inverso multiplicativo.',action:'Comparar con ℤ₇ →'},
    {q:'En ℤ₇, 2 · 3 = 6. Además, 7 es primo.',visual:math('ℤ₇ · campo'),note:'En ℤ₇ cada elemento no nulo tiene inverso. El argumento es que 7 es primo; un solo producto distinto de cero no demostraría que es campo.'}
  ]);
  const residual=step=>'<table class="scene-table"><thead><tr><th>Módulo</th><th>23</th><th>41</th><th>Suma</th></tr></thead><tbody>'+[3,5,7].map(m=>`<tr><th>${m}</th><td>${step>=1?23%m:'?'}</td><td>${step>=1?41%m:'?'}</td><td class="${step>=2?'marked':''}">${step>=2?(23+41)%m:'?'}</td></tr>`).join('')+'</tbody></table>';
  stageScene('s36','escena-residuos','Una suma, tres carriles','Sistema residual · módulos 3, 5 y 7',[
    {q:'Queremos sumar 23 y 41. Primero necesitamos sus residuos.',visual:residual(0),note:'Los módulos son coprimos dos a dos. El rango acordado es 0–104.',action:'Transformar en residuos →'},
    {q:'23 ↦ (2, 3, 2) y 41 ↦ (2, 1, 6).',visual:residual(1),note:'Cada fila es un carril independiente. Predice la suma en la fila módulo 3.',action:'Sumar por carriles →'},
    {q:'El resultado tiene residuos (1, 4, 1).',visual:residual(2),note:'En el primer carril: (2 + 2) mod 3 = 1. No hay acarreo de una fila a otra.',action:'Reconstruir el número →'},
    {q:'(1, 4, 1) corresponde a 64 dentro de 0–104.',visual:math('23 + 41 = 64'),note:'El teorema chino del resto permite reconstruirlo. El reto siguiente recibe solo residuos para recuperar un número secreto.'}
  ]);
  const code=mount('s37','escena-codigo','Qué puede saber el receptor','Códigos · detectar no es lo mismo que corregir');let codeMode='par',flips=new Set();const msg=[1,0,1,1];
  function renderCode(){
    const sent=codeMode==='par'?[...msg,1]:[...msg,...msg,...msg],recv=sent.map((v,i)=>flips.has(i)?1-v:v);
    code.querySelector('.scene-prompt').textContent=codeMode==='par'?'Enviamos 1011 con paridad par: 10111. Cambia un bit recibido.':'Enviamos 1011 tres veces. Cambia un bit y observa el voto por posición.';
    const group=(values,start,label)=>`<div class="code-copy"><small>${label}</small><div class="code-word">${values.map((v,i)=>`<button class="code-bit ${flips.has(start+i)?'flipped':''}" data-bit="${start+i}" aria-label="Bit recibido ${start+i+1}: ${v}">${v}</button>`).join('')}</div></div>`;
    code.querySelector('.scene-visual').classList.add('column');code.querySelector('.scene-visual').innerHTML=codeMode==='par'?group(recv,0,'Recibe'):group(recv.slice(0,4),0,'Copia 1')+group(recv.slice(4,8),4,'Copia 2')+group(recv.slice(8),8,'Copia 3');
    let note;
    if(codeMode==='par'){const w=recv.reduce((a,b)=>a+b,0);note=w%2?'Paridad impar: el receptor detecta error, pero no puede localizarlo ni corregirlo.':flips.size?'La paridad es correcta aunque cambiamos '+flips.size+' bits. Un número par de cambios puede pasar inadvertido.':'Paridad correcta. Eso no garantiza ausencia de errores; en esta simulación aún no cambiamos bits.';}
    else{const decoded=msg.map((_,j)=>recv[j]+recv[j+4]+recv[j+8]>=2?1:0).join('');note=decoded==='1011'?`Mayoría → ${decoded}. Se garantiza corregir un error total; el receptor no necesita conocer el original.`:`Mayoría → ${decoded}. Dos copias fallaron en la misma posición: el simulador confirma que la corrección falló.`;}
    code.querySelector('.scene-message').textContent=note;
    code.querySelector('.scene-actions').innerHTML=`<button class="btn code-mode ${codeMode==='par'?'primary':''}" data-code="par">Paridad</button><button class="btn code-mode ${codeMode==='rep'?'primary':''}" data-code="rep">Triple repetición</button><button class="btn reset-code">Quitar ruido</button>`;
    code.querySelectorAll('[data-bit]').forEach(b=>b.onclick=()=>{const i=+b.dataset.bit;flips.has(i)?flips.delete(i):flips.add(i);renderCode();code.querySelector(`[data-bit="${i}"]`).focus({preventScroll:true});});
    code.querySelectorAll('[data-code]').forEach(b=>b.onclick=()=>{codeMode=b.dataset.code;flips.clear();renderCode();});code.querySelector('.reset-code').onclick=()=>{flips.clear();renderCode();};
  }renderCode();
})();

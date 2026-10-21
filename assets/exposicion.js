/* Actividades de exposición: predecir, comprobar, explicar y transferir. */
(() => {
  const $ = s => document.querySelector(s);
  const square = document.getElementById('squareModal');
  document.getElementById('btnOpenSquare').addEventListener('click',()=>square.showModal());
  document.getElementById('btnSquareClose').addEventListener('click',()=>square.close());
  square.addEventListener('click',e=>{if(e.target===square){const r=square.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)square.close();}});

  const plan = {
    entrada: {speaker:1, time:'00–06 min', idea:'Cambiar el orden no es lo mismo que cambiar los paréntesis.', lab:'.plab'},
    inicio: {speaker:1, time:'00–06 min', idea:'Una estructura se clasifica por su conjunto y sus operaciones.', lab:'.block'},
    s31: {speaker:2, time:'06–12 min', idea:'Una tabla describe una operación; una propiedad exige revisar todos los casos.', lab:'#tablelab'},
    s32: {speaker:1, time:'12–17 min', idea:'Concatenar conserva el orden. La cadena vacía no cambia el mensaje.', lab:'#sx'},
    s33: {speaker:2, time:'17–22 min', idea:'Una cadena pertenece al lenguaje si las reglas permiten generarla.', lab:'#gOut'},
    s35: {speaker:1, time:'22–29 min', idea:'Cada simetría se puede deshacer; cambiar el orden puede cambiar el resultado.', lab:'#s3tris'},
    lagrange: {speaker:2, time:'29–36 min', idea:'El tamaño de un subgrupo divide al del grupo. Eso no basta para verificar un subconjunto.', lab:'#clock'},
    anillos: {speaker:1, time:'36–42 min', idea:'En un campo todo elemento no nulo permite dividir. En ℤ₁₂, 3 · 4 = 0.', lab:'[data-zn]'},
    s36: {speaker:2, time:'42–48 min', idea:'Los residuos identifican un número dentro de un rango acordado.', lab:'#rTable'},
    s37: {speaker:1, time:'48–54 min', idea:'Detectar un error y recuperar el mensaje son tareas distintas.', lab:'#cMsg'}
  };
  const concepts = {
    s31:['Un sistema (S, *) combina un conjunto no vacío con una operación cerrada: cada par de elementos produce otro elemento de S.','Los enteros sin signo de un procesador usan suma modular: al superar el máximo, vuelven a 0.'],
    s32:['Semigrupo = operación asociativa. Monoide = semigrupo con identidad. En A*, la operación es concatenar y la identidad es Λ.','Procesar fragmentos por separado y reunirlos funciona cuando la combinación es asociativa y conserva el orden requerido.'],
    s33:['Una gramática usa un símbolo inicial y reglas de reemplazo para generar cadenas. Un no terminal aún puede reemplazarse; un terminal queda en la salida.','Un parser contrasta la estructura del programa con las reglas de su lenguaje.'],
    s35:['Grupo = operación cerrada y asociativa + identidad + inverso para cada elemento. Si además conmuta, es abeliano.','Las transformaciones de figuras se componen; deshacerlas exige aplicar las transformaciones inversas en orden inverso.'],
    lagrange:['Un subgrupo es un subconjunto que sigue siendo grupo con la misma operación. Si G es finito y H es subgrupo, |G| = |H| · número de clases laterales.','Los grupos de orden primo usados en criptografía no tienen subgrupos propios no triviales.'],
    anillos:['Un anillo conecta suma y producto mediante distributividad. Un dominio entero es conmutativo, tiene 1 ≠ 0 y no tiene divisores de cero; en un campo cada elemento no nulo tiene inverso multiplicativo.','AES opera con bytes en GF(2⁸), un campo de 256 elementos distinto del anillo ℤ₂₅₆.'],
    s36:['Con módulos coprimos dos a dos, cada tupla de residuos corresponde a un único entero entre 0 y M − 1, donde M es el producto de los módulos.','Cada componente puede sumar y multiplicar sin pasar acarreo a las otras; reconstruir el resultado requiere trabajo adicional.'],
    s37:['La distancia de Hamming cuenta los bits diferentes. Con distancia mínima d, se detectan hasta d − 1 errores y se corrigen hasta ⌊(d − 1)/2⌋.','Los códigos correctores protegen datos transmitidos o almacenados, como en memoria ECC y comunicaciones.']
  };
  window.expositionPlan = plan;
  Object.entries(plan).forEach(([id, p]) => {
    const section = document.getElementById(id);
    const head = section.querySelector(':scope > .head');
    if (head) {
      const idea = document.createElement('p'); idea.className='key-idea'; idea.textContent=p.idea; head.append(idea);
      if(concepts[id]){
        const definition=document.createElement('p');definition.className='core-definition';definition.textContent=concepts[id][0];head.append(definition);
        const connection=document.createElement('details');connection.className='computing-connection';
        const summary=document.createElement('summary');summary.textContent='Conexión con computación';
        const explanation=document.createElement('p');explanation.textContent=concepts[id][1];connection.append(summary,explanation);head.append(connection);
      }
    }
    const target = section.querySelector(p.lab);
    if(target) (target.closest('.lab') || target).dataset.routeLab = '';
  });

  const games = [
    {section:'inicio',title:'El pasaporte de las estructuras',goal:'Cada sello exige una propiedad. ¿Hasta qué categoría llega este sistema?',rounds:[
      {prompt:'(ℕ, +), incluyendo el 0: ¿cuál es el nivel más específico?', options:['Semigrupo sin identidad','Monoide, pero no grupo','Grupo abeliano'],answer:1,why:'0 es identidad y la suma es asociativa. Falta el inverso de 3: −3 no está en ℕ.',take:'Pregunta siempre: ¿el inverso sigue dentro del conjunto?'},
      {prompt:'(ℚ ∖ {0}, ·): ¿qué estructura describe este sistema con UNA operación?',options:['Solo monoide','Grupo abeliano','Campo'],answer:1,why:'Cada racional no nulo tiene inverso multiplicativo y el producto conmuta. Para hablar de campo necesitamos especificar suma y producto en un conjunto que incluya 0.',take:'El nombre del conjunto por sí solo no determina la estructura.'},
      {prompt:'(ℤ, −): ¿por qué no llega a ser semigrupo?',options:['No hay cerradura','La resta no es asociativa','Los números son infinitos'],answer:1,why:'(5 − 3) − 1 = 1, mientras que 5 − (3 − 1) = 3. Un solo contraejemplo refuta una ley universal.',take:'Reagrupar y cambiar el orden son pruebas diferentes.'}
    ]},
    {section:'s31',title:'La casilla de Cayley',goal:'Deducir una casilla y distinguir una pista de una prueba.',rounds:[
      {prompt:'Esta es la tabla de un grupo. ¿Qué falta en la fila 1, columna 2?',visual:'cayley',options:['0','1','2','3'],answer:3,why:'En la fila aparecen 1, 2 y 0: falta 3. La columna también necesita 3. Aquí la operación es suma módulo 4: 1 + 2 = 3.',take:'En un grupo, cada elemento aparece una vez por fila y columna.'},
      {prompt:'Una tabla no repite símbolos en ninguna fila ni columna. ¿Eso demuestra que es un grupo?',options:['Sí, ya es suficiente','No: falta comprobar asociatividad, identidad e inversos'],answer:1,why:'Ser un cuadrado latino no garantiza ser grupo. Por ejemplo, la resta módulo 3 produce un cuadrado latino, pero no es asociativa.',take:'Una condición necesaria no siempre es suficiente.'}
    ]},
    {section:'s32',title:'¿Conmutan estas cadenas?',goal:'Separar un caso particular de una propiedad del sistema.',rounds:[
      {prompt:'x = ab, y = a. Antes de unirlas: ¿xy = yx?',options:['Sí','No'],answer:1,why:'xy = aba y yx = aab. Este contraejemplo basta para mostrar que la concatenación no es conmutativa.',take:'Asociar cambia los paréntesis; conmutar cambia el orden.'},
      {prompt:'x = ab, y = abab. ¿xy = yx?',options:['Sí','No'],answer:0,why:'Ambas concatenaciones dan ababab: son potencias de la misma palabra ab. Este caso no convierte toda la operación en conmutativa.',take:'Que una igualdad se cumpla una vez no demuestra que se cumpla siempre.'},
      {prompt:'x = ab, y = Λ (cadena vacía). ¿Qué resulta?',options:['xy = yx = ab','xy = Λ','La operación no está definida'],answer:0,why:'Concatenar la cadena vacía no agrega símbolos. Λ es la identidad del monoide A*.',take:'La longitud también respeta la operación: ℓ(xy) = ℓ(x) + ℓ(y).'}
    ]},
    {section:'s33',title:'¿Lo admite nuestra gramática?',goal:'Validar contra una regla explícita, no contra un lenguaje que imaginamos.',rounds:[
      {prompt:'Regla: empieza con una letra; después solo letras o dígitos. ¿Cuál se admite?',visual:'bnf',options:['var_total','2contador','suma2'],answer:2,why:'suma2 empieza con letra y continúa con letras o dígitos. El guion bajo no está permitido en esta gramática; el dígito inicial tampoco.',take:'Esta es una gramática didáctica. Otros lenguajes pueden permitir _ o $.'},
      {prompt:'Con v₀ → a v₀ b | ab, ¿podemos generar abab?',options:['Sí: tiene dos a y dos b','No: todas las a deben ir antes que las b'],answer:1,why:'Las reglas generan aⁿbⁿ con n ≥ 1. Por ejemplo, v₀ ⇒ a v₀ b ⇒ aabb. Contar letras no basta: también importa el orden.',take:'Describe la regla que falla, no solo la etiqueta «inválido».'}
    ]},
    {section:'s35',title:'El orden del triángulo',goal:'Leer una composición como una secuencia de acciones.',rounds:[
      {prompt:'Primero ρ₁ (1→2→3→1), luego μ₁ (intercambia 2 y 3). ¿Dónde termina el vértice 1?',visual:'triangle',options:['Posición 1','Posición 2','Posición 3'],answer:2,why:'Sigue solo una etiqueta: 1 → 2 por ρ₁, y 2 → 3 por μ₁. «Primero p, luego q» se escribe q ∘ p.',take:'Sigue un vértice a la vez antes de componer toda la figura.'},
      {prompt:'Invierte el orden: primero μ₁, luego ρ₁. ¿Dónde termina ahora el vértice 1?',visual:'triangle',options:['Posición 1','Posición 2','Posición 3'],answer:1,why:'μ₁ deja el vértice 1 donde estaba; después ρ₁ lo lleva a 2. Antes llegaba a 3: las composiciones son distintas.',take:'Un contraejemplo demuestra que S₃ no es abeliano.'}
    ]},
    {section:'lagrange',title:'El impostor de Lagrange',goal:'Descartar tamaños imposibles sin afirmar la existencia de subgrupos.',rounds:[
      {prompt:'|G| = 24. ¿Qué tamaño de subgrupo es imposible?',options:['3','6','7','8'],answer:2,why:'24 = 7 · 3 + 3. No puede partirse el grupo en clases de 7 elementos. Los otros tamaños dividen a 24; Lagrange por sí solo no construye esos subgrupos.',take:'Lagrange descarta; no demuestra que cualquier subconjunto sea subgrupo.'},
      {prompt:'En (ℤ₆, +₆), H = {0, 1} tiene 2 elementos y 2 divide a 6. ¿Es subgrupo?',options:['Sí: el tamaño divide a 6','No: falla la cerradura'],answer:1,why:'1 +₆ 1 = 2 y 2 no pertenece a H. En cambio {0, 3} sí es subgrupo. Tener el tamaño adecuado no basta.',take:'Después del tamaño, verifica las operaciones y los inversos.'}
    ]},
    {section:'anillos',title:'Caza de divisores de cero',goal:'Encontrar una evidencia y explicar qué propiedad invalida.',rounds:[
      {prompt:'En ℤ₁₂, elige dos elementos NO nulos cuyo producto sea 0.',options:['0 y 5','3 y 4','5 y 5'],answer:1,why:'3 · 4 = 12 ≡ 0 (mod 12). Usar 0 no prueba que haya divisores de cero. 5 · 5 ≡ 1, así que 5 es una unidad.',take:'Aquí no podemos cancelar: 3 · 4 = 3 · 0, pero 4 ≠ 0.'},
      {prompt:'Ahora trabajamos en ℤ₁₃. ¿Se puede encontrar ese mismo tipo de pareja?',options:['Sí: 1 y 12','No: 13 es primo y ℤ₁₃ es campo'],answer:1,why:'En ℤ₁₃ todos los elementos no nulos tienen inverso. Si ab = 0 y a ≠ 0, multiplicar por a⁻¹ obliga a que b = 0.',take:'En ℤₙ, ser campo equivale a que n sea primo.'}
    ]},
    {section:'s36',title:'El oráculo de los residuos',goal:'Reconstruir desde residuos y reconocer el límite del rango.',kind:'crt'},
    {section:'s37',title:'¿Detectar o corregir?',goal:'Decidir qué sabe realmente el receptor.',rounds:[
      {prompt:'Paridad par: se recibe 00111 (tres unos). ¿Qué puede concluir el receptor?',visual:'parity',options:['Puede identificar y corregir el primer bit','Detecta un error, pero no sabe dónde ocurrió','No detecta nada'],answer:1,why:'El peso es impar, así que hubo un error. La paridad sola no localiza el bit cambiado y no permite corregirlo.',take:'El receptor no tiene la palabra original para compararla.'},
      {prompt:'Repetición triple: se recibe 0011 | 1011 | 1011. ¿Qué mensaje produce el voto por posición?',options:['0011','1011','1111'],answer:1,why:'En la primera posición hay 0, 1, 1: gana 1. Las demás posiciones coinciden. El resultado es 1011. Este código garantiza corregir cualquier error de un solo bit.',take:'La corrección por mayoría usa repetición triple, no un único bit de paridad.'},
      {prompt:'Se envió 1011 repetido tres veces, pero se recibió 0011 | 0011 | 1011. ¿La mayoría recupera el original?',options:['Sí, siempre corrige dos errores','No: produce 0011'],answer:1,why:'Dos copias fallan en la misma posición. La mayoría decide 0 y entrega 0011. Con distancia mínima 3 solo está garantizada la corrección de un error total.',take:'A veces corrige varios errores repartidos; eso no amplía la garantía.'}
    ]}
  ];
  const visuals = {
    cayley:'<div class="scroll"><table class="data game-table"><caption>Grupo (ℤ₄, +₄) · fila + columna</caption><thead><tr><th scope="col">+₄</th><th scope="col">0</th><th scope="col">1</th><th scope="col">2</th><th scope="col">3</th></tr></thead><tbody>'+[0,1,2,3].map(i=>'<tr><th scope="row">'+i+'</th>'+[0,1,2,3].map(j=>'<td'+(i===1&&j===2?' class="missing"':'')+'>'+(i===1&&j===2?'?':(i+j)%4)+'</td>').join('')+'</tr>').join('')+'</tbody></table></div>',
    bnf:'<p class="eq">identificador → letra (letra | dígito)*</p><p class="hint">Letras: A–Z, a–z y vocales acentuadas/ñ; dígitos: 0–9.</p>',
    triangle:'<svg class="game-triangle" viewBox="0 0 260 150" role="img" aria-label="Posición 1 arriba, 2 abajo a la derecha, 3 abajo a la izquierda"><path d="M130 25 L225 125 L35 125 Z" fill="var(--accent-soft)" stroke="var(--accent)" stroke-width="3"/><g fill="var(--ink)" font-size="22" text-anchor="middle"><text x="130" y="21">1</text><text x="244" y="137">2</text><text x="16" y="137">3</text></g></svg>',
    parity:'<p class="received-word" aria-label="Palabra recibida: cero cero uno uno uno">0 0 1 1 1</p>'
  };
  function card(game,index){
    const el=document.createElement('div');el.className='lab learning-game';el.id='juego-'+index;el.dataset.game=String(index);
    el.innerHTML=`<p class="tag">Reto ${index+1} de 9 · Vota y explica · 2 min aprox.</p><h3>${game.title}</h3><p class="game-goal">${game.goal}</p><div class="game-stage"></div>`;
    document.getElementById(game.section).append(el);return el;
  }
  games.forEach((game,index)=>{
    const el=card(game,index), stage=el.querySelector('.game-stage');
    if(game.kind==='crt'){renderCRT(stage);return;}
    let round=0, selected=null, revealed=false;
    function render(){
      const r=game.rounds[round];
      const stamps=['Cerradura','Asociativa','Identidad','Inversos','Conmutativa'];
      const checks=[[true,true,true,false,null],[true,true,true,true,true],[true,false,null,null,null]][round];
      const passport=index===0?`<p class="property-focus"><strong>Propiedades que revisamos:</strong> cerradura, asociatividad, identidad, inversos y conmutatividad.</p><div class="property-passport${revealed?' passport-revealed':''}" aria-label="Pasaporte hacia grupo abeliano">${stamps.map((label,i)=>`<div class="property-stamp ${revealed?(checks[i]===true?'approved':checks[i]===false?'stopped':'pending'):'pending'}" style="--stamp-delay:${i*100}ms"><span class="stamp-icon" aria-hidden="true">${revealed?(checks[i]===true?'✓':checks[i]===false?'✕':'—'):'?'}</span><span>${label}</span><small>${revealed?(checks[i]===true?'Cumple':checks[i]===false?'Aquí se detiene':'Sin evaluar'):'Por comprobar'}</small></div>`).join('')}</div>`:'';
      stage.innerHTML=`<p class="round-label">Ronda ${round+1} de ${game.rounds.length} · ${revealed?'Compara y explica':'Primero, predice'}</p><p class="game-question">${r.prompt}</p>${passport}${visuals[r.visual]||''}<fieldset class="vote-options"><legend class="sr-only">Elige la respuesta de la clase</legend>${r.options.map((o,i)=>`<label class="vote-option${selected===i?' chosen':''}${revealed&&i===r.answer?' correct':''}"><input type="radio" name="game-${index}" value="${i}" ${selected===i?'checked':''} ${revealed?'disabled':''}><span>${o}${revealed&&i===r.answer?' ✓':''}</span></label>`).join('')}</fieldset><div class="game-feedback" role="status" aria-live="polite">${revealed?`<strong>${selected===r.answer?'✓ Coincide.':'Revisemos la elección.'}</strong> ${r.why}<p class="takeaway"><strong>Qué nos llevamos:</strong> ${r.take}</p>`:''}</div><div class="game-actions">${!revealed?'<button class="btn primary check-answer" '+(selected===null?'disabled':'')+'>Comprobar la predicción</button>':round<game.rounds.length-1?'<button class="btn primary next-round">Siguiente caso →</button>':'<span class="game-done">✓ Reto terminado · explica la idea con tus palabras.</span>'}<button class="btn reset-game">Reiniciar reto</button></div>`;
      stage.querySelectorAll('input[type="radio"]').forEach(input=>input.addEventListener('change',()=>{
        selected=+input.value;
        stage.querySelectorAll('.vote-option').forEach(l=>l.classList.toggle('chosen',l.contains(input)));
        stage.querySelector('.check-answer').disabled=false;
      }));
      stage.querySelector('.check-answer')?.addEventListener('click',()=>{revealed=true;render();focusFeedback();});
      stage.querySelector('.next-round')?.addEventListener('click',()=>{round++;selected=null;revealed=false;render();stage.querySelector('input')?.focus({preventScroll:true});});
      stage.querySelector('.reset-game').addEventListener('click',()=>{round=0;selected=null;revealed=false;render();stage.querySelector('input')?.focus({preventScroll:true});});
      window.dispatchEvent(new Event('resize'));
    }
    function focusFeedback(){const feedback=stage.querySelector('.game-feedback');feedback.tabIndex=-1;feedback.focus({preventScroll:true});}
    render();
  });
  function renderCRT(stage){
    stage.innerHTML='<p class="game-question">Piensa un entero entre 0 y 104 y comparte solo sus residuos.</p><p class="hint">Módulos 3, 5 y 7: son coprimos dos a dos y su producto es 105. No ingreses el número secreto.</p><form class="crt-form"><div class="inputs">'+[3,5,7].map(m=>`<label class="f">Residuo módulo ${m}<input class="in" name="r${m}" type="number" min="0" max="${m-1}" step="1" required inputmode="numeric"></label>`).join('')+'</div><div class="game-actions"><button class="btn primary" type="submit">Reconstruir y explicar</button><button class="btn" type="reset">Nuevo número</button></div></form><div class="game-feedback" role="status" aria-live="polite"></div><p class="takeaway">Fuera del rango hay más soluciones: x, x + 105, x + 210… Los residuos identifican una clase módulo 105.</p>';
    const form=stage.querySelector('form'),out=stage.querySelector('.game-feedback');
    form.addEventListener('submit',e=>{
      e.preventDefault();if(!form.reportValidity())return;
      const r=[3,5,7].map(m=>Number(form.elements['r'+m].value));
      if(!r.every((v,i)=>Number.isInteger(v)&&v>=0&&v<[3,5,7][i]))return;
      const sum=r[0]*70+r[1]*21+r[2]*15,x=sum%105;
      out.innerHTML=`<p class="oracle-result">Tu número es <strong>${x}</strong></p><p>(${r[0]} · 70 + ${r[1]} · 21 + ${r[2]} · 15) mod 105 = ${x}</p><p>Comprobamos: ${x} mod 3 = ${x%3}, mod 5 = ${x%5}, mod 7 = ${x%7}.</p><p><strong>¿Por qué funciona?</strong> 70 tiene residuos (1, 0, 0); 21 tiene (0, 1, 0); 15 tiene (0, 0, 1). Cada peso recupera una componente.</p>`;
      out.tabIndex=-1;out.focus({preventScroll:true});window.dispatchEvent(new Event('resize'));
    });form.addEventListener('reset',()=>{out.textContent='';});
  }

  // Start the practical lab with a short task, before showing its full output.
  const labTasks={
    tablelab:'Cambia una casilla. Busca un contraejemplo antes de leer el diagnóstico.',
    sx:'Antes de escribir: ¿ab · a dará lo mismo que a · ab?',
    gOut:'Objetivo: genera aaabbb. ¿Cuántas veces necesitarás cada producción?',
    s3tris:'Sigue el vértice 1. Luego invierte las dos acciones y compara.',
    clock:'En ℤ₁₂, selecciona 4: ¿cuántos saltos necesitas para volver a 0?',
    rTable:'Con x = 23 e y = 41: predice la suma módulo 3 antes de leer la tabla.',
    cMsg:'Primero usa paridad y cambia un bit. Luego prueba repetición triple con el mismo error.'
  };
  Object.entries(labTasks).forEach(([id,text])=>{
    const lab=document.getElementById(id)?.closest('.lab');if(!lab)return;
    const p=document.createElement('p');p.className='lab-mission';p.textContent=text;lab.querySelector('h3').after(p);
  });
  const zn=document.querySelector('#anillos [data-zn]');
  const p=document.createElement('p');p.className='lab-mission';p.textContent='En ℤ₆, busca dos factores no nulos que den 0; después cambia a ℤ₇.';zn.querySelector('h3').after(p);
  const idLab=$('#idIn').closest('.lab');const note=document.createElement('p');note.className='hint';note.textContent='Según nuestra BNF: empieza con letra y continúa solo con letras o dígitos. No incluye _ ni $. No representa las reglas de todos los lenguajes.';idLab.querySelector('h3').after(note);
  // Definitions and proofs remain accessible, while the live route emphasizes one idea.
  const toolbar=document.createElement('div');toolbar.className='presentation-toolbar';
  toolbar.innerHTML='<label class="route-control">Recorrido <select id="routeMode"><option value="live">Exposición · 60 min</option><option value="full">Consulta · todo el material</option></select></label><span id="speakerCue" aria-live="polite"></span>';
  $('.top .wrap').append(toolbar);
})();

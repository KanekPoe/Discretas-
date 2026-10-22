/* The same simulator fits its dialog without a second scrolling document. */
(() => {
  if(window.self===window.top&&!new URLSearchParams(location.search).has('embed'))return;
  document.documentElement.classList.add('embedded-simulator');
  const main=document.querySelector('main'),cards=[...main.querySelectorAll(':scope > .card')];
  const setup=cards[0],inputs=cards[1],proof=cards[2],graph=cards[3],mass=cards[4];
  const nav=document.createElement('nav');nav.className='simulator-toolbar';
  nav.innerHTML='<label>Vista <select id="simulatorView"><option value="diagram">Cuadrado</option><option value="setup">Función y valores</option><option value="path1">Camino 1</option><option value="path2">Camino 2</option><option value="conclusion">Conclusión</option></select></label><span class="simulator-function"></span>';
  main.prepend(nav);
  const configure=document.createElement('section');configure.className='embedded-setup';
  const label=document.createElement('label');label.className='function-picker';label.textContent='Función';
  const picker=document.createElement('select');picker.id='functionSelect';
  const presetButtons=[...document.querySelectorAll('#presets button')];
  presetButtons.forEach((button,i)=>{const option=document.createElement('option');option.value=i;option.textContent=button.textContent;picker.append(option);});label.append(picker);
  configure.append(label,document.getElementById('info'),inputs.querySelector('.inputs'));main.append(configure);
  const readout=document.createElement('p');readout.className='embedded-step-readout';readout.setAttribute('role','status');readout.setAttribute('aria-live','polite');
  proof.append(readout);
  const controls=document.createElement('div');controls.className='simulator-controls';
  controls.append(document.getElementById('next'),document.getElementById('all'));
  const reset=document.createElement('button');reset.className='btn';reset.type='button';reset.textContent='Reiniciar';controls.append(reset);main.append(controls);
  const view=document.getElementById('simulatorView');
  function update(){
    const step=Number(document.documentElement.dataset.proofStep||0),error=document.documentElement.dataset.proofError;
    document.getElementById('next').disabled=!!error||step>=5;document.getElementById('all').disabled=!!error;
    readout.textContent=error|| (step===0?'Avanza para recorrer los dos caminos. Los signos ? indican resultados todavía pendientes.':step===5?document.getElementById('verdict').textContent:document.querySelector('.step[data-s="'+Math.min(step,4)+'"]').textContent);
    const button=presetButtons.find(b=>b.classList.contains('on'));if(button){picker.value=button.dataset.i;nav.querySelector('.simulator-function').textContent=button.textContent;}
    main.dataset.view=view.value;
    setup.hidden=true;inputs.hidden=true;graph.hidden=true;mass.hidden=true;
    configure.hidden=view.value!=='setup';proof.hidden=view.value==='setup';
    controls.hidden=view.value==='setup';
    document.dispatchEvent(new Event('resize'));
  }
  view.addEventListener('change',update);
  picker.addEventListener('change',()=>{presetButtons[Number(picker.value)].click();update();});
  reset.addEventListener('click',()=>{const selected=presetButtons.find(b=>b.classList.contains('on'));selected.click();});
  document.addEventListener('proofrender',update);update();
})();

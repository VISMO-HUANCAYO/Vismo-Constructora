(function(){
  const KEY='vismoProyectosV6ContractModels';
  const $=id=>document.getElementById(id);
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function load(){try{const x=JSON.parse(localStorage.getItem(KEY)||'[]');return Array.isArray(x)?x:[]}catch(e){return []}}
  function save(x){localStorage.setItem(KEY,JSON.stringify(x));}
  function init(){
    const name=$('modelName'), type=$('modelType'), body=$('modelBody'), list=$('modelList'), old=$('saveModel');
    if(!name||!type||!body||!list||!old)return;
    const btn=old.cloneNode(true); old.replaceWith(btn);
    let edit=-1;
    function render(){
      const models=load();
      list.innerHTML=models.length?'<div class="panel"><h2>MODELOS GUARDADOS</h2>'+models.map((m,i)=>`<div class="listitem"><div><b>${esc(m.name)}</b><br><small>${esc(m.type||'Sin tipo')}</small></div><div><small>${esc((m.body.match(/\{[^}]+\}/g)||[]).join(' · ')||'Sin campos variables')}</small></div><div></div><div class="projectActions"><button type="button" class="btn" data-use="${i}">Usar modelo</button><button type="button" class="btn" data-edit="${i}">Editar</button><button type="button" class="btn" data-copy="${i}">Duplicar</button><button type="button" class="btn" data-del="${i}">Eliminar</button></div></div>`).join('')+'</div>':'<div class="panel"><b>Aún no hay modelos guardados.</b><p class="hint">Completa el formulario superior y presiona “Guardar modelo”.</p></div>';
      list.querySelectorAll('[data-edit]').forEach(b=>b.onclick=()=>{let i=+b.dataset.edit,m=load()[i];if(!m)return;name.value=m.name;type.value=m.type||'';body.value=m.body;edit=i;btn.textContent='Actualizar modelo';window.scrollTo({top:0,behavior:'smooth'});});
      list.querySelectorAll('[data-copy]').forEach(b=>b.onclick=()=>{let a=load(),m=a[+b.dataset.copy];if(!m)return;a.push({...m,name:m.name+' · copia'});save(a);render();});
      list.querySelectorAll('[data-del]').forEach(b=>b.onclick=()=>{if(!confirm('¿Eliminar este modelo de contrato?'))return;let a=load();a.splice(+b.dataset.del,1);save(a);render();});
      list.querySelectorAll('[data-use]').forEach(b=>b.onclick=()=>{let m=load()[+b.dataset.use];if(!m)return;let notes=$('notes'), custom=$('customServiceName'), svc=$('type');if(m.v21Execution){if(svc){svc.value='Obra a todo costo';svc.dispatchEvent(new Event('change'))}if(custom){custom.value='Ejecución de obra (a todo costo)';custom.dataset.edited='1'}if(notes)notes.value='';setTimeout(()=>{document.getElementById('workBudgetPanel')?.scrollIntoView({behavior:'smooth',block:'start'})},100)}else{if(custom){custom.value=m.name;custom.dataset.edited='1'}if(notes)notes.value='MODELO: '+m.name+'\n\n'+m.body}let nav=document.querySelector('.nav[data-v="new"]');if(nav)nav.click();alert(m.v21Execution?'Modelo de EJECUCIÓN DE OBRA cargado. Agrega los cuadros de presupuesto por piso o etapa.':'Modelo cargado en Nuevo proyecto. Completa los datos del cliente y del predio.');});
    }
    btn.onclick=function(e){e.preventDefault();e.stopImmediatePropagation();const n=name.value.trim(),t=type.value.trim(),c=body.value.trim();if(!n){alert('Escribe el nombre del modelo.');name.focus();return}if(!c){alert('Escribe el contenido del contrato.');body.focus();return}let a=load(),obj={name:n,type:t,body:c,updatedAt:new Date().toISOString()};if(edit>=0&&edit<a.length)a[edit]=obj;else a.push(obj);try{save(a)}catch(err){alert('No se pudo guardar en este navegador.');return}edit=-1;name.value='';type.value='';body.value='';btn.textContent='Guardar modelo';render();alert('Modelo de contrato guardado correctamente.');};
    render();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();

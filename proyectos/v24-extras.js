(()=>{
const $=id=>document.getElementById(id);
const WORK=['Construcción','Obra a todo costo','Tarrajeo','Enchapados'];
const esc=s=>String(s??'').replace(/[&<>"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]));
const money=n=>'S/ '+(+n||0).toLocaleString('es-PE',{minimumFractionDigits:2,maximumFractionDigits:2});

// ---- Duplicar filas y cuadros (V25) ----
function cleanDecorations(s){
 s.querySelectorAll('.v23BudgetHead,.v23BudgetTotal,.v24dup,.bsDuplicate').forEach(x=>x.remove());
 s.removeAttribute('data-v23');
 s.querySelectorAll('[data-v24]').forEach(x=>x.removeAttribute('data-v24'));
}
function enhanceRow(r){
 if(r.dataset.v24)return;r.dataset.v24='1';
 let del=r.querySelector('.v21del');
 let dup=document.createElement('button');dup.type='button';dup.className='btn v24dup';dup.title='Duplicar fila';dup.textContent='⧉';
 dup.onclick=()=>{
   let c=r.cloneNode(true);c.removeAttribute('data-v24');c.querySelectorAll('.v24dup').forEach(x=>x.remove());
   r.after(c);enhanceRow(c);c.dispatchEvent(new Event('input',{bubbles:true}));
 };
 if(del)r.insertBefore(dup,del);else r.appendChild(dup);
}
function wireSection(s){
 s.querySelectorAll('.v21row').forEach(enhanceRow);
 if(!s.querySelector('.bsDuplicate')){
   let actions=s.querySelector('.actions'),remove=actions?.querySelector('.bsRemove');
   if(actions){
     let b=document.createElement('button');b.type='button';b.className='btn bsDuplicate';b.textContent='⧉ Duplicar cuadro';
     b.onclick=()=>{
       // Clone only editable content, never V23/V24 generated headers/totals/buttons.
       let clone=s.cloneNode(true);cleanDecorations(clone);
       clone.querySelectorAll('.v21row').forEach(r=>{r.removeAttribute('data-v24');r.querySelectorAll('.v24dup').forEach(x=>x.remove())});
       s.after(clone);
       // Re-wire original V21 controls.
       let rows=clone.querySelector('.bsRows');
       clone.querySelector('.bsAdd').onclick=()=>{
         let source=clone.querySelector('.v21row'),nr=source?source.cloneNode(true):null;if(!nr)return;
         nr.querySelectorAll('input').forEach(x=>x.value='');nr.removeAttribute('data-v24');nr.querySelectorAll('.v24dup').forEach(x=>x.remove());
         rows.appendChild(nr);enhanceRow(nr);nr.dispatchEvent(new Event('input',{bubbles:true}));
       };
       clone.querySelector('.bsRemove').onclick=()=>clone.remove();
       clone.addEventListener('click',e=>{if(e.target.classList.contains('v21del'))e.target.parentElement.remove()});
       // Let V23 generate exactly one visual header and total.
       setTimeout(()=>{wireSection(clone);},0);
     };
     actions.insertBefore(b,remove||null);
   }
 }
}
const obs=new MutationObserver(()=>document.querySelectorAll('.budgetSection').forEach(wireSection));
if($('budgetSections'))obs.observe($('budgetSections'),{childList:true,subtree:true});
setTimeout(()=>document.querySelectorAll('.budgetSection').forEach(wireSection),120);

// ---- Tarifa clara para ejecución ----
const amount=$('amount'), igv=$('igv'), calculated=$('calculated'), unitPrice=$('unitPrice'), rate=$('rate');
if(rate){
 let wrap=rate.closest('.panel')?.querySelector('.grid');
 if(wrap&&!$('workRateQty')){
  let l=document.createElement('label');l.id='workRateQtyWrap';l.style.display='none';l.innerHTML='Cantidad / metrado<input id="workRateQty" type="number" step=".01" placeholder="Ej. 120">';
  wrap.insertBefore(l,unitPrice?.closest('label')||null);
  let apply=document.createElement('label');apply.id='applyCalcWrap';apply.style.display='none';apply.innerHTML='Usar cálculo como monto contractual<button type="button" class="btn" id="applyCalc" style="margin-top:6px">Aplicar monto calculado</button>';
  wrap.appendChild(apply);
  let info=document.createElement('div');info.id='igvBreakdown';info.className='v24Igv';wrap.parentElement.appendChild(info);
 }
 function workMode(){return WORK.includes($('type')?.value)}
 function calcWork(){
  if(!workMode())return;
  let q=+$('workRateQty')?.value||+$('area')?.value||0,p=+unitPrice.value||0;
  if(p)calculated.value=(q*p).toFixed(2);
  renderIgv();
 }
 function renderIgv(){
  let a=+amount.value||0, mode=igv.value, sub=a,tax=0,total=a;
  if(mode==='Agregar 18%'){sub=a;tax=a*.18;total=a+tax}
  else if(mode==='Incluido'){total=a;sub=a/1.18;tax=a-sub}
  $('igvBreakdown').innerHTML=`<b>DESGLOSE DEL MONTO</b><span>Subtotal: ${money(sub)}</span><span>IGV (18%): ${money(tax)}</span><strong>Total contractual: ${money(total)}</strong><small>${mode==='No incluido'?'El monto indicado no incluye IGV.':mode==='Incluido'?'El monto ingresado ya contiene el IGV; no se suma nuevamente.':'El IGV se suma al monto base ingresado.'}</small>`;
 }
 function toggleWorkRate(){let w=workMode();$('workRateQtyWrap').style.display=w?'flex':'none';$('applyCalcWrap').style.display=w?'flex':'none';renderIgv()}
 $('workRateQty')?.addEventListener('input',calcWork);unitPrice?.addEventListener('input',calcWork);
 amount?.addEventListener('input',renderIgv);igv?.addEventListener('change',renderIgv);
 $('applyCalc')?.addEventListener('click',()=>{if(calculated.value){amount.value=calculated.value;amount.dispatchEvent(new Event('input',{bubbles:true}))}});
 $('type')?.addEventListener('change',toggleWorkRate);setTimeout(toggleWorkRate,100);
}

// ---- Respaldo general robusto ----
const cfg=[...document.querySelectorAll('#settings button')].find(b=>b.textContent.includes('Exportar respaldo general'));
if(cfg){
 cfg.removeAttribute('onclick');
 cfg.onclick=()=>{
  const data={format:'VISMO_BACKUP',version:24,createdAt:new Date().toISOString(),storage:{}};
  for(let i=0;i<localStorage.length;i++){let k=localStorage.key(i);if(k&&k.toLowerCase().includes('vismo'))data.storage[k]=localStorage.getItem(k)}
  const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'});
  const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=`VISMO-Respaldo-${new Date().toISOString().slice(0,10)}.json`;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1500);
 };
 let imp=document.createElement('label');imp.className='btn';imp.style.marginLeft='8px';imp.innerHTML='Importar respaldo<input type="file" accept=".json,application/json" hidden>';
 cfg.after(imp);imp.querySelector('input').onchange=e=>{let f=e.target.files[0];if(!f)return;let rd=new FileReader();rd.onload=()=>{try{let x=JSON.parse(rd.result);if(x.format==='VISMO_BACKUP'&&x.storage){Object.entries(x.storage).forEach(([k,v])=>localStorage.setItem(k,v));alert('Respaldo VISMO importado correctamente. La página se recargará.');location.reload()}else alert('El archivo no corresponde al respaldo general VISMO.')}catch(err){alert('No se pudo importar el respaldo.')}};rd.readAsText(f)};
}

// ---- Datos + IGV para vista previa/guardado ----
const oldData=window.data;
if(typeof oldData==='function')window.data=function(){
 let d=oldData(),a=+d.amount||0;
 d.rateQty=+$('workRateQty')?.value||0; d.unitPrice=+unitPrice?.value||0; d.calculated=+calculated?.value||0;
 if(d.igv==='Agregar 18%'){d.subtotal=a;d.igvAmount=a*.18;d.contractTotal=a*1.18}
 else if(d.igv==='Incluido'){d.contractTotal=a;d.subtotal=a/1.18;d.igvAmount=a-d.subtotal}
 else {d.subtotal=a;d.igvAmount=0;d.contractTotal=a}
 return d;
};
const oldBODY=window.BODY;
if(typeof oldBODY==='function')window.BODY=function(d){
 let body=oldBODY(d);
 if(!WORK.includes(d.type))return body;
 let a=+d.amount||0,sub=d.subtotal??a,tax=d.igvAmount??0,total=d.contractTotal??a;
 const block=`<div class="contractIgv"><table class="summary"><tr><td>Subtotal</td><td>${money(sub)}</td></tr><tr><td>IGV (18%)</td><td>${money(tax)}</td></tr><tr><th>Total contractual</th><th>${money(total)}</th></tr></table><p>${d.igv==='No incluido'?'<b>El monto contractual no incluye IGV.</b>':d.igv==='Incluido'?'El monto indicado ya incluye IGV.':'Al subtotal se adiciona el IGV del 18%.'}</p></div>`;
 return body.replace(/(<section class="sec"><h3>\d+ — MONTO DEL CONTRATO<\/h3>[\s\S]*?<\/section>)/,m=>m+block);
};
let st=document.createElement('style');st.textContent=`.v24dup{padding:4px 7px!important;border-radius:0!important}.v21row{grid-template-columns:minmax(220px,2fr) 90px 105px 135px 135px 40px 40px!important}.v24Igv{margin-top:14px;border:1px solid #d5bd86;background:#fffaf0;padding:12px 14px;display:grid;grid-template-columns:repeat(3,1fr);gap:8px}.v24Igv>b,.v24Igv>small{grid-column:1/-1}.v24Igv strong{color:#8b6426}.contractIgv{margin:8px 0 18px}@media(max-width:850px){.v21row{min-width:760px!important}.v24Igv{grid-template-columns:1fr}}`;document.head.appendChild(st);
})();
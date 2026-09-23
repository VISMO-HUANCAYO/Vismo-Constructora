(()=>{
const $=id=>document.getElementById(id), esc=s=>String(s??'').replace(/[&<>\"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]));
const WORK_TYPES=['Construcción','Obra a todo costo','Tarrajeo','Enchapados'];
const isWork=()=>WORK_TYPES.includes($('type')?.value);
function panelByTitle(txt){return [...document.querySelectorAll('#new .panel')].find(p=>p.querySelector('h2')?.textContent.includes(txt));}
const municipalPanel=panelByTitle('PLAZOS Y MUNICIPALIDAD');
const rulesPanel=panelByTitle('CONDICIONES IMPORTANTES');
const designPanel=$('interviewPrompt');
const spouse=$('projectSpouse');
if(spouse){
  let wrap=document.createElement('div');wrap.id='workSecondContractor';wrap.className='secondContractorToggle';wrap.innerHTML='<label class="inlineCheck"><input type="checkbox" id="twoContractors"> Contrato a nombre de dos personas</label><p class="hint">Actívalo solo cuando el contrato de ejecución deba figurar a nombre de ambos contratantes.</p>';
  spouse.parentNode.insertBefore(wrap,spouse);
  $('twoContractors').addEventListener('change',()=>{spouse.style.display=$('twoContractors').checked?'grid':'none'});
}
function applyMode(){
  let w=isWork();
  if(municipalPanel) municipalPanel.style.display=w?'none':'';
  if(rulesPanel) rulesPanel.style.display=w?'none':'';
  if(designPanel) designPanel.style.display=w?'none':'';
  if($('workBudgetPanel')) $('workBudgetPanel').style.display=w?'block':'none';
  let mf=$('municipalFees')?.closest('label'); if(mf&&w) mf.style.display='none';
  if($('workSecondContractor')) $('workSecondContractor').style.display=w?'block':'none';
  if(spouse){ if(w) spouse.style.display=$('twoContractors')?.checked?'grid':'none'; else spouse.style.display=''; }
  if($('workBudgetPanel')){
    let h=$('workBudgetPanel').querySelector('h2'); if(h) h.textContent='04 · ESPECIFICACIONES TÉCNICAS Y PRESUPUESTO DE MATERIALES Y MANO DE OBRA';
  }
}
$('type')?.addEventListener('change',()=>setTimeout(applyMode,0));
$('type')?.addEventListener('input',()=>setTimeout(applyMode,0));
setTimeout(applyMode,50);

// Convierte cada cuadro de presupuesto en una tabla visual editable.
function enhanceSection(sec){
 if(sec.dataset.v23)return; sec.dataset.v23='1';
 let rows=sec.querySelector('.bsRows'); if(!rows)return;
 let head=document.createElement('div');head.className='v23BudgetHead';head.innerHTML='<b>DESCRIPCIÓN / PARTIDA</b><b>UNIDAD</b><b>METRADO</b><b>P. UNITARIO (S/)</b><b>TOTAL (S/)</b><b></b>';rows.before(head);
 let total=document.createElement('div');total.className='v23BudgetTotal';total.innerHTML='<b>TOTAL DEL CUADRO</b><strong>S/ 0.00</strong>';rows.after(total);
 let update=()=>{let sum=0;sec.querySelectorAll('.v21row').forEach(r=>{let q=+r.querySelector('.bqty')?.value||0,p=+r.querySelector('.bpu')?.value||0,t=+r.querySelector('.btotal')?.value||q*p;if(r.querySelector('.btotal')&&!r.querySelector('.btotal').value&&q&&p)r.querySelector('.btotal').value=(q*p).toFixed(2);sum+=t});total.querySelector('strong').textContent='S/ '+sum.toLocaleString('es-PE',{minimumFractionDigits:2,maximumFractionDigits:2})};
 sec.addEventListener('input',update);sec.addEventListener('click',()=>setTimeout(update,0));update();
}
function enhanceAll(){document.querySelectorAll('.budgetSection').forEach(enhanceSection)}
$('addBudgetSection')?.addEventListener('click',()=>setTimeout(enhanceAll,0));
$('budgetSections')?.addEventListener('click',()=>setTimeout(enhanceAll,0));setTimeout(enhanceAll,80);

// Datos adicionales exclusivos de ejecución.
const prevData=window.data;
if(typeof prevData==='function') window.data=function(){let d=prevData();d.twoContractors=!!$('twoContractors')?.checked;if(isWork()&&!d.twoContractors){d.spouseName='';d.spouseDni='';d.spousePhone='';d.spouseEmail='';}return d};
function money(n){return 'S/ '+(+n||0).toLocaleString('es-PE',{minimumFractionDigits:2,maximumFractionDigits:2})}
function budgetTable(s){let total=0;let rows=(s.rows||[]).map(r=>{let t=+r.total||(+r.qty||0)*(+r.pu||0);total+=t;return `<tr><td>${esc(r.desc)}</td><td>${esc(r.unit)}</td><td>${r.qty||''}</td><td>${money(r.pu)}</td><td>${money(t)}</td></tr>`}).join('');return `<h3>${esc(s.title)}${s.kind?' · '+esc(s.kind):''}</h3><table class="contractBudget"><thead><tr><th>DESCRIPCIÓN / PARTIDA</th><th>UNIDAD</th><th>METRADO</th><th>P. U.</th><th>TOTAL</th></tr></thead><tbody>${rows}<tr><td colspan="4"><b>TOTAL ${esc(s.title)}</b></td><td><b>${money(total)}</b></td></tr></tbody></table>`}
function workParties(d){let second=d.twoContractors&&d.spouseName?` y <b>${esc(d.spouseName)}</b>${d.spouseDni?`, identificado(a) con DNI/CE N.° ${esc(d.spouseDni)}`:''}`:'';return `<p>Consta del presente documento el contrato de <b>${esc(d.contractName||d.type)}</b>, celebrado por una parte por <span class="companyContractText">Corporación Visión & Modernidad “VISMOCORP”, con RUC N.° 20607812803</span>, en adelante <b>EL EJECUTOR</b>; y de la otra parte <b>${esc(d.client||'EL CONTRATANTE')}</b>${d.dni?`, identificado(a) con DNI/RUC N.° ${esc(d.dni)}`:''}${second}${d.address?`, domiciliado(a) en ${esc(d.address)}`:''}, en adelante <b>EL CONTRATANTE</b>.</p>`}
const prevBody=window.BODY;
if(typeof prevBody==='function') window.BODY=function(d){
 if(!WORK_TYPES.includes(d.type)) return prevBody(d);
 let n=1,body=workParties(d);
 body+=sec(n++,'OBJETO DEL CONTRATO',`<p>El presente contrato tiene por objeto la ejecución del servicio de <b>${esc(d.contractName||d.type)}</b> en el proyecto ubicado en <b>${esc(d.site||'la ubicación indicada')}</b>, conforme a los planos, metrados, especificaciones, partidas y condiciones acordadas.</p>`);
 body+=sec(n++,'ALCANCE DE LA EJECUCIÓN',`${d.scope?.length?ul(d.scope):''}${d.notes?`<p>${esc(d.notes).replace(/\n/g,'<br>')}</p>`:''}${d.workExclusions?`<p><b>Exclusiones / precisiones:</b> ${esc(d.workExclusions).replace(/\n/g,'<br>')}</p>`:''}`);
 if(d.budgetSections?.length) body+=sec(n++,'ESPECIFICACIONES TÉCNICAS Y PRESUPUESTO DE MATERIALES Y MANO DE OBRA',d.budgetSections.map(budgetTable).join(''));
 body+=sec(n++,'DISPOSICIONES DE EJECUCIÓN',`<p>Los trabajos se ejecutarán conforme al alcance contratado y a las especificaciones incorporadas al presente documento. Las condiciones sobre materiales, herramientas, seguridad, responsabilidades y variaciones podrán precisarse mediante las cláusulas adicionales.</p>`);
 body+=sec(n++,'INICIO Y PLAZO DE EJECUCIÓN',`<p>Inicio previsto: <b>${esc(d.start||'por definir')}</b>. El plazo de ejecución será el establecido por las partes para la obra o servicio contratado.</p>`);
 body+=sec(n++,'MONTO DEL CONTRATO',`<p>El monto contractual asciende a <b>${money(d.amount)}</b>. ${d.igv==='Agregar 18%'?'Al monto indicado se agregará el IGV correspondiente.':d.igv==='Incluido'?'El monto contractual incluye IGV.':'<b>El monto contractual no incluye IGV.</b>'}</p>`);
 body+=sec(n++,'FORMA DE PAGO',pays(d));
 if(Array.isArray(d.customClauses))d.customClauses.forEach(c=>{if(c?.content)body+=sec(n++,c.title||'CONDICIÓN ESPECIAL',`<p>${esc(c.content).replace(/\n/g,'<br>')}</p>`)});
 body+=sec(n++,'CONFORMIDAD',`<p>En señal de conformidad, las partes suscriben el presente contrato.</p>`);return body;
};
let st=document.createElement('style');st.textContent=`
#workSecondContractor{grid-column:1/-1;border:1px solid #ded5c7;padding:12px 14px;border-radius:8px;background:#faf8f4}.inlineCheck{display:flex!important;flex-direction:row!important;align-items:center;gap:8px;font-weight:700}.inlineCheck input{width:auto}.v23BudgetHead,.v21row{display:grid!important;grid-template-columns:minmax(240px,2fr) 100px 120px 150px 150px 42px;gap:0!important;align-items:stretch}.v23BudgetHead>*{background:#f2eee7;border:1px solid #d8d0c5;padding:9px 8px;font-size:11px;text-align:center}.v21row input,.v21row select{border-radius:0!important;border:1px solid #ddd4c7!important;min-width:0;padding:8px!important}.v21row .v21del{border-radius:0!important;padding:4px!important}.v23BudgetTotal{margin-left:auto;width:300px;display:grid;grid-template-columns:1fr 1fr;border:1px solid #d2b16d;background:#fbf2dc;margin-top:8px}.v23BudgetTotal>*{padding:10px;text-align:center}.budgetSection{overflow-x:auto}.budgetSection>.grid{grid-template-columns:1fr 1fr}@media(max-width:850px){.v23BudgetHead,.v21row{grid-template-columns:220px 90px 100px 120px 120px 40px;min-width:690px}}`;
document.head.appendChild(st);
})();

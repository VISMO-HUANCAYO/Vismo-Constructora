(()=>{
const $=id=>document.getElementById(id), esc=s=>String(s??'').replace(/[&<>"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]));
let editIndex=null, duplicateMode=false;
function setVal(id,v){let e=$(id);if(e&&v!==undefined&&v!==null)e.value=v}
function fire(e){if(e){e.dispatchEvent(new Event('change',{bubbles:true}));e.dispatchEvent(new Event('input',{bubbles:true}))}}
function loadContract(i,duplicate=false){
 const c=(typeof contracts!=='undefined'?contracts[i]:null); if(!c)return;
 editIndex=duplicate?null:i; duplicateMode=duplicate;
 setVal('type',c.type); fire($('type'));
 setTimeout(()=>{
  setVal('customServiceName',c.contractName||c.type); $('customServiceName')?.setAttribute('data-edited','1');
  setVal('projectType',c.projectType); fire($('projectType'));
  ['client','dni','phone','email','civilStatus','spouseName','spouseDni','spousePhone','spouseEmail','address','site','landArea','area','levels','fronts','start','notes','architectureDays','specialtyDays','clientDocsDays','communication','municipalFees','plansByVismo','rooms','revisions','workMode','workerInsurance','otherIncluded','workExclusions','measurements'].forEach(id=>setVal(id,c[id]));
  if(c.twoContractors&&$('twoContractors')){$('twoContractors').checked=true;fire($('twoContractors'))}
  document.querySelectorAll('#scope input[type=checkbox]').forEach(x=>x.checked=(c.scope||[]).includes(x.value));
  // restore payments
  if($('payments')){$('payments').innerHTML='';(c.payments||[]).forEach(x=>$('payments').insertAdjacentHTML('beforeend',`<div class="payrow"><input class="pdesc" value="${esc(x.desc)}"><input class="pamt" type="number" step=".01" value="${+x.amount||0}"><button type="button" class="btn" onclick="this.parentElement.remove();checkPay()">×</button></div>`));$('payments').querySelectorAll('input').forEach(x=>x.oninput=window.checkPay||null)}
  // restore structured budget from scratch using the existing add-section control, then populate
  if($('budgetSections')&&Array.isArray(c.budgetSections)){
    $('budgetSections').innerHTML='';
    c.budgetSections.forEach((s,si)=>{
      $('addBudgetSection')?.click();
      let sec=[...document.querySelectorAll('.budgetSection')].at(-1);if(!sec)return;
      setValIn(sec,'.bsTitle',s.title);setValIn(sec,'.bsKind',s.kind);
      let rows=sec.querySelector('.bsRows');rows.innerHTML='';
      (s.rows||[]).forEach(r=>{
        sec.querySelector('.bsAdd')?.click();let row=rows.querySelector('.v21row:last-child');if(!row)return;
        setValIn(row,'.bdesc',r.desc);setValIn(row,'.bunit',r.unit);setValIn(row,'.bqty',r.qty);setValIn(row,'.bpu',r.pu);setValIn(row,'.btotal',r.total||((+r.qty||0)*(+r.pu||0)));
      });
      if(!(s.rows||[]).length)sec.querySelector('.bsAdd')?.click();
      sec.dispatchEvent(new Event('input',{bubbles:true}));
    });
  }
  if($('customClauses')){$('customClauses').innerHTML='';(c.customClauses||[]).forEach(x=>typeof addCustomClause==='function'?addCustomClause(x.title,x.content):null)}
  setVal('amount',c.amount);setVal('igv',c.igv);fire($('amount'));fire($('igv'));
  setVal('workRateQty',c.rateQty);setVal('unitPrice',c.unitPrice);fire($('unitPrice'));
  let submit=document.querySelector('#form .actions button.gold');if(submit)submit.textContent=duplicate?'Guardar como nuevo contrato':'Guardar cambios del contrato';
  let title=document.querySelector('#new h1');if(title)title.textContent=duplicate?'Duplicar contrato':'Editar contrato';
  show('new');window.scrollTo({top:0,behavior:'smooth'});
 },120);
}
function setValIn(root,sel,v){let e=root.querySelector(sel);if(e&&v!==undefined&&v!==null)e.value=v}
window.editContract=i=>loadContract(i,false);
window.duplicateContract=i=>loadContract(i,true);

// Replace save handler in capture phase so editing updates and duplication creates a new code.
const form=$('form');
if(form)form.addEventListener('submit',e=>{
 if(editIndex===null&&!duplicateMode)return; // normal original handler handles ordinary new contracts
 e.preventDefault();e.stopImmediatePropagation();
 let d=(typeof window.data==='function'?window.data():data());
 if(editIndex!==null){
   d.code=contracts[editIndex].code; contracts[editIndex]=d;
 }else{
   d.code=`VISMO-${({Construcción:'CON','Obra a todo costo':'CON',Tarrajeo:'TAR',Enchapados:'ENC'}[d.type]||'OTR')}-${new Date().getFullYear()}-${String(contracts.length+1).padStart(3,'0')}`;
   contracts.push(d);
 }
 localStorage.setItem('vismoProjectsV8Contracts',JSON.stringify(contracts));
 editIndex=null;duplicateMode=false;
 let submit=document.querySelector('#form .actions button.gold');if(submit)submit.textContent='Guardar proyecto';
 let title=document.querySelector('#new h1');if(title)title.textContent='Ficha + contrato';
 document.getElementById('count').textContent=contracts.length;show('projects');
},true);

// Inject Edit/Duplicate actions every time the project list is rendered.
const list=$('projectList');
if(list)new MutationObserver(()=>{
 [...list.querySelectorAll('.listitem')].forEach((row,i)=>{
   let actions=row.querySelector('.projectActions');if(!actions||actions.querySelector('.v26edit'))return;
   let e=document.createElement('button');e.className='btn v26edit';e.textContent='Editar contrato';e.onclick=()=>loadContract(i,false);
   let d=document.createElement('button');d.className='btn v26dup';d.textContent='Duplicar contrato';d.onclick=()=>loadContract(i,true);
   actions.append(e,d);
 });
}).observe(list,{childList:true,subtree:true});
})();
(()=>{
const SB_URL='https://mavbxtmvfzjebbjhchys.supabase.co';
const SB_KEY='sb_publishable_n3iVi9rX64IUW6yWvwg0xw_cgBPkhSD';
const SESSION='vismo_sb_session';
const MAP={
 'vismoProjectsV8Contracts':'contratos',
 'vismo_requerimientos':'entrevistas',
 'vismoRequisitos':'requisitos',
 'vismoProjectsV8Timelines':'cronogramas',
 'vismo_catalogo_respuestas':'fachadas'
};
const getSession=()=>{try{return JSON.parse(localStorage.getItem(SESSION)||'null')}catch{return null}};
async function request(path,opt={}){
 let s=getSession(),h={'apikey':SB_KEY,'Content-Type':'application/json',...(opt.headers||{})};
 if(s?.access_token)h.Authorization='Bearer '+s.access_token;
 let r=await fetch(SB_URL+path,{...opt,headers:h});let t=await r.text(),j;try{j=t?JSON.parse(t):null}catch{j=t}
 if(!r.ok)throw new Error(j?.msg||j?.message||t||('HTTP '+r.status));return j
}
async function login(email,password){
 let s=await request('/auth/v1/token?grant_type=password',{method:'POST',body:JSON.stringify({email,password})});
 localStorage.setItem(SESSION,JSON.stringify(s));return s
}

function logout(){localStorage.removeItem(SESSION)}
async function sendRecovery(email,redirectTo){
 const url=SB_URL+'/auth/v1/recover?redirect_to='+encodeURIComponent(redirectTo);
 let r=await fetch(url,{
   method:'POST',
   headers:{'apikey':SB_KEY,'Authorization':'Bearer '+SB_KEY,'Content-Type':'application/json'},
   body:JSON.stringify({email})
 });
 let t=await r.text();
 if(!r.ok){let j;try{j=JSON.parse(t)}catch{};throw new Error(j?.msg||j?.message||j?.error_description||t||('HTTP '+r.status))}
 return true;
}
function captureRecoverySession(){
 let hash=new URLSearchParams(location.hash.replace(/^#/,''));
 let query=new URLSearchParams(location.search);
 let access=hash.get('access_token')||query.get('access_token');
 let refresh=hash.get('refresh_token')||query.get('refresh_token');
 let type=hash.get('type')||query.get('type');
 if(access){
   localStorage.setItem(SESSION,JSON.stringify({access_token:access,refresh_token:refresh||'',token_type:'bearer'}));
   return {recovery:type==='recovery',access_token:access};
 }
 return {recovery:false};
}
async function updatePassword(password){
 let s=getSession(); if(!s?.access_token)throw new Error('Sesión de recuperación no encontrada');
 return request('/auth/v1/user',{method:'PUT',body:JSON.stringify({password})});
}

async function pull(){
 let rows=await request('/rest/v1/vismo_data?select=id,tipo,datos&order=actualizado_en.desc');
 let by={};(rows||[]).forEach(r=>by[r.tipo]=r.datos);
 Object.entries(MAP).forEach(([k,t])=>{if(by[t]!==undefined)localStorage.setItem(k,JSON.stringify(by[t]))});
 localStorage.setItem('vismoLastSync',new Date().toISOString());return rows
}
async function pushKey(k){
 let tipo=MAP[k];if(!tipo)return;let raw=localStorage.getItem(k);if(raw===null)return;
 let datos;try{datos=JSON.parse(raw)}catch{return}
 await request('/rest/v1/vismo_data?on_conflict=id',{method:'POST',headers:{'Prefer':'resolution=merge-duplicates,return=minimal'},body:JSON.stringify({id:'global_'+tipo,tipo,datos,actualizado_en:new Date().toISOString()})})
}
async function pushAll(){for(const k of Object.keys(MAP))await pushKey(k);localStorage.setItem('vismoLastSync',new Date().toISOString())}
function installStorageSync(){
 const orig=Storage.prototype.setItem;
 Storage.prototype.setItem=function(k,v){orig.call(this,k,v);if(this===localStorage&&MAP[k]&&getSession()?.access_token)setTimeout(()=>pushKey(k).catch(console.error),0)};
}
window.VismoCloud={login,logout,sendRecovery,captureRecoverySession,updatePassword,pull,pushAll,pushKey,getSession,MAP};
installStorageSync();
})();

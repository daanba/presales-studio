/* =============================================================================
 * PRESALES STUDIO - VERSIONED JSON CATALOG LOADER
 * Copyright (C) 2026 DAMIR OMERASEVIC. All rights reserved.
 * Author  : DAMIR OMERASEVIC
 * File    : catalog-loader.js
 * Purpose : Load four canonical JSON catalogs and apply local editable drafts.
 * Version : 1.3.0
 * Security: Static same-origin fetch; no server API or credentials.
 * ============================================================================= */
"use strict";
(function(){
const CACHE_KEY="presales-studio-v1.4-catalog-draft";
const FILES={
 ciscoPortfolio:"data/cisco-portfolio.json",
 fortinetPortfolio:"data/fortinet-portfolio.json",
 ciscoRefresh:"data/cisco-refresh.json",
 fortinetRefresh:"data/fortinet-refresh.json"
};
const groups=Object.keys(FILES);
function isObject(v){return v!==null&&typeof v==="object"&&!Array.isArray(v)}
function text(v){return typeof v==="string"?v.trim():""}
function validate(k,list){
 if(!Array.isArray(list))throw Error(k+": JSON mora biti niz zapisa.");
 const ids=new Set(),errors=[];
 if(list.length>1000)errors.push("Previše zapisa (max 1000)");
 list.forEach((r,i)=>{
  if(!isObject(r)){errors.push("#"+(i+1)+": zapis mora biti objekat");return}
  if(k.endsWith("Portfolio")){
   const req=["id","vendor","name","category","capacityType","source","status"];
   req.forEach(f=>{if(!text(r[f]))errors.push("#"+(i+1)+" nedostaje "+f)});
   if(ids.has(r.id))errors.push("#"+(i+1)+" dupli id "+r.id);ids.add(r.id);
   ["firewallGbps","ngfwGbps","tlsGbps","ipsGbps"].forEach(f=>{if(r[f]!==null&&r[f]!==undefined&&(typeof r[f]!=="number"||!Number.isFinite(r[f])||r[f]<0))errors.push("#"+(i+1)+" nevažeći "+f)});
   if(!["firewall","switch","wireless","management","other"].includes(r.capacityType))errors.push("#"+(i+1)+" nepoznat capacityType "+r.capacityType);
  }else{
   ["vendor","legacy","target","confidence","checks","source"].forEach(f=>{if(!text(r[f]))errors.push("#"+(i+1)+" nedostaje "+f)});
  }
  const vendor=k.startsWith("cisco")?"Cisco":"Fortinet";
  if(r.vendor!==vendor)errors.push("#"+(i+1)+" vendor mora biti "+vendor);
  if(typeof r.source==="string"&&!/^https:\/\/[^ ]+/i.test(r.source))errors.push("#"+(i+1)+" HTTPS službeni URL obavezan");
 });
 if(errors.length)throw Error(errors.slice(0,10).join("\n")+(errors.length>10?"\n... ("+errors.length+" problema)":""));
 return true;
}
async function loadSource(){
 const out={};
 for(const [k,path] of Object.entries(FILES)){
  const resp=await fetch(path+"?v=1.4.0",{cache:"no-store"});
  if(!resp.ok)throw Error("Ne mogu učitati "+path+" (HTTP "+resp.status+")");
  out[k]=await resp.json();
  validate(k,out[k]);
 }
 return out;
}
function getDraft(){
 try{const draft=JSON.parse(localStorage.getItem(CACHE_KEY));if(!draft)return null;
   for(const k of groups)validate(k,draft[k]);return draft;
 }catch(e){console.warn("Nevažeći lokalni draft:",e);return null}
}
function apply(cats){
 window.PRESALES_DATA.models=[...cats.ciscoPortfolio,...cats.fortinetPortfolio];
 window.PRESALES_DATA.refresh=[...cats.ciscoRefresh,...cats.fortinetRefresh];
 window.PRESALES_CATALOG_ACTIVE=cats;
}
function download(name,text,kind="application/json"){const a=document.createElement("a");const url=URL.createObjectURL(new Blob([text],{type:kind}));a.href=url;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000)}
function next(script){
 const s=document.createElement("script");s.src=script;s.onerror=()=>{document.getElementById("main").textContent="Greška: aplikacijski skript nije učitan."};
 if(script==="admin.js")s.onload=()=>{const m=document.createElement("script");m.src="vendor-sync.js";document.body.appendChild(m)};
 document.body.appendChild(s);
}
window.PRESALES_CATALOG={
 FILES,CACHE_KEY,validate,download,
 setDraft(data){for(const k of groups)validate(k,data[k]);localStorage.setItem(CACHE_KEY,JSON.stringify(data));apply(data)},
 clearDraft(){localStorage.removeItem(CACHE_KEY);apply(window.PRESALES_CATALOG_BASE)},
 getDraft,
 getActive(){return JSON.parse(JSON.stringify(window.PRESALES_CATALOG_ACTIVE))},
 getBase(){return JSON.parse(JSON.stringify(window.PRESALES_CATALOG_BASE))},
 groups
};
(async()=>{
 try{
  const [base,coreResponse]=await Promise.all([loadSource(),fetch("data/core.json?v=1.4.0",{cache:"no-store"})]);
  if(!coreResponse.ok)throw Error("Ne mogu učitati data/core.json (HTTP "+coreResponse.status+")");
  const core=await coreResponse.json();
  if(!core || !core.discovery || !Array.isArray(core.qa) || !Array.isArray(core.catalog) || !core.sources)throw Error("Core JSON schema nije validna");
  Object.assign(window.PRESALES_DATA,core);
  window.PRESALES_CATALOG_BASE=base;
  apply(getDraft()||base);window.PRESALES_CATALOG_READY=true;
  const onAdmin=window.location.pathname.endsWith("/admin.html");
  next(onAdmin?"admin.js":"app.js");
 }catch(e){
  console.error(e);
  document.getElementById("main").innerHTML=
    '<div class="card"><h2>Nije moguće učitati JSON katalog</h2><p>Za lokalni rad pokreni <code>python3 -m http.server 8000</code> i otvori aplikaciju preko http://localhost:8000. Provjeri datoteke u <code>data/</code>.</p><pre id="errDetail"></pre></div>';
  document.getElementById("errDetail").textContent=e.message;
 }
})();
})();

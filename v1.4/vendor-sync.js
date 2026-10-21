/* =============================================================================
 * PRESALES STUDIO | VENDOR CATALOG IMPORT & CONTROLLED MERGE
 * Copyright (C) 2026 DAMIR OMERASEVIC. All rights reserved.
 * Author: DAMIR OMERASEVIC | Version: 1.4
 * No hidden vendor APIs. Official sites supply documents, not guaranteed CORS JSON.
 * ============================================================================= */
"use strict";
(function(){
const refs={
 Cisco:"https://www.cisco.com/c/en/us/products/index.html",
 Fortinet:"https://www.fortinet.com/products"
};
let staged=[], vendor="Cisco", currentGroup="ciscoPortfolio", arrival="";
const safe=x=>String(x??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
function getRecords(data){
 if(Array.isArray(data))return data;
 if(data&&Array.isArray(data.products))return data.products;
 if(data&&Array.isArray(data.models))return data.models;
 throw Error("JSON mora biti niz modela ili objekt sa poljem products/models. Vendor PDF/HTML nije automatski parsiran.");
}
function norm(r,i){
 const out={...r};
 if(!out.id||!out.name||!out.vendor||!out.capacityType||!out.source||!out.status)
   throw Error("Zapis #"+(i+1)+": potrebna polja id, name, vendor, capacityType, source, status. Koristi predložak za standardizaciju.");
 if(out.vendor!==vendor)throw Error("Vendor zapisa #"+(i+1)+" nije "+vendor);
 for(const k of ["firewallGbps","ngfwGbps","ipsGbps","tlsGbps"]){
  if(out[k]===""||out[k]===undefined)out[k]=null;
  else if(out[k]!==null){out[k]=Number(out[k]);if(!Number.isFinite(out[k])||out[k]<0)throw Error("Neispravan broj "+k+" u #"+(i+1));}
 }
 return out;
}
function template(){
 const x={id:"vendor-model-unique-id",vendor,name:"NAZIV MODELA",category:"NGFW",profile:"NGFW",capacityType:"firewall",firewallGbps:null,ngfwGbps:null,ipsGbps:null,tlsGbps:null,interfaces:"",method:"Navedi profil mjerenja",notes:"",source:refs[vendor],status:"MODEL SPECS PENDING",verifiedOn:""};
 C.download(vendor.toLowerCase()+"-catalog-template.json",JSON.stringify([x],null,2));
}
function panel(){
 const old=document.getElementById("vendorSyncPanel");
 if(old)return;
 const target=document.querySelector(".admin-actions");
 if(!target)return;
 const box=document.createElement("section");
 box.className="card";box.id="vendorSyncPanel";box.style.margin="16px 0";box.innerHTML=`
 <h3>↻ Cisco / Fortinet katalog — kontrolisani uvoz i merge (v1.4)</h3>
 <p>Proizvođači ne nude ovdje garantovan univerzalni javni CORS/JSON feed. <b>Otvori službeni katalog</b>, preuzmi ili pripremi standardizovani JSON i pregledaj promjene <b>prije</b> primjene. URL povlačenje radi samo sa HTTPS JSON izvorima koji dozvoljavaju browser CORS.</p>
 <p><button class="btn" id="officialCisco">🌐 Cisco – službeni katalog ↗</button>
 <button class="btn" id="officialFortinet">🌐 Fortinet – službeni katalog ↗</button>
 <button class="btn" id="templateSync">↓ JSON predložak</button></p>
 <div style="display:flex;flex-wrap:wrap;gap:10px;align-items:center">
 <label>Proizvođač <select id="syncVendor" class="input"><option>Cisco</option><option>Fortinet</option></select></label>
 <label>Datoteka <input class="input" type="file" accept=".json,application/json" id="syncFile"></label>
 <label style="min-width:280px;flex:1">HTTPS izvor JSON (uz CORS) <input id="syncUrl" class="input" type="url" placeholder="https://.../normalized-products.json"></label>
 <button class="btn" id="syncFetch">⇩ Povuci JSON</button></div>
 <div class="notice"><b>Sigurnosno pravilo:</b> novi i izmijenjeni uređaji su samo prijedlog; nijedna postojeća metrika se ne prepisuje bez tvog izbora. Nije službeni vendor API. Službeni datasheet, metodologija i double-check obavezni.</div>
 <div id="syncPreview" aria-live="polite"></div>
 <hr><h3>⇄ Guided Technology Refresh — kandidat, NE automatska 1:1 zamjena</h3>
 <p>Koraci: 1) evidentiraj stari model, 2) izaberi novi model, 3) pregledaj interfejse, portove, licence, NGFW/TLS/HA i lifecycle, 4) provjeri migraciju konfiguracije i rollback, 5) zatraži Vendor SE double-check, 6) dodaj kandidat-mapiranje u Refresh editor.</p>
 <div style="display:flex;flex-wrap:wrap;gap:10px">
 <label>Stara oprema <input class="input" id="replaceOld" placeholder="npr. FortiGate 60F"></label>
 <label>Novi model <select id="replaceNew" class="input"></select></label>
 <button class="btn" id="replacementPreview">Predloži refresh</button></div>
 <div id="replaceResult"></div>`;
 target.insertAdjacentElement("afterend",box);
 document.getElementById("syncVendor").value=vendor;
 const modelSelect=document.getElementById("replaceNew");
 modelSelect.innerHTML=working[groupKey()].map(x=>`<option value="${safe(x.id)}">${safe(x.name)}</option>`).join("");
}
function groupKey(){return vendor==="Cisco"?"ciscoPortfolio":"fortinetPortfolio"}
function preview(){
 const el=document.getElementById("syncPreview");if(!el)return;
 if(!staged.length){el.innerHTML="<p>Nema uvezenih prijedloga.</p>";return}
 currentGroup=groupKey();
 const orig=working[currentGroup];
 const byId=new Map(orig.map(x=>[String(x.id).toLowerCase(),x]));
 let adds=0,changes=0,same=0;
 const rows=staged.map((r,i)=>{
  const prior=byId.get(String(r.id).toLowerCase());
  const identical=prior&&JSON.stringify(prior)===JSON.stringify(r);
  if(!prior)adds++;else if(identical)same++;else changes++;
  const differences=prior?Object.keys(r).filter(k=>JSON.stringify(prior[k])!==JSON.stringify(r[k])).slice(0,25):[];
  return `<tr><td>${i+1}</td><td>${safe(r.name)}<br><small>${safe(r.id)}</small></td><td>${!prior?"NOVO":identical?"IDENTIČNO":"KONFLIKT"}<br><small>${safe(differences.join(", "))}</small></td><td>
   <select class="input" data-syncchoice="${i}">
   <option value="skip" selected>Preskoči</option>
   ${!prior?'<option value="add">Dodaj</option>':'<option value="fill">Popuni samo prazna polja</option><option value="replace">Zamijeni cijeli zapis</option>'}
   </select></td></tr>`;
 });
 el.innerHTML=`<p><b>${safe(arrival)}</b> · ${staged.length} kandidata · novo ${adds}, promjene ${changes}, identično ${same}</p>
 <div style="overflow:auto;max-height:350px"><table style="width:100%;border-collapse:collapse"><thead><tr><th>#</th><th>Model</th><th>Usporedba</th><th>Odluka po modelu</th></tr></thead><tbody>${rows.join("")}</tbody></table></div>
 <p><button class="btn primary" id="applySync">✓ Primijeni odabrane promjene u editor</button>
 <button class="btn" id="clearSync">Odbaci prijedlog</button></p>
 <p><small>Primjena mijenja samo lokalni editor. Potom klikni <b>Validiraj & snimi lokalno</b> i <b>Izvezi JSON</b>; GitHub se nikada ne ažurira automatski.</small></p>`;
}
async function receive(txt,label){
 if(txt.length>4e6)throw Error("Datoteka/odgovor prevelik (4 MB).");
 const rows=getRecords(JSON.parse(txt));if(rows.length>1000)throw Error("Previše stavki (1000 max).");
 staged=rows.map(norm);
 const ids=new Set();for(const r of staged){if(ids.has(r.id))throw Error("Dupli id u uvozu: "+r.id);ids.add(r.id)}
 arrival=label;preview();
}
function apply(){
 const decisions=[...document.querySelectorAll("[data-syncchoice]")];
 const key=groupKey(),existing=working[key],index=new Map(existing.map((x,i)=>[String(x.id).toLowerCase(),i]));
 const backup=JSON.parse(JSON.stringify(existing));let count=0;
 try{
  decisions.forEach(sel=>{
   const pos=Number(sel.dataset.syncchoice),choice=sel.value,r=staged[pos],idx=index.get(String(r.id).toLowerCase());
   if(choice==="skip")return;
   if(choice==="add"&&idx===undefined){existing.push({...r});index.set(String(r.id).toLowerCase(),existing.length-1);count++}
   if(choice==="replace"&&idx!==undefined){existing[idx]={...r};count++}
   if(choice==="fill"&&idx!==undefined){
    const next={...existing[idx]};
    for(const [key,val] of Object.entries(r))if((next[key]===null||next[key]===undefined||next[key]==="")&&val!==null&&val!==undefined&&val!=="")next[key]=val;
    existing[idx]=next;count++;
   }
  });
  C.validate(key,existing);
 }catch(e){working[key]=backup;throw e}
 dirty=true;selected=0;group=key;filter="";render();panel();staged=[];notice(count+" promjena primijenjeno u lokalni editor. Obavezno provjeri izvore, zatim Validiraj & snimi lokalno.","ok");
}
document.addEventListener("click",async e=>{
 const id=e.target.id;
 if(id==="officialCisco"||id==="officialFortinet"){window.open(refs[id==="officialCisco"?"Cisco":"Fortinet"],"_blank","noopener,noreferrer");return}
 if(id==="templateSync"){template();return}
 if(id==="replacementPreview"){
  const old=document.getElementById("replaceOld").value.trim(),idNew=document.getElementById("replaceNew").value;
  const target=working[groupKey()].find(r=>r.id===idNew);
  if(!old||!target){alert("Odaberi stari i novi model.");return}
  const msg=`KANDIDAT – NIJE 1:1. Provjeri funkcionalni parity: ${target.category||"?"}; portove i module (${target.interfaces||"nepoznato"}); FPS/NGFW/TLS prema opterećenju; VPN, routing, HA, verziju FW i politike; migracijski alat, konfiguraciju i rollback; licence, support, EoL, regionalnu dostupnost. Izvor: ${target.source}`;
  document.getElementById("replaceResult").innerHTML=`<div class="notice"><b>${safe(old)} → ${safe(target.name)}</b><p>${safe(msg)}</p><button id="addRefreshCandidate" class="btn primary">＋ Dodaj kandidat u Refresh editor</button></div>`;
  window._replacementCandidate={vendor,legacy:old,target:target.name,confidence:"KANDIDAT – NIJE 1:1",checks:msg,source:target.source};
  return;
 }
 if(id==="addRefreshCandidate"){
  const r=window._replacementCandidate;if(!r)return;
  const k=r.vendor==="Cisco"?"ciscoRefresh":"fortinetRefresh";
  working[k].push({...r});dirty=true;group=k;selected=working[k].length-1;render();panel();
  notice("Refresh kandidat dodat lokalno. Provjeri i snimi, pa izvezi JSON. Vendor SE odobrenje obavezno.","ok");return;
 }
 if(id==="clearSync"){staged=[];preview();return}
 if(id==="applySync"){try{apply()}catch(err){alert(err.message)}return}
 if(id==="syncFetch"){
  try{
   const url=document.getElementById("syncUrl").value.trim();
   if(!/^https:\/\//i.test(url))throw Error("Potrebna je HTTPS adresa.");
   const ctrl=new AbortController(),timer=setTimeout(()=>ctrl.abort(),12000);
   try{const res=await fetch(url,{mode:"cors",signal:ctrl.signal,credentials:"omit",cache:"no-store"});if(!res.ok)throw Error("HTTP "+res.status);await receive(await res.text(),url)}
   finally{clearTimeout(timer)}
  }catch(err){alert("Povlačenje nije uspjelo: "+err.message+". Koristi službeni katalog i lokalno pripremljen JSON predložak.")}return}
});
document.addEventListener("change",async e=>{
 if(e.target.id==="syncVendor"){vendor=e.target.value;staged=[];preview()}
 if(e.target.id==="syncFile"){
  try{if(e.target.files[0])await receive(await e.target.files[0].text(),e.target.files[0].name)}
  catch(err){alert("Uvoz nije uspio: "+err.message)}
 }
});
const observer=new MutationObserver(()=>{if(!document.getElementById("vendorSyncPanel"))panel()});
observer.observe(document.getElementById("main"),{childList:true});
panel();
})();

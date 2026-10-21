/* =============================================================================
 * PRESALES STUDIO – JSON PORTFOLIO ADMINISTRATION
 * Copyright (C) 2026 DAMIR OMERASEVIC. All rights reserved.
 * Author  : DAMIR OMERASEVIC
 * File    : admin.js
 * Purpose : Locally edit, validate and export vendor product/refresh records.
 * Version : 1.3.0
 * Scope   : Browser-only draft; DOES NOT write to GitHub repository.
 * ============================================================================= */
"use strict";
const C=window.PRESALES_CATALOG;
let working=C.getActive();
let group="ciscoPortfolio";
let selected=0;
let dirty=false;
let filter="";
const $=s=>document.querySelector(s);
const esc=s=>String(s??"").replace(/[&<>"']/g,ch=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));
const defs={
 ciscoPortfolio:"Cisco – portfolio",
 fortinetPortfolio:"Fortinet – portfolio",
 ciscoRefresh:"Cisco – refresh",
 fortinetRefresh:"Fortinet – refresh"
};
const modelFields=[
 ["id","Unikatni ID","text"],["vendor","Vendor","fixed"],["name","Model / naziv","text"],
 ["category","Kategorija","text"],["profile","Profil","text"],["capacityType","Capacity type","select"],
 ["firewallGbps","Firewall throughput (Gbps)","number"],["ngfwGbps","NGFW / Threat Protection (Gbps)","number"],
 ["tlsGbps","TLS inspection (Gbps)","number"],["ipsGbps","IPS throughput (Gbps)","number"],
 ["interfaces","Interfejsi","text"],["notes","Napomene / ograničenja","textarea"],
 ["method","Definicija benchmarka","textarea"],["source","Službeni HTTPS izvor","url"],
 ["status","Status dokaza","text"],["verifiedOn","Datum provjere (YYYY-MM-DD)","text"]
];
const refreshFields=[
 ["vendor","Vendor","fixed"],["legacy","Stara porodica/model","text"],
 ["target","Kandidat za zamjenu","text"],["confidence","Nivo potvrde","text"],
 ["checks","Dodatne provjere","textarea"],["source","Službeni HTTPS izvor","url"]
];
function mkid(){return "custom-"+(group.startsWith("cisco")?"cisco":"fortinet")+"-"+Date.now();}
function defaults(){
 const vendor=group.startsWith("cisco")?"Cisco":"Fortinet";
 if(group.endsWith("Portfolio"))return {id:mkid(),vendor,name:"NOVI MODEL – UNESI NAZIV",category:"NGFW",profile:"NGFW",capacityType:"firewall",
 firewallGbps:null,ngfwGbps:null,tlsGbps:null,ipsGbps:null,interfaces:"",notes:"Unesena nova stavka. Validacija proizvođača obavezna.",
 source:vendor==="Cisco"?"https://www.cisco.com/":"https://docs.fortinet.com/" ,method:"",status:"MODEL SPECS PENDING",verifiedOn:"2026-10-21"};
 return {vendor,legacy:"Stari model – unijeti",target:"Kandidat – unijeti",confidence:"KANDIDAT – NIJE 1:1",checks:"Zahtijeva tehnički double check",
 source:vendor==="Cisco"?"https://www.cisco.com/":"https://docs.fortinet.com/"};
}
function hasUncommitted(){return dirty;}
function notice(text,kind="info"){let x=$("#adminNotice");x.textContent=text;x.className="admin-notice "+kind;}
function menu(){
 return `<div class="admin-head"><div><h1>Portfolio Administration</h1><p>v1.3 · JSON katalog i Technology Refresh · lokalni draft, validacija i izvoz za GitHub</p></div>
 <div><a class="btn" href="./">← Aplikacija</a></div></div>
 <div class="notice"><b>VAŽNO:</b> Promjene u editoru su <b>lokalne</b> (samo ovaj browser). „Snimi draft“ osvježava katalog u ovom browseru.
 Da bi izmjene postale javne na GitHub Pages, preuzmi pojedinačne JSON datoteke i commituj ih u <code>v1.4/data/</code>.
 Ako nisi potvrdio tehničku metriku, ostavi je praznu (<code>null</code>); izbjegavaj lažnu preciznost.</div>
 <div class="admin-tabs">${Object.keys(defs).map(k=>`<button class="btn ${group===k?"primary":""}" data-gr="${k}">${defs[k]} (${working[k].length})</button>`).join("")}</div>
 <div class="admin-actions">
 <input id="filterAdmin" class="input" placeholder="Pretraga…" value="${esc(filter)}"/>
 <button class="btn" id="newRecord">＋ Novi zapis</button>
 <button class="btn primary" id="saveDraft">✓ Validiraj &amp; snimi lokalno</button>
 <button class="btn" id="exportCurrent">↓ Izvezi trenutni JSON</button>
 <button class="btn" id="exportAll">↓ Izvezi sva 4 JSON-a</button>
 <button class="btn" id="importCurrent">↑ Uvezi JSON</button>
 <button class="btn danger" id="resetCatalog">↺ Vrati GitHub bazu</button>
 <input type="file" id="adminFile" accept=".json,application/json" hidden />
 </div><div id="adminNotice" class="admin-notice">Odaberi zapis za uređivanje. Sve promjene prije snimanja ostaju samo u editoru.</div>`;
}
function fieldBox(row,key,label,type){
 let value=row[key]??"";
 if(type==="fixed")return `<label>${esc(label)}<input class="input" value="${esc(value)}" disabled></label>`;
 if(type==="textarea")return `<label class="full">${esc(label)}<textarea class="input" data-edit="${key}" rows="3">${esc(value)}</textarea></label>`;
 if(type==="select")return `<label>${esc(label)}<select class="input" data-edit="${key}">${["firewall","switch","wireless","management","other"].map(x=>`<option ${value===x?"selected":""}>${x}</option>`).join("")}</select></label>`;
 return `<label>${esc(label)}${type==="number"?'<small>Prazno = podatak nije potvrđen</small>':""}<input class="input" data-edit="${key}" type="${type==="number"?"number":"text"}" ${type==="number"?'step="any" min="0"':""} value="${esc(value)}" autocomplete="off"></label>`;
}
function render(){
 let filtered=working[group].map((rec,i)=>({rec,i})).filter(x=>!filter||JSON.stringify(x.rec).toLowerCase().includes(filter.toLowerCase()));
 if(selected>=working[group].length)selected=Math.max(0,working[group].length-1);
 const rec=working[group][selected];
 const cols=group.endsWith("Portfolio")?modelFields:refreshFields;
 $("#main").innerHTML=menu()+`<div class="admin-grid"><div class="card admin-list">
 <div class="section-header"><h3>Zapisi (${filtered.length})</h3></div>
 ${filtered.map(({rec,i})=>`<button class="admin-item ${i===selected?"active":""}" data-select="${i}"><b>${esc(rec.name||rec.legacy)}</b><small>${esc(rec.id||rec.target||"")}</small></button>`).join("")}
 </div><div class="card admin-editor">${rec?`<div class="section-header"><h3>Uredi zapis #${selected+1}</h3>
 <button class="btn danger" data-delete="${selected}">Obriši</button></div>
 <div class="admin-form">${cols.map(([key,label,type])=>fieldBox(rec,key,label,type)).join("")}</div>
 <div class="notice">Izmjene se provjeravaju pri snimanju. Datum, status i službeni HTTPS izvor su važni za dokazivost presales podataka.</div>`:"<p>Nema zapisa. Klikni Novi zapis.</p>"}
 </div></div>`;
 $("#filterAdmin").addEventListener("input",e=>{filter=e.target.value;const pos=e.target.selectionStart;render();$("#filterAdmin").focus();$("#filterAdmin").setSelectionRange(pos,pos)});
}
function validAll(){for(const k of C.groups)C.validate(k,working[k]);return true;}
function updateEditor(e){
 const field=e.target.dataset.edit;
 if(!field)return;
 const isNumeric=["firewallGbps","ngfwGbps","ipsGbps","tlsGbps"].includes(field);
 const v=isNumeric?(e.target.value.trim()===""?null:Number(e.target.value)):e.target.value;
 working[group][selected][field]=v;dirty=true;
}
function download(k){
 C.validate(k,working[k]);
 const name=C.FILES[k].split("/").pop();
 C.download(name,JSON.stringify(working[k],null,2)+"\n");
 notice("Preuzet "+name+". Commituj ga u v1.4/data/ za javno objavljivanje.","ok");
}
document.addEventListener("input",e=>{if(e.target.dataset.edit!==undefined)updateEditor(e)});
document.addEventListener("change",e=>{if(e.target.dataset.edit!==undefined)updateEditor(e)});
document.addEventListener("click",async e=>{
 const gr=e.target.closest("[data-gr]");if(gr){group=gr.dataset.gr;selected=0;filter="";render();return}
 const sel=e.target.closest("[data-select]");if(sel){selected=+sel.dataset.select;render();return}
 if(e.target.id==="newRecord"){working[group].push(defaults());selected=working[group].length-1;dirty=true;render();notice("Novi zapis: unesi tačne podatke i validiraj.");return}
 const del=e.target.closest("[data-delete]");if(del){if(confirm("Obrisati zapis samo iz trenutnog lokalnog editora?")){working[group].splice(+del.dataset.delete,1);dirty=true;render()}return}
 if(e.target.id==="saveDraft"){try{validAll();C.setDraft(working);dirty=false;notice("Sve četiri JSON grupe su validirane i snimljene u lokalni browser draft. Objavi izmjene u GitHubu zasebno.","ok")}catch(err){notice(err.message,"err")}return}
 if(e.target.id==="exportCurrent"){try{download(group)}catch(err){notice(err.message,"err")}return}
 if(e.target.id==="exportAll"){try{validAll();C.groups.forEach(download);notice("Četiri JSON datoteke su ponuđene za preuzimanje. Browser može tražiti dozvolu za višestruko preuzimanje.","ok")}catch(err){notice(err.message,"err")}return}
 if(e.target.id==="importCurrent"){$("#adminFile").click();return}
 if(e.target.id==="resetCatalog"){if(confirm("Odbaciti lokalne izmjene svih portfolija i vratiti podatke iz GitHub JSON fajlova?")){C.clearDraft();working=C.getBase();dirty=false;selected=0;render();notice("GitHub osnovni katalog vraćen.","ok")}return}
});
document.addEventListener("change",async e=>{
 if(e.target.id!=="adminFile")return;
 const file=e.target.files[0];if(!file)return;
 try{
  const parsed=JSON.parse(await file.text());C.validate(group,parsed);
  working[group]=parsed;selected=0;dirty=true;render();notice(file.name+" je uvezen u editor. Klikni Validiraj & snimi lokalno.","ok");
 }catch(err){notice("Uvoz nije uspio: "+err.message,"err")}
});
window.addEventListener("beforeunload",e=>{if(hasUncommitted()){e.preventDefault();e.returnValue=""}});
render();

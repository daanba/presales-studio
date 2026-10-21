/* =============================================================================
 * PRESALES STUDIO | OPPORTUNITY CRM, RFQ/ORDER HISTORY & QUESTIONNAIRE BUILDER
 * Copyright (C) 2026 DAMIR OMERASEVIC. All rights reserved.
 * Author : DAMIR OMERASEVIC
 * File   : crm.js
 * Version: 1.4.0
 * Note   : LOCAL-ONLY demo; actor labels are self-declared, NOT verified audit log.
 * ============================================================================= */
"use strict";
const KEY="presales-studio-v1.4-crm";
const $$=x=>document.querySelector(x),esc=s=>String(s??"").replace(/[&<>"']/g,ch=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));
const stamp=()=>new Date().toISOString(),uid=(p)=>p+"-"+Date.now().toString(36)+"-"+Math.random().toString(36).slice(2,7);
const base=()=>({schema:1,companies:[],opportunities:[],activities:[],questionnaires:[],responses:[],actor:"Presales Engineer"});
function valid(db){
 if(!db||db.schema!==1||!["companies","opportunities","activities","questionnaires","responses"].every(k=>Array.isArray(db[k])))throw Error("Neispravna CRM JSON struktura.");
 if(db.companies.length>2000||db.opportunities.length>5000||db.activities.length>15000||db.responses.length>12000)throw Error("Previše zapisa za browser-only demo.");
 for(const k of ["companies","opportunities","activities","questionnaires","responses"]){const ids=new Set();for(const r of db[k]){if(!r||typeof r!=="object"||!r.id||ids.has(r.id))throw Error("Nevažeći ili dupli ID u "+k);ids.add(r.id)}}
 return true;
}
function load(){try{const d=JSON.parse(localStorage.getItem(KEY));valid(d);return d}catch(e){return base()}}
let d=load(),section="companies",selectedId="",editId="",formQuestionCount=0,search="";
function save(){valid(d);localStorage.setItem(KEY,JSON.stringify(d))}
function audit(action,entity,refId,details){d.activities.push({id:uid("act"),date:stamp(),actor:d.actor||"Nepoznato",action,entity,refId,details})}
function input(name,label,value="",type="text",required=false){
 return `<label style="display:block;margin:6px 0"><small>${esc(label)}</small><input class="input" data-field="${esc(name)}" type="${type}" value="${esc(value)}" ${required?"required":""} style="width:100%"></label>`;
}
function textarea(name,label,value=""){
 return `<label style="display:block;margin:6px 0"><small>${esc(label)}</small><textarea class="input" data-field="${esc(name)}" rows="2" style="width:100%">${esc(value)}</textarea></label>`;
}
function select(name,label,opts,value=""){
 return `<label style="display:block;margin:6px 0"><small>${esc(label)}</small><select class="input" data-field="${esc(name)}" style="width:100%">${opts.map(o=>`<option value="${esc(o[0])}" ${value===o[0]?"selected":""}>${esc(o[1])}</option>`).join("")}</select></label>`;
}
const statuses=["Lead","Discovery","RFQ primljen","Ponuda u pripremi","Ponuda poslana","Pregovori","Narudžba potvrđena","Isporučeno","Izgubljeno","Otkazano"];
const actions=["Zahtjev kupca","Discovery","Tehnička provjera","Ponuda tražena","Ponuda poslana","Revidirana ponuda","Narudžba zaprimljena","Narudžba poslana distributeru","Isporučeno","Napomena"];
function opts(arr){return arr.map(x=>[x,x])}
function dl(filename,obj){const b=new Blob([JSON.stringify(obj,null,2)+"\n"],{type:"application/json"});const url=URL.createObjectURL(b);let a=document.createElement("a");a.href=url;a.download=filename;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)}
function toast(s){const el=$$("#toast");el.textContent=s;el.style.display="block";clearTimeout(window.toastTimer);window.toastTimer=setTimeout(()=>el.style.display="none",3500)}
function records(){return section==="companies"?d.companies:section==="opportunities"?d.opportunities:section==="questionnaires"?d.questionnaires:[]}
function label(r){return r.name||r.subject||r.title||r.id}
function companyName(id){return d.companies.find(x=>x.id===id)?.name||"—"}
function oppName(id){return d.opportunities.find(x=>x.id===id)?.subject||"—"}
function menu(){
 return `<div class="admin-head"><div><h1>Presales CRM · Historija</h1><p>v1.4 · kompanije, RFQ, ponude, narudžbe, aktivnosti, predlošci upitnika i odgovori</p></div><div><a class="btn" href="./">← Presales aplikacija</a><a class="btn" href="admin.html">⚙ Portfolio</a></div></div>
 <div class="notice"><b>Privatnost:</b> browser-only portfolio demonstracija. <b>Ne unositi stvarne podatke kupaca</b>, cijene, mrežne sheme ili ugovore bez odobrene sigurne infrastrukture. „Ko je promijenio“ unosi se ručno i <b>nije autentifikovan audit trail</b>. Izvezi backup redovno.</div>
 <div class="admin-actions"><label><small>Ko unosi izmjenu (informativno)</small><input id="actor" class="input" value="${esc(d.actor)}" placeholder="Ime / inicijali"></label>
 <button class="btn" id="exportCRM">↓ Backup JSON (sve)</button><button class="btn" id="importCRM">↑ Vrati backup</button><input type="file" accept=".json" id="crmFile" hidden>
 <button class="btn" id="demoCRM">▶ DEMO podaci</button></div>
 <div class="admin-tabs">${[['companies','Kompanije'],['opportunities','RFQ / Ponude / Narudžbe'],['activities','Historija aktivnosti'],['questionnaires','Upitnici'],['responses','Popunjeni upitnici']].map(([x,t])=>`<button class="btn ${section===x?"primary":""}" data-tab="${x}">${t}</button>`).join("")}</div>`;
}
function renderCompanies(){
 let r=d.companies;
 return `<div class="admin-grid"><div class="card admin-list"><h3>Kompanije (${r.length})</h3>
 ${r.map(x=>`<button class="admin-item ${x.id===selectedId?"active":""}" data-choose="${esc(x.id)}"><b>${esc(x.name)}</b><small>${esc(x.sector||"")}</small></button>`).join("")}
 <button class="btn" id="newRec">＋ Nova kompanija</button></div><div class="card admin-editor"><h3>${editId?"Uredi":"Dodaj"} kompaniju</h3>
 <form id="recordForm">${input("name","Naziv firme",r.find(x=>x.id===editId)?.name||"","text",true)}
 ${input("sector","Industrija",r.find(x=>x.id===editId)?.sector||"")}
 ${input("contact","Kontakt / uloga – samo DEMO",r.find(x=>x.id===editId)?.contact||"")}
 ${input("region","Lokacija",r.find(x=>x.id===editId)?.region||"")}
 ${textarea("notes","Napomene (bez povjerljivih podataka)",r.find(x=>x.id===editId)?.notes||"")}
 <button class="btn primary" type="submit">✓ Snimi</button></form>
 <p>Broj prilika: ${d.opportunities.filter(x=>x.companyId===selectedId).length}. Za evidenciju RFQ kreiraj povezanu priliku.</p></div></div>`;
}
function renderOpps(){
 const list=d.opportunities,active=list.find(x=>x.id===editId);
 return `<div class="admin-grid"><div class="card admin-list"><h3>Presales prilike (${list.length})</h3>
 ${list.map(x=>`<button class="admin-item ${x.id===selectedId?"active":""}" data-choose="${esc(x.id)}"><b>${esc(x.subject)}</b><small>${esc(companyName(x.companyId))} · ${esc(x.stage)}</small></button>`).join("")}
 <button class="btn" id="newRec">＋ Novi RFQ / Projekat</button></div><div class="card admin-editor"><h3>${editId?"Uredi":"Dodaj"} presales priliku</h3>
 <form id="recordForm">
 ${select("companyId","Firma",d.companies.map(x=>[x.id,x.name]),active?.companyId||d.companies[0]?.id||"")}
 ${input("subject","Naziv zahtjeva / projekta",active?.subject||"","text",true)}
 ${select("stage","Faza",opts(statuses),active?.stage||"Lead")}
 ${select("vendor","Vendor",opts(["Cisco","Fortinet","Multi-vendor","Drugo"]),active?.vendor||"Cisco")}
 ${input("rfqDate","Datum zahtjeva",active?.rfqDate||new Date().toISOString().slice(0,10),"date")}
 ${input("quoteDate","Datum ponude",active?.quoteDate||"","date")}
 ${input("orderDate","Datum narudžbe",active?.orderDate||"","date")}
 ${input("quoteRef","Oznaka ponude / RFQ",active?.quoteRef||"")}
 ${textarea("equipment","Tražena oprema i količine",active?.equipment||"")}
 ${textarea("outcome","Rezultat / sljedeći korak",active?.outcome||"")}
 ${input("value","Indikativna vrijednost (DEMO)",active?.value||"","text")}
 <button class="btn primary" type="submit">✓ Snimi status i historiju</button></form>
 <hr><h3>Dodaj aktivnost za odabranu priliku</h3>
 <form id="activityForm">${select("action","Tip aktivnosti",opts(actions))}
 ${textarea("details","Šta je traženo, ponuđeno ili naručeno?")}
 <button class="btn" type="submit" ${!selectedId?"disabled":""}>＋ Zabilježi aktivnost</button></form>
 <p><small>Svaka izmjena statusa i opreme bilježi se u lokalnoj historiji s datumom i samostalno upisanim korisnikom.</small></p></div></div>`;
}
function renderActivities(){
 const acts=[...d.activities].reverse();
 return `<div class="card"><h3>Historija aktivnosti (${acts.length})</h3>
 <input id="activitySearch" class="input" placeholder="Pretraga firme, RFQ, tipa događaja, osobe, opreme..." value="${esc(search)}">
 <div style="max-height:650px;overflow:auto">${acts.filter(a=>!search||[a.action,a.details,a.actor,oppName(a.refId),companyName(d.opportunities.find(x=>x.id===a.refId)?.companyId)].join(" ").toLowerCase().includes(search.toLowerCase()))
 .map(a=>`<div style="padding:12px;border-bottom:1px solid #ddd"><b>${esc(a.action)}</b> · ${esc(oppName(a.refId))}<br><small>${esc(a.date)} · ${esc(a.actor)} · ${esc(a.entity)}</small><p>${esc(a.details)}</p></div>`).join("")}</div>
 <p><small>Historija je lokalna i može se izmijeniti kroz backup JSON ili browser. Nije pravno dokaziv audit trail.</small></p></div>`;
}
function renderQuestions(){
 const list=d.questionnaires,r=list.find(x=>x.id===editId);
 let questions=r?.questions||["Koja je postojeća oprema?","Broj lokacija i korisnika?","NGFW/IPS/TLS zahtjevi?","Rok za ponudu i isporuku?"];
 return `<div class="admin-grid"><div class="card admin-list"><h3>Predlošci upitnika (${list.length})</h3>
 ${list.map(x=>`<button class="admin-item" data-choose="${esc(x.id)}"><b>${esc(x.title)}</b><small>${x.questions.length} pitanja</small></button>`).join("")}
 <button class="btn" id="newRec">＋ Novi upitnik</button></div>
 <div class="card admin-editor"><h3>${editId?"Uredi":"Novi"} Discovery upitnik</h3>
 <form id="recordForm">${input("title","Naziv upitnika",r?.title||"Cisco/Fortinet Discovery","text",true)}
 ${textarea("purpose","Svrha",r?.purpose||"")}
 <label>Jedno pitanje u svakom redu<textarea class="input" data-field="questions" rows="10" style="width:100%">${esc(questions.join("\n"))}</textarea></label>
 <button class="btn primary" type="submit">✓ Snimi predložak</button></form>
 <p>Upitnici se mogu popunjavati za određenu firmu i RFQ u tabu „Popunjeni upitnici“.</p></div></div>`;
}
function renderResponses(){
 const act=d.responses.find(x=>x.id===editId),q=d.questionnaires.find(x=>x.id===(act?.templateId||d.questionnaires[0]?.id));
 return `<div class="admin-grid"><div class="card admin-list"><h3>Popunjeni upitnici (${d.responses.length})</h3>
 ${d.responses.map(x=>`<button class="admin-item" data-choose="${esc(x.id)}"><b>${esc(oppName(x.opportunityId))}</b><small>${esc(d.questionnaires.find(q=>q.id===x.templateId)?.title||"")}</small></button>`).join("")}
 <button class="btn" id="newRec">＋ Novo popunjavanje</button></div>
 <div class="card admin-editor"><h3>Upitnik povezan s RFQ</h3>
 <form id="recordForm">
 ${select("opportunityId","RFQ / projekat",d.opportunities.map(x=>[x.id,x.subject+" — "+companyName(x.companyId)]),act?.opportunityId||d.opportunities[0]?.id||"")}
 ${select("templateId","Predložak upitnika",d.questionnaires.map(x=>[x.id,x.title]),act?.templateId||d.questionnaires[0]?.id||"")}
 ${textarea("answers","Odgovori (jedan red po pitanju) – izmjena predloška ne briše ranije popunjene odgovore",(act?.answers||[]).join("\n"))}
 ${textarea("evidence","Dokaz, izvori i otvorena pitanja",act?.evidence||"")}
 ${select("verification","Verifikacija",opts(["Otvoreno","Djelimično","Potvrđeno uz dokaz","Za reviziju"]),act?.verification||"Otvoreno")}
 <button class="btn primary" type="submit">✓ Snimi odgovore i historiju</button>
 </form>
 ${q?`<h4>Aktuelna pitanja (${q.questions.length})</h4><ol>${q.questions.map(x=>`<li>${esc(x)}</li>`).join("")}</ol>`:"<p>Prvo kreiraj predložak upitnika.</p>"}
 <p><small>Za trajnu sljedivost snima se i snapshot teksta pitanja u trenutku popunjavanja.</small></p></div></div>`;
}
function render(){
 $$("#main").innerHTML=menu()+
 (section==="companies"?renderCompanies():section==="opportunities"?renderOpps():section==="activities"?renderActivities():section==="questionnaires"?renderQuestions():renderResponses());
}
function fields(form){const o={};form.querySelectorAll("[data-field]").forEach(x=>{o[x.dataset.field]=x.value.trim()});return o}
function submitRec(form){
 const f=fields(form),now=stamp(),actor=d.actor||"Nepoznato";
 if(section==="companies"){
  if(!f.name)throw Error("Naziv firme je obavezan.");
  const current=d.companies.find(x=>x.id===editId);
  if(current){Object.assign(current,f,{updatedAt:now});selectedId=current.id;audit("Firma ažurirana","company",current.id,f.name)}
  else{const x={id:uid("co"),...f,createdAt:now,updatedAt:now};d.companies.push(x);selectedId=x.id;editId=x.id;audit("Firma dodana","company",x.id,x.name)}
 }else if(section==="opportunities"){
  if(!f.companyId||!d.companies.some(x=>x.id===f.companyId))throw Error("Prvo kreiraj firmu.");
  if(!f.subject)throw Error("Naziv projekta je obavezan.");
  const current=d.opportunities.find(x=>x.id===editId);
  if(current){const changes=Object.keys(f).filter(k=>current[k]!==f[k]).map(k=>k+": "+String(current[k]??"")+" → "+String(f[k]??"")).join(" | ");
    Object.assign(current,f,{updatedAt:now});selectedId=current.id;audit("RFQ izmijenjen","opportunity",current.id,changes||"Potvrđena evidencija")}
  else{const x={id:uid("rfq"),...f,createdAt:now,updatedAt:now};d.opportunities.push(x);selectedId=x.id;editId=x.id;audit("RFQ kreiran","opportunity",x.id,x.subject+"; tražena oprema: "+x.equipment)}
 }else if(section==="questionnaires"){
  if(!f.title)throw Error("Naziv upitnika je obavezan.");
  const questions=(f.questions||"").split("\n").map(x=>x.trim()).filter(Boolean);
  if(!questions.length||questions.length>100)throw Error("Upitnik mora imati 1–100 pitanja.");
  const current=d.questionnaires.find(x=>x.id===editId);
  if(current){Object.assign(current,{title:f.title,purpose:f.purpose,questions,updatedAt:now});selectedId=current.id;audit("Predložak ažuriran","questionnaire",current.id,f.title+" ("+questions.length+" pitanja)")}
  else{const x={id:uid("q"),title:f.title,purpose:f.purpose,questions,createdAt:now,updatedAt:now};d.questionnaires.push(x);editId=x.id;selectedId=x.id;audit("Predložak kreiran","questionnaire",x.id,f.title)}
 }else if(section==="responses"){
  const tmpl=d.questionnaires.find(x=>x.id===f.templateId);
  if(!tmpl||!d.opportunities.some(x=>x.id===f.opportunityId))throw Error("Potrebni su predložak upitnika i presales prilika.");
  const answers=f.answers.split("\n").map(x=>x.trim()), current=d.responses.find(x=>x.id===editId);
  const values={opportunityId:f.opportunityId,templateId:f.templateId,questionsSnapshot:current?.questionsSnapshot||[...tmpl.questions],answers,evidence:f.evidence,verification:f.verification,updatedAt:now};
  if(current){Object.assign(current,values);selectedId=current.id;audit("Discovery odgovor ažuriran","response",f.opportunityId,tmpl.title+": "+f.verification)}
  else{const x={id:uid("resp"),...values,createdAt:now};d.responses.push(x);selectedId=x.id;editId=x.id;audit("Discovery upitnik popunjen","response",f.opportunityId,tmpl.title+": "+f.verification)}
 }
 save();render();toast("Sačuvano lokalno. Promjena evidentirana u historiji.");
}
function demo(){
 if(!confirm("Dodati SINTETIČKE demo firme, RFQ, ponudu i historiju? Postojeći podaci ostaju."))return;
 const a=stamp(),co={id:uid("co"),name:"DEMO – Adriatic Retail d.o.o.",sector:"Retail",contact:"DEMO IT manager",region:"Sarajevo",notes:"Izmišljena firma",createdAt:a};
 d.companies.push(co);
 const o={id:uid("rfq"),companyId:co.id,subject:"Branch Secure Connect 2026",stage:"Ponuda poslana",vendor:"Multi-vendor",rfqDate:"2026-10-15",quoteDate:"2026-10-20",orderDate:"",quoteRef:"DEMO-RFQ-001",equipment:"2 × firewall u HA; 5 × poslovničkih firewall uređaja; SW i podrška",outcome:"Čeka tehničku validaciju i odgovor kupca",value:"DEMO / nije stvarna cijena",createdAt:a};
 d.opportunities.push(o);
 const q={id:uid("q"),title:"DEMO – Secure Branch Discovery",purpose:"Predložak za WAN / TLS / IPS / HA",questions:["Koliko lokacija i korisnika?","Koliki je izmjereni peak Mbps?","Koji se promet dekriptuje?","Traži li se HA?","Koje su licence i rokovi?"],createdAt:a};
 d.questionnaires.push(q);
 d.responses.push({id:uid("resp"),opportunityId:o.id,templateId:q.id,questionsSnapshot:[...q.questions],answers:["6 lokacija; 250 korisnika","600 Mbps","Potrebna potvrda","Da; active-passive","Provjera u toku"],verification:"Djelimično",evidence:"DEMO – ne koristiti kao dokaz",createdAt:a,updatedAt:a});
 audit("DEMO kreiran","opportunity",o.id,"Kupac je tražio ponudu za firewall, HA i podršku.");
 audit("Ponuda poslana","opportunity",o.id,"DEMO-RFQ-001 – tehnički podaci i komercijalni uslovi još nisu finalno verificirani.");
 selectedId=o.id;editId=o.id;section="opportunities";save();render();toast("Demo firma, RFQ, upitnik i aktivnosti učitani.");
}
document.addEventListener("click",e=>{
 let tab=e.target.closest("[data-tab]");if(tab){section=tab.dataset.tab;selectedId="";editId="";search="";render();return}
 let ch=e.target.closest("[data-choose]");if(ch){selectedId=editId=ch.dataset.choose;render();return}
 if(e.target.id==="newRec"){selectedId="";editId="";render();return}
 if(e.target.id==="demoCRM"){demo();return}
 if(e.target.id==="exportCRM"){save();dl("presales-crm-backup-"+new Date().toISOString().slice(0,10)+".json",d);return}
 if(e.target.id==="importCRM"){$$("#crmFile").click();return}
});
document.addEventListener("change",async e=>{
 if(e.target.id==="actor"){d.actor=e.target.value.trim().slice(0,120)||"Nepoznato";save()}
 if(e.target.id==="crmFile"){
  try{const f=e.target.files[0];if(!f)return; if(f.size>5e6)throw Error("Datoteka prevelika");
  const imported=JSON.parse(await f.text());valid(imported);
  if(!confirm("ZAMIJENITI lokalnu CRM bazu sadržajem ovog JSON backup fajla? Najprije izvezi trenutne podatke."))return;
  d=imported;selectedId="";editId="";save();render();toast("Backup vraćen")}
  catch(err){alert("Backup nije moguće učitati: "+err.message)}
 }
});
document.addEventListener("input",e=>{if(e.target.id==="activitySearch"){search=e.target.value;/* preserve caret, filter by re-render only results */let pos=e.target.selectionStart;render();const f=$$("#activitySearch");f.focus();f.setSelectionRange(pos,pos)}});
document.addEventListener("submit",e=>{
 e.preventDefault();
 try{
  if(e.target.id==="recordForm")submitRec(e.target);
  if(e.target.id==="activityForm"){
   const f=fields(e.target),opp=d.opportunities.find(x=>x.id===selectedId);
   if(!opp)throw Error("Odaberi RFQ.");
   audit(f.action||"Napomena","opportunity",opp.id,f.details||"Bez komentara");
   save();render();toast("Aktivnost evidentirana.");
  }
 }catch(err){alert(err.message)}
});
render();

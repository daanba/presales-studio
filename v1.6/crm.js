/* =============================================================================
 * PRESALES STUDIO | OPPORTUNITY CRM, RFQ/ORDER HISTORY & QUESTIONNAIRE BUILDER
 * Copyright (C) 2026 DAMIR OMERASEVIC. All rights reserved.
 * Author : DAMIR OMERASEVIC
 * File   : crm.js
 * Version: 1.5.0
 * Note   : LOCAL-ONLY demo; actor labels are self-declared, NOT verified audit log.
 * ============================================================================= */
"use strict";
const KEY="presales-studio-v1.6-crm";
const $$=x=>document.querySelector(x),esc=s=>String(s??"").replace(/[&<>"']/g,ch=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));
const stamp=()=>new Date().toISOString(),uid=(p)=>p+"-"+Date.now().toString(36)+"-"+Math.random().toString(36).slice(2,7);
const base=()=>({schema:1,companies:[],opportunities:[],activities:[],quotes:[],questionnaires:[],responses:[],actor:"Presales Engineer"});
function valid(db){
 if(db && db.schema===1 && !Array.isArray(db.quotes)) db.quotes=[];
 if(!db||db.schema!==1||!["companies","opportunities","activities","quotes","questionnaires","responses"].every(k=>Array.isArray(db[k])))throw Error("Neispravna CRM JSON struktura.");
 if(db.companies.length>2000||db.opportunities.length>5000||db.activities.length>15000||db.quotes.length>15000||db.responses.length>12000)throw Error("Previše zapisa za browser-only demo.");
 for(const k of ["companies","opportunities","activities","quotes","questionnaires","responses"]){const ids=new Set();for(const r of db[k]){if(!r||typeof r!=="object"||!r.id||ids.has(r.id))throw Error("Nevažeći ili dupli ID u "+k);ids.add(r.id)}}
 return true;
}
function load(){try{const d=JSON.parse(localStorage.getItem(KEY));valid(d);return d}catch(e){return base()}}
// Copy legacy v1.5 CRM on first use; previous versions remain untouched.
if(!localStorage.getItem(KEY)){const legacy=localStorage.getItem('presales-studio-v1.5-crm');if(legacy){try{valid(JSON.parse(legacy));localStorage.setItem(KEY,legacy)}catch(e){}}}
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
function records(){return section==="companies"?d.companies:section==="opportunities"?d.opportunities:section==="questionnaires"?d.questionnaires:section==="quotes"?d.quotes:[]}
function label(r){return r.name||r.subject||r.title||r.ref||r.id}
function companyName(id){return d.companies.find(x=>x.id===id)?.name||"—"}
function oppName(id){return d.opportunities.find(x=>x.id===id)?.subject||"—"}
function menu(){
 return `<div class="admin-head"><div><h1>Presales CRM · Historija</h1><p>v1.6 · povezani projekti i ponude · kompanije, RFQ, ponude, narudžbe, aktivnosti, predlošci upitnika i odgovori</p></div><div><a class="btn" href="./">← Presales aplikacija</a><a class="btn" href="admin.html">⚙ Portfolio</a></div></div>
 <div class="notice"><b>Privatnost:</b> browser-only portfolio demonstracija. <b>Ne unositi stvarne podatke kupaca</b>, cijene, mrežne sheme ili ugovore bez odobrene sigurne infrastrukture. „Ko je promijenio“ unosi se ručno i <b>nije autentifikovan audit trail</b>. Izvezi backup redovno.</div>
 <div class="admin-actions"><label><small>Ko unosi izmjenu (informativno)</small><input id="actor" class="input" value="${esc(d.actor)}" placeholder="Ime / inicijali"></label>
 <button class="btn" id="exportCRM">↓ Backup JSON (sve)</button><button class="btn" id="importCRM">↑ Vrati backup</button><input type="file" accept=".json" id="crmFile" hidden>
 <button class="btn" id="demoCRM">▶ DEMO podaci</button></div>
 <div class="admin-tabs">${[['companies','Kompanije'],['opportunities','RFQ / Ponude / Narudžbe'],['quotes','Ponude i revizije'],['activities','Historija aktivnosti'],['questionnaires','Upitnici'],['responses','Popunjeni upitnici']].map(([x,t])=>`<button class="btn ${section===x?"primary":""}" data-tab="${x}">${t}</button>`).join("")}</div>`;
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
 <hr><h3>Povezane ponude i projektni pregledi</h3>
 ${(d.quotes.filter(q=>q.opportunityId===selectedId).map(q=>`<div class="card" style="padding:10px;margin:8px 0"><b>${esc(q.ref)}</b> · ${q.revisions.length} revizija <button class="btn" data-go-quote="${esc(q.id)}">↗ Ponude i revizije</button> <button class="btn" data-open-workspace="${esc(q.id)}" data-revision="${esc(q.revisions.at(-1)?.version||'')}">↗ Zadnji pregled projekta</button></div>`).join('')||'<p>Nema povezanih ponuda.</p>')}
 <hr><h3>Dodaj aktivnost za odabranu priliku</h3>
 <form id="activityForm">${select("action","Tip aktivnosti",opts(actions))}
 ${textarea("details","Šta je traženo, ponuđeno ili naručeno?")}
 <button class="btn" type="submit" ${!selectedId?"disabled":""}>＋ Zabilježi aktivnost</button></form>
 <p><small>Svaka izmjena statusa i opreme bilježi se u lokalnoj historiji s datumom i samostalno upisanim korisnikom.</small></p></div></div>`;
}
function quoteRevs(quoteId){return d.quotes.filter(x=>x.id===quoteId)?.[0]?.revisions||[]}
const WORKSPACE_KEY='presales-studio-v1.6';
function readWorkspace(){try{const p=JSON.parse(localStorage.getItem(WORKSPACE_KEY));return p&&p.project&&Array.isArray(p.bom)&&p.sizing&&p.qa?p:null}catch(e){return null}}
function workspaceSummary(p){return p ? `${p.project.name||'Projekat'} · ${p.bom.length} BOM stavki · ${p.project.currency||'KM'}` : 'Nema vezanog projektnog snapshot-a'}
function openWorkspace(q,revision){
 const o=d.opportunities.find(x=>x.id===q.opportunityId);
 const rev=q.revisions.find(x=>x.version===revision);
 if(!rev)return alert('Revizija nije pronađena.');
 let project=rev.workspaceSnapshot?JSON.parse(JSON.stringify(rev.workspaceSnapshot)):null;
 if(!project){
   // Legacy revisions contain text summaries only; DO NOT invent BOM, sizing or QA.
   project={version:1,project:{name:o?.subject||rev.subject||q.ref,client:companyName(o?.companyId),owner:d.actor||'',scope:'Technical Assessment',currency:'KM',demo:!!o?.companyId&&companyName(o.companyId).startsWith('DEMO')},discovery:{Cisco:{},Fortinet:{}},sizing:{peak:'',wan:'',users:'',growth:30,headroom:25,tls:true,ips:true,ha:false},bom:[],qa:{},notes:'LEGACY CRM: '+q.ref+' '+rev.version+'; '+(rev.equipment||'')+'. Nema prethodno sačuvanog BOM/sizing snapshot-a.'};
 }
 project.crmLink={opportunityId:q.opportunityId,quoteId:q.id,revision:rev.version,linkedAt:stamp(),isLegacy:!rev.workspaceSnapshot};
 if(!confirm('Otvoriti '+q.ref+' '+rev.version+' u radnom projektu? Ovo ZAMJENJUJE trenutni projekat v1.6. Prije toga sačuvaj JSON ako ga želiš zadržati.'))return;
 localStorage.setItem(WORKSPACE_KEY,JSON.stringify(project));
 window.location.href='./?crm=1';
}
function renderQuotes(){
 const list=d.quotes,selected=list.find(x=>x.id===selectedId),revs=selected?.revisions||[];
 const latest=revs[revs.length-1]||null;
 const options=d.opportunities.map(o=>[o.id,(d.companies.find(c=>c.id===o.companyId)?.name||"—")+" — "+o.subject]);
 return `<div class="admin-grid"><div class="card admin-list">
 <h3>Registar ponuda (${list.length})</h3><p><small>Svaka ponuda ima zaseban ID i neograničenu historiju revizija.</small></p>
 ${list.map(x=>{const last=x.revisions?.at(-1);return `<button class="admin-item ${x.id===selectedId?"active":""}" data-choose="${esc(x.id)}"><b>${esc(x.ref)}</b><small>${esc(oppName(x.opportunityId))} · ${esc(last?.version||"—")} · ${esc(last?.status||"—")}</small></button>`}).join("")}
 <button class="btn" id="newQuote">＋ Nova ponuda</button></div>
 <div class="card admin-editor">
 <h3>${selected?"Nova revizija postojeće ponude":"Nova ponuda"}</h3>
 <div class="notice"><b>Revizije se ne prepisuju:</b> svako snimanje kreira novi snapshot s datumom, autorom i razlogom izmjene. Lokalni demo, neautentifikovani audit. Početna revizija je R01.</div>
 <div class="notice"><b>Veza s projektnim pregledom:</b> snimi izmjene u glavnoj aplikaciji, zatim ovdje odaberi RFQ/ponudu i kreiraj novu reviziju sa snapshot-om projekta. Otvaranje stare revizije vraća upravo njen BOM, Discovery, Sizing i QA ako je snapshot postojao. Starije v1.5 revizije bez snapshot-a otvaraju samo RFQ kontekst — bez izmišljenih tehničkih parametara.</div>
 <form id="quoteForm">
 ${selected?`<p><b>${esc(selected.ref)}</b> · ${esc(oppName(selected.opportunityId))} · sljedeća revizija <b>R${String(revs.length+1).padStart(2,"0")}</b></p>`:
 select("opportunityId","RFQ / projekat",options,d.opportunities[0]?.id||"")+input("ref","Broj ponude, npr. Q-2026-001","","text",true)}
 ${input("subject","Predmet ponude",latest?.subject||selected?.subject||"","text",true)}
 ${select("status","Status revizije",opts(["Nacrt","Interna provjera","Poslano kupcu","Pregovori","Prihvaćeno","Odbijeno","Povučeno"]),latest?.status||"Nacrt")}
 ${input("currency","Valuta (npr. BAM)",latest?.currency||"BAM")}
 ${input("amount","Ukupno (DEMO broj, bez valute)",latest?.amount??"","number")}
 ${textarea("equipment","Stavke / modeli / količine / licence",latest?.equipment||"")}
 ${textarea("terms","Rokovi, uslovi i napomene",latest?.terms||"")}
 ${textarea("reason","Razlog nove revizije / šta je promijenjeno","")}
 <label style="display:block;padding:12px;background:#edf9f6;border-radius:9px"><input id="attachWorkspace" type="checkbox" checked> <b>Priloži snapshot aktivnog v1.6 projekta</b><br><small>${esc(workspaceSummary(readWorkspace()))}. Snima se presjek stanja, ne automatska promjena ranijih revizija.</small></label>
 <button class="btn primary" ${!d.opportunities.length?"disabled":""} type="submit">✓ ${selected?"Snimi novu reviziju":"Kreiraj ponudu R01"}</button></form>
 <hr><h3>Historija verzija (${revs.length})</h3>
 ${[...revs].reverse().map((r,i)=>`<details class="card" style="padding:12px;margin:8px 0" ${i===0?"open":""}><summary><b>${esc(r.version)}</b> · ${esc(r.status)} · ${esc(r.date.slice(0,16).replace("T"," "))} · ${esc(r.actor)}</summary><p><b>Razlog:</b> ${esc(r.reason||"—")}</p><p><b>Vrijednost:</b> ${esc(r.amount)} ${esc(r.currency)}</p><p><b>Oprema:</b> ${esc(r.equipment)}</p><p><b>Uslovi:</b> ${esc(r.terms)}</p><p><b>Projektni snapshot:</b> ${r.workspaceSnapshot?'Sačuvan ('+esc(workspaceSummary(r.workspaceSnapshot))+')':'Nije sačuvan u ovoj reviziji'}</p><button type="button" class="btn" data-open-workspace="${esc(selected.id)}" data-revision="${esc(r.version)}">↗ Otvori ovu reviziju u Pregledu projekta</button></details>`).join("")||"<p>Još nema revizija.</p>"}
 </div></div>`;
}
function submitQuote(form){
 const f=fields(form),now=stamp();let q=d.quotes.find(x=>x.id===selectedId);
 if(!f.subject)throw Error("Predmet ponude je obavezan.");
 if(f.amount!==""&&(!Number.isFinite(Number(f.amount))||Number(f.amount)<0))throw Error("Iznos nije valjan.");
 if(q){
  if(!f.reason||f.reason.length<3)throw Error("Za novu reviziju unesi razlog promjene.");
 }else{
  if(!f.opportunityId||!d.opportunities.some(o=>o.id===f.opportunityId))throw Error("Prvo kreiraj RFQ.");
  if(!f.ref)throw Error("Broj ponude je obavezan.");
  if(d.quotes.some(x=>x.ref.toLowerCase()===f.ref.toLowerCase()))throw Error("Oznaka ponude mora biti jedinstvena.");
  q={id:uid("quote"),ref:f.ref,opportunityId:f.opportunityId,subject:f.subject,createdAt:now,revisions:[]};d.quotes.push(q);
 }
 const prev=q.revisions.at(-1),version="R"+String(q.revisions.length+1).padStart(2,"0");
 const wantSnapshot=form.querySelector?.('#attachWorkspace')?.checked;
 const ws=wantSnapshot?readWorkspace():null;
 if(wantSnapshot&&!ws)throw Error('Nema validnog aktivnog projekta v1.6. Otvori glavnu aplikaciju ili ukloni oznaku za snapshot.');
 if(ws?.crmLink?.opportunityId && ws.crmLink.opportunityId!==q.opportunityId && !confirm('Aktivni projekat je povezan s drugim RFQ. Želiš li ipak priložiti njegov snapshot?'))return;
 const revision={version,date:now,actor:d.actor||"Nepoznato",subject:f.subject,status:f.status,amount:f.amount,currency:f.currency,equipment:f.equipment,terms:f.terms,reason:f.reason||"Početna ponuda",...(ws?{workspaceSnapshot:JSON.parse(JSON.stringify(ws))}:{})};
 q.revisions.push(revision);
 audit(prev?"Revizija ponude":"Ponuda kreirana","opportunity",q.opportunityId,q.ref+" "+version+"; "+revision.status+"; "+revision.reason);
 selectedId=editId=q.id;save();render();toast("Sačuvana "+q.ref+" "+version+"; prethodne verzije su zadržane.");
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
 (section==="companies"?renderCompanies():section==="opportunities"?renderOpps():section==="activities"?renderActivities():section==="quotes"?renderQuotes():section==="questionnaires"?renderQuestions():renderResponses());
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
 if(!confirm("Dodati 5 SINTETIČKIH kompanija, RFQ i ponuda s historijom revizija? Postojeći podaci ostaju."))return;
 const tag="DEMO-v15-5-";if(d.companies.some(x=>x.demoTag===tag)){toast("Pet DEMO slučajeva već postoji. Izbjegnuti duplikati.");return}
 const cases=[
  {name:"DEMO – Adriatic Retail d.o.o.",sector:"Maloprodaja",subject:"Branch Secure Connect – 6 lokacija",stage:"Ponuda poslana",vendor:"Fortinet",rfq:"2026-10-03",ref:"DEMO-Q-001",equipment:"2 × FortiGate HA sjedište + 5 × poslovnički NGFW; podrška",versions:[
   ["Nacrt","2 × FortiGate HA + 5 × branch NGFW","Prva tehnička ponuda"],
   ["Poslano kupcu","2 × FortiGate HA + 5 × branch NGFW; produžena podrška","Kupac zatražio dužu podršku"]]},
  {name:"DEMO – Bosna Logistics d.o.o.",sector:"Logistika",subject:"Cisco switching i PoE WLAN",stage:"Pregovori",vendor:"Cisco",rfq:"2026-10-05",ref:"DEMO-Q-002",equipment:"4 × Catalyst access switch + 12 × AP; licence",versions:[
   ["Nacrt","4 × access switch; 10 × AP","Početni prijedlog"],
   ["Poslano kupcu","4 × access switch; 12 × AP","Usklađen broj AP sa nacrtom"],
   ["Pregovori","4 × switch; 12 × AP; 3-godišnja podrška","Uključena opcija višegodišnje podrške"]]},
  {name:"DEMO – Medica Plus d.o.o.",sector:"Zdravstvo",subject:"Datacenter firewall i segmentacija",stage:"Narudžba potvrđena",vendor:"Cisco",rfq:"2026-09-22",ref:"DEMO-Q-003",equipment:"2 × Cisco Secure Firewall HA + 1 × support paket",versions:[
   ["Poslano kupcu","2 × Secure Firewall HA + support","Početna ponuda"],
   ["Prihvaćeno","2 × Secure Firewall HA + support; provjera SKU obavezna","Potvrđen obim, DEMO bez stvarne narudžbe"]]},
  {name:"DEMO – Una Finance d.o.o.",sector:"Finansijske usluge",subject:"Remote access VPN + MFA",stage:"Ponuda u pripremi",vendor:"Multi-vendor",rfq:"2026-10-17",ref:"DEMO-Q-004",equipment:"VPN rješenje + MFA + 250 korisničkih licenci",versions:[
   ["Nacrt","VPN + MFA + 250 users","U toku provjera kompatibilnosti"]]},
  {name:"DEMO – Vektor Manufacturing d.o.o.",sector:"Proizvodnja",subject:"Industrijska mrežna segmentacija",stage:"Izgubljeno",vendor:"Fortinet",rfq:"2026-09-14",ref:"DEMO-Q-005",equipment:"Industrijski firewall + switch + projektne usluge",versions:[
   ["Poslano kupcu","Industrijski firewall + switch + usluge","Ponuda poslana"],
   ["Odbijeno","Industrijski firewall + switch + usluge","Kupac odgodio projekat; razlog simuliran"]]}
 ];
 const a=stamp();
 cases.forEach((c,i)=>{
  const co={id:uid("co"),demoTag:tag,name:c.name,sector:c.sector,region:"Bosna i Hercegovina",contact:"Izmišljeni kontakt",notes:"Samo DEMO",createdAt:a};d.companies.push(co);
  const o={id:uid("rfq"),companyId:co.id,subject:c.subject,stage:c.stage,vendor:c.vendor,rfqDate:c.rfq,quoteDate:"2026-10-20",orderDate:c.stage==="Narudžba potvrđena"?"2026-10-21":"",quoteRef:c.ref,equipment:c.equipment,outcome:"SINTETIČKI DEMO – bez stvarne obaveze",value:"DEMO",createdAt:a};d.opportunities.push(o);
  const q={id:uid("quote"),ref:c.ref,opportunityId:o.id,subject:c.subject,createdAt:a,revisions:[]};
  c.versions.forEach((v,j)=>{q.revisions.push({version:"R"+String(j+1).padStart(2,"0"),date:new Date(Date.UTC(2026,9,10+i+j)).toISOString(),actor:"DEMO Presales Engineer",subject:c.subject,status:v[0],amount:"",currency:"BAM",equipment:v[1],terms:"Tehnička validacija i zvanični SKU obavezni",reason:v[2]})});
  // Synthetic, explicitly unverified project snapshots attached to sample revisions.
  // No real customer prices, licensing or validated sizing are inferred.
  const demoProject={
    version:1,
    project:{name:c.subject,client:c.name,owner:"DEMO Presales Engineer",scope:"Technical Assessment",currency:"KM",demo:true},
    discovery:{Cisco:{},Fortinet:{}},
    sizing:{peak:"",wan:"",users:"",growth:30,headroom:25,tls:true,ips:true,ha:c.equipment.includes("HA")},
    bom:[{vendor:c.vendor==="Multi-vendor"?"Other":c.vendor,sku:"",desc:c.equipment,type:"Hardware",qty:1,include:true,buy:"",sell:"",status:"Nije validirano"}],
    qa:{},notes:"SINTETIČKI DEMO: referentna oprema/qty su tekstualni zahtjev, ne validiran BOM. Sizing nije potvrđen."
  };
  q.revisions.forEach((r,j)=>{
    r.workspaceSnapshot=JSON.parse(JSON.stringify(demoProject));
    r.workspaceSnapshot.project.name=c.subject+" · "+r.version;
    r.workspaceSnapshot.bom[0].desc=r.equipment;
    r.workspaceSnapshot.crmLink={opportunityId:o.id,quoteId:q.id,revision:r.version,isLegacy:false};
  });
  d.quotes.push(q);
  audit("DEMO RFQ","opportunity",o.id,c.subject+"; "+c.equipment);
  q.revisions.forEach(r=>audit("DEMO ponuda "+r.version,"opportunity",o.id,c.ref+" "+r.status+"; "+r.reason));
 });
 const qt={id:uid("q"),title:"DEMO – Multi-vendor Discovery",purpose:"Presales inicijalni zahtjevi",questions:["Broj lokacija?","Peak Mbps?","NGFW/IPS/TLS?","HA zahtjev?","Rok i budžet?"],createdAt:a};d.questionnaires.push(qt);
 d.responses.push({id:uid("resp"),opportunityId:d.opportunities.at(-5).id,templateId:qt.id,questionsSnapshot:[...qt.questions],answers:["6","600","DA","DA","Za potvrdu"],verification:"Djelimično",evidence:"Sintetički primjer",createdAt:a,updatedAt:a});
 section="quotes";selectedId=d.quotes.at(-5).id;editId=selectedId;save();render();toast("Dodano 5 DEMO kompanija, RFQ, ponuda i 10 revizija.");
}

document.addEventListener("click",e=>{
 const open=e.target.closest('[data-open-workspace]');
 if(open){const q=d.quotes.find(q=>q.id===open.dataset.openWorkspace);if(q)openWorkspace(q,open.dataset.revision);return}
 const go=e.target.closest('[data-go-quote]');
 if(go){section='quotes';selectedId=editId=go.dataset.goQuote;render();return}

 let tab=e.target.closest("[data-tab]");if(tab){section=tab.dataset.tab;selectedId="";editId="";search="";render();return}
 let ch=e.target.closest("[data-choose]");if(ch){selectedId=editId=ch.dataset.choose;render();return}
 if(e.target.id==="newQuote"){selectedId="";editId="";render();return}
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
  if(e.target.id==="quoteForm")submitQuote(e.target);
  if(e.target.id==="activityForm"){
   const f=fields(e.target),opp=d.opportunities.find(x=>x.id===selectedId);
   if(!opp)throw Error("Odaberi RFQ.");
   audit(f.action||"Napomena","opportunity",opp.id,f.details||"Bez komentara");
   save();render();toast("Aktivnost evidentirana.");
  }
 }catch(err){alert(err.message)}
});
// For deep-links from workspace, open associated quote when one is available.
if(typeof location!=='undefined' && typeof URLSearchParams!=='undefined' && new URLSearchParams(location.search).has('linked')){
 const active=readWorkspace();
 const target=active?.crmLink?.quoteId;
 if(target&&d.quotes.some(q=>q.id===target)){section='quotes';selectedId=editId=target;}
 else section='quotes';
}
render();

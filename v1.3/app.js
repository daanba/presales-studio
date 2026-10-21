/* =============================================================================
 * PRESALES STUDIO | Cisco & Fortinet
 * Copyright (C) 2026 DAMIR OMERASEVIC. All rights reserved.
 * Author  : DAMIR OMERASEVIC
 * File    : app.js
 * Purpose : Client-side discovery, sizing, portfolio, refresh, BOM, QA and export.
 * Security: Local-first; no backend, telemetry, CDN or external API calls.
 * Status  : Independent portfolio demonstration; NOT an official Comtrade tool.
 * ============================================================================= */
"use strict";
const D=window.PRESALES_DATA;
const KEY='presales-studio-v1.3'; // isolated from root v1.1 and /v1.2 apps
const labels={dashboard:'PREGLED PROJEKTA',discovery:'DISCOVERY',sizing:'CAPACITY SIZING',catalog:'PRODUCT PORTFOLIO',refresh:'TECHNOLOGY REFRESH',bom:'BOM & TCO',qa:'QUALITY GATE',guide:'HOW IT WORKS'};
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fmt=n=>Number(n||0).toLocaleString('bs-BA',{maximumFractionDigits:2});
const money=(n,c='KM')=>fmt(n)+' '+esc(c);
const numeric=v=>{if(v===''||v===null||v===undefined)return NaN;let n=Number(v);return Number.isFinite(n)?n:NaN};
function blank(){return {version:1,project:{name:'Novi presales projekat',client:'',owner:'',scope:'Refresh / Modernisation',currency:'KM',demo:false},
discovery:{Cisco:{},Fortinet:{}},sizing:{peak:'',wan:'',users:'',growth:30,headroom:25,tls:true,ips:true,ha:true},
bom:[],qa:{},notes:''};}
function load(){try{let x=JSON.parse(localStorage.getItem(KEY));return x&&x.version===1&&x.project&&x.discovery&&x.sizing&&Array.isArray(x.bom)&&x.qa?x:blank()}catch(e){return blank()}}
let state=load(), view='dashboard', vendor='Cisco',searchTerm='',category='All',refreshVendor='All';
function save(){try{localStorage.setItem(KEY,JSON.stringify(state))}catch(e){toast('Nije moguće sačuvati projekt. Provjeri prostor browsera.')}} 
function toast(msg){const el=document.querySelector('#toast');el.textContent=msg;el.style.display='block';clearTimeout(window.toastTimeout);window.toastTimeout=setTimeout(()=>{el.style.display='none'},3100)}
// Independently track answers, declared confirmations and verified completions.
// 'Potvrđeno' WITHOUT both an answer and supporting evidence is NOT verified.
function discoveryStats(v){
  const questions=D.discovery[v], records=state.discovery[v]||{};
  let answered=0,confirmed=0,verified=0,notApplicable=0,blocked=0;
  questions.forEach((_,i)=>{
    const x=records[i]||{},answer=String(x.answer||'').trim(),evidence=String(x.evidence||'').trim();
    if(answer)answered++;
    if(x.status==='Potvrđeno'){confirmed++;if(answer&&evidence)verified++;}
    if(x.status==='Nije primjenjivo'){notApplicable++;if(evidence)verified++;}
    if(x.status==='Blokirano')blocked++;
  });
  return {answered,confirmed,verified,notApplicable,blocked,total:questions.length,
    percent:questions.length?Math.round(verified/questions.length*100):0};
}
function pctDone(v){const q=discoveryStats(v);return [q.verified,q.total,q.percent];}
function qaStatus(){
  let verified=0,confirmed=0,blocked=0,open=0,unverified=0;
  D.qa.forEach((_,i)=>{
    const r=state.qa[i]||{}, s=r.status||'Otvoreno';
    if(s==='Potvrđeno'||s==='Nije primjenjivo'){
      confirmed++;
      if((r.owner||'').trim()&&(r.evidence||'').trim())verified++;
      else unverified++;
    }else if(s==='Blokirano')blocked++;
    else open++;
  });
  return {ok:verified,verified,confirmed,unverified,blocked,open,total:D.qa.length,
    ready:verified===D.qa.length&&blocked===0};
}
const stat=(title,number,hint)=>`<div class="card kpi"><div class="label">${title}</div><div class="number">${number}</div><div class="hint">${hint}</div></div>`;
function ph(title,desc,buttons=''){return `<div class="pagehead"><div><div class="eyebrow">PRESALES STUDIO / ${esc(view.toUpperCase())}</div><h1>${title}</h1><p>${desc}</p></div><div class="btnrow">${buttons}</div></div>`}
function actions(extra=''){return `<button class="btn" data-action="loadDemo">▶ Učitaj DEMO</button><button class="btn" data-action="export">↓ Sačuvaj JSON</button><button class="btn" data-action="import">↑ Uvezi JSON</button>${extra}`}
function progress(label,arr){return `<div style="margin:13px 0"><div style="display:flex;justify-content:space-between;margin-bottom:8px"><strong>${label}</strong><span class="subtle">${arr[0]} / ${arr[1]} verifikovano · ${arr[2]}%</span></div><div class="progressbar"><div style="width:${arr[2]}%"></div></div></div>`}
function discoveryProgressHtml(v){
  const x=discoveryStats(v);
  return progress(v+' - verifikacija',[x.verified,x.total,x.percent])+
  `<small class="subtle">${x.answered} odgovoreno · ${x.confirmed} status Potvrđeno · ${x.notApplicable} N/P · ${x.blocked} blokirano</small>`;
}
function liveUpdate(){
  if(view==='discovery'){
    const el=document.querySelector('[data-live-discovery]');
    if(el)el.innerHTML=discoveryProgressHtml(vendor);
  }
  if(view==='qa'){
    const el=document.querySelector('[data-live-qa]');
    const notice=document.querySelector('[data-live-qa-notice]');
    const q=qaStatus();
    if(el)el.innerHTML=qaCards(q);
    if(notice)notice.innerHTML=qaNotice(q);
    if(notice)notice.className='notice '+(q.ready?'':'danger');
  }
  if(view==='bom'){
    const el=document.querySelector('[data-live-bom]');
    if(el)el.innerHTML=bomCards();
    const bm=document.querySelector("[data-live-bom-sizing]");if(bm)bm.innerHTML=sizingMatrix();
  }
  if(view==='sizing'){
    const r=computedSizing();
    const m=document.querySelector('[data-live-mbps]'),g=document.querySelector('[data-live-gbps]'),h=document.querySelector('[data-live-ha]');
    if(m)m.textContent=r?fmt(r.mbps):'—';
    if(g)g.textContent=r?fmt(r.gbps):'—';
    if(h)h.textContent=r?String(r.ha):'—';
    const section=document.querySelector('[data-live-matrix]');if(section)section.innerHTML=sizingMatrix();
  }
}
function renderDashboard(){
const c=pctDone('Cisco'),f=pctDone('Fortinet'),q=qaStatus();
return ph('From discovery to decision.','Jedinstven, pregledan presales proces za Cisco & Fortinet — od prvog razgovora s kupcem do tehnički provjerene ponude.',actions())+
`<div class="grid cols4">${stat('CISCO DISCOVERY',c[2]+'%','Verifikovano '+c[0]+' / '+c[1])}${stat('FORTINET DISCOVERY',f[2]+'%','Verifikovano '+f[0]+' / '+f[1])}${stat('BOM STAVKE',state.bom.length,'Hardver, licence i support')}${stat('QA GATE',q.ready?'REVIEW':'NOT READY',q.open+' otvorenih · '+q.unverified+' bez dokaza · '+q.blocked+' blokiranih')}</div>
<div class="sectiontitle"><h2>Aktivni projekat</h2><span class="subtle">Lokalno čuvanje u browseru</span></div>
<div class="card"><div class="formgrid">${finput('project.name','Naziv projekta',state.project.name)}${finput('project.client','Kupac / organizacija',state.project.client)}${finput('project.owner','Presales owner',state.project.owner)}
${fselect('project.scope','Vrsta angažmana',state.project.scope,['Refresh / Modernisation','New Deployment','Expansion / Upgrade','Technical Assessment'])}${fselect('project.currency','Valuta',state.project.currency,['KM','EUR','USD'])}
<div class="field"><label>Režim projekta</label><div style="padding:10px 0"><span class="badge ${state.project.demo?'caution':'ok'}">${state.project.demo?'SIMULIRANI DEMO PODACI':'RADNI PROJEKAT'}</span></div></div></div></div>
<div class="sectiontitle"><h2>Presales workflow</h2><span class="subtle">Klikni na fazu za direktan pristup</span></div>
<div class="steps">${[['01','Discovery','Zahtjevi i kontekst','discovery'],['02','Sizing','Traffic, IPS, TLS & HA','sizing'],['03','Shortlist','Pregled portfolija','catalog'],['04','Refresh','Legacy → kandidat','refresh'],['05','Commercial','BOM & margin','bom'],['06','QA Gate','Validacija prije ponude','qa']].map(r=>`<button class="step" data-view="${r[3]}"><div class="index">STEP ${r[0]}</div><strong>${r[1]}</strong><small>${r[2]}</small></button>`).join('')}</div>
<div class="grid cols2" style="margin-top:22px"><div class="card"><div class="sectiontitle" style="margin:0 0 12px"><h2>Discovery readiness</h2></div>${progress('Cisco',c)}${progress('Fortinet',f)}</div>
<div class="card"><div class="sectiontitle" style="margin:0 0 12px"><h2>Design philosophy</h2></div><p class="muted">Business requirements → measured performance → architecture → technical validation → exact SKU/BOM → approval.</p>
<div class="notice warning"><b>Engineering guardrail</b><br>Predloženi refresh modeli su kandidati, a ne direktne 1:1 zamjene. Sizing nije automatizovan izbor uređaja.</div></div></div>`;
}
function finput(path,label,val,kind='text'){return `<div class="field"><label for="i_${path.replace(/\W/g,'_')}">${esc(label)}</label><input class="input" id="i_${path.replace(/\W/g,'_')}" data-path="${esc(path)}" type="${kind}" value="${esc(val)}"></div>`}
function fselect(path,label,val,options){return `<div class="field"><label>${esc(label)}</label><select data-path="${esc(path)}">${options.map(o=>`<option ${o===val?'selected':''}>${esc(o)}</option>`).join('')}</select></div>`}
function vswitch(v=vendor){return `<div class="vendor-tabs"><button class="btn ${v==='Cisco'?'selected':''}" data-vendor="Cisco">CISCO</button><button class="btn ${v==='Fortinet'?'selected':''}" data-vendor="Fortinet">FORTINET</button></div>`}
function renderDiscovery(){
const arr=D.discovery[vendor],progressArr=pctDone(vendor),records=state.discovery[vendor]||{};
return ph('Discovery / '+vendor,'Strukturirani tehnički upitnik. Evidentiraj izvor svake informacije i status potvrde.',`<button class="btn" data-action="csvDiscovery">↓ Izvezi CSV</button>`)+
`<div class="toolbar"><div class="left">${vswitch()}<span class="badge">${arr.length} pitanja</span></div><div data-live-discovery style="min-width:280px">${discoveryProgressHtml(vendor)}</div></div>
<div class="tablewrap"><table><thead><tr><th>#</th><th>Oblast</th><th>Pitanje / ulazni parametar</th><th>Odgovor kupca</th><th>Status</th><th>Dokaz / napomena</th></tr></thead><tbody>${arr.map((row,i)=>{let r=records[i]||{};return `<tr><td><span class="muted">${String(i+1).padStart(2,'0')}</span></td><td><span class="badge">${esc(row.group)}</span><br><small class="muted">${esc(row.priority)}</small></td><td style="min-width:220px"><b>${esc(row.question)}</b><div class="helper">${esc(row.unit)}</div></td><td><textarea data-discovery="${esc(vendor)}" data-index="${i}" data-field="answer" placeholder="Upiši odgovor...">${esc(r.answer||'')}</textarea></td><td><select data-discovery="${esc(vendor)}" data-index="${i}" data-field="status">${['Otvoreno','Potvrđeno','Nije primjenjivo','Blokirano'].map(x=>`<option ${x===(r.status||'Otvoreno')?'selected':''}>${x}</option>`).join('')}</select></td><td><textarea data-discovery="${esc(vendor)}" data-index="${i}" data-field="evidence" placeholder="Izvor, link ili referenca...">${esc(r.evidence||'')}</textarea></td></tr>`}).join('')}</tbody></table></div><div class="notice"><b>Automatski status:</b> Unesen odgovor ≠ verifikovano. „Potvrđeno“ se računa u procenat tek kada postoje i odgovor i dokaz; „Nije primjenjivo“ zahtijeva obrazloženje u polju dokaza. Brojači se osvježavaju tokom unosa. Za izvještaj su važni statusi i dokazi, ne samo ispunjena tekstualna polja. Povjerljive mrežne konfiguracije, privatne ključeve i lozinke nemoj unositi u browser.</div>`;
}
function computedSizing(){let z=state.sizing,p=numeric(z.peak),g=numeric(z.growth),h=numeric(z.headroom);
if(!Number.isFinite(p)||p<=0||!Number.isFinite(g)||g<0||!Number.isFinite(h)||h<0)return null;
return {mbps:p*(1+g/100)*(1+h/100),gbps:p*(1+g/100)*(1+h/100)/1000,ha:z.ha?2:1};}
function snum(key,label,unit,desc){let z=state.sizing;return `<div class="field"><label>${esc(label)} (${unit})</label><input class="input" type="number" min="0" step="any" data-sizing="${key}" value="${esc(z[key])}" placeholder="Unos"><div class="helper">${esc(desc)}</div></div>`}
function scheck(key,title){return `<label class="field" style="display:flex;flex-direction:row;gap:12px;align-items:center;padding:13px;border:1px solid var(--line);border-radius:8px"><input type="checkbox" data-sizing="${key}" ${state.sizing[key]?'checked':''}><span>${esc(title)}</span></label>`}

// =============================================================================
// PRESALES STUDIO | v1.2 Dynamic model-aware sizing
// Author  : DAMIR OMERASEVIC
// Purpose : Derive site-level capacity needs and independently evaluate EVERY BOM row.
// Safety  : No combined TLS+IPS benchmark is invented; no sum of HA node throughput.
// Status  : BENCHMARK-BASED SCREENING ONLY; VENDOR SE DOUBLE-CHECK REQUIRED.
// =============================================================================
function bomModel(row){
  return D.models.find(x=>x.id===row.modelId)||null;
}
function bomRole(row){
  if(row.type && row.type!=='Hardware')return 'noncapacity';
  const m=bomModel(row);
  if(m)return m.capacityType;
  return 'unknown';
}
function siteTarget(row){
  const baseline=computedSizing();
  const own=numeric(row.traffic);
  const x=Number.isFinite(own)&&own>0?own:(baseline?numeric(state.sizing.peak):NaN);
  const g=numeric(state.sizing.growth),h=numeric(state.sizing.headroom);
  if(!Number.isFinite(x)||x<=0||!Number.isFinite(g)||g<0||!Number.isFinite(h)||h<0)return null;
  return {peak:x, growth:g,headroom:h, target:x*(1+g/100)*(1+h/100)};
}
function fmt3(n){return Number(n).toLocaleString('bs-BA',{maximumFractionDigits:3});}
function evaluateBom(row,index){
  const m=bomModel(row),role=bomRole(row),need=siteTarget(row),z=state.sizing;
  const rowLabel=(row.sku||row.desc||m?.name||'Stavka '+(index+1));
  if(role==='noncapacity')return {label:rowLabel,model:m,status:'N/A – KOMERCIJALNA STAVKA',cls:'caution',
    details:'Licence, support i implementacija ne stvaraju mrežni throughput. Provjeri entitlement, rok i ugovor.',
    formula:'Kapacitet se ne sabira za licence/support.',source:m?.source||''};
  if(role==='switch'||role==='wireless'||role==='management')return {label:rowLabel,model:m,status:'ZASEBAN DIMENZIONIŠI',cls:'caution',
    details:m.notes+' Potrebni su portovi/PoE/RF/switch fabric ili logs/sec; nije firewall throughput.',
    formula:'Nije primjenjiva Mbps NGFW formula; potrebna posebna provjera dizajna.',source:m.source};
  if(!m)return {label:rowLabel,model:null,status:'NEDOSTAJE MODEL',cls:'danger',details:'Dodaj model iz portfolija i provjeri tačan prodajni SKU.',
    formula:need?`${fmt3(need.peak)} × (1 + ${need.growth}/100) × (1 + ${need.headroom}/100) = ${fmt3(need.target)} Mbps`:'Peak i faktori nisu kompletni.',source:''};
  if(!need)return {label:rowLabel,model:m,status:'NEDOSTAJE TRAFFIC',cls:'danger',details:'Popuni peak Mbps ili override u BOM-u.',formula:'Potreban je peak promet.',source:m.source};
  const metric=z.ips?'ngfwGbps':'firewallGbps';
  const cap=m[metric], tlsCap=z.tls?m.tlsGbps:null;
  let status='CONDITIONAL – DOUBLE CHECK',cls='caution',reasons=[];
  if(typeof cap!=='number'){status='INSUFFICIENT DATA';cls='danger';reasons.push('Nedostaje '+(z.ips?'NGFW/Threat Protection':'firewall')+' benchmark.');}
  else if(cap*1000<need.target){status='FAIL – ISPOD TARGETA';cls='danger';reasons.push('Odabrani benchmark je ispod zahtjeva.');}
  if(z.tls){
    if(typeof tlsCap!=='number'){if(status!=='FAIL – ISPOD TARGETA'){status='INSUFFICIENT DATA';cls='danger';}reasons.push('Nedostaje TLS inspection/decryption throughput.');}
    else if(tlsCap*1000<need.target){status='FAIL – ISPOD TARGETA';cls='danger';reasons.push('TLS benchmark je ispod zahtjeva.');}
    else reasons.push('TLS i NGFW benchmarkovi su odvojeni; simultani throughput nije potvrđen.');
  }
  if(!z.ips&&!z.tls&&typeof cap==='number'&&cap*1000>=need.target)reasons.push('Preliminarno zadovoljen samo objavljeni firewall benchmark; production workload zahtijeva validaciju.');
  if(z.ha){
    let qty=numeric(row.qty);
    if(!Number.isFinite(qty)||qty<2)reasons.push('HA uključen: količina < 2, provjeriti HA dizajn i BOM.');
    else reasons.push('Active-passive: svaki čvor mora nositi puni target; dva čvora se ne sabiraju.');
  }
  reasons.push('Provjeriti portove, sesije/sec, firmware, licence, lifecycle i metodologiju testiranja.');
  const used=(z.ips?'NGFW/Threat Protection':'Firewall')+(z.tls?' + TLS zasebna provjera':'');
  const formula=`${fmt3(need.peak)} Mbps × (1 + ${fmt3(need.growth)}/100) × (1 + ${fmt3(need.headroom)}/100) = ${fmt3(need.target)} Mbps; ${used}: ${typeof cap==='number'?fmt3(cap*1000)+' Mbps':'N/P'}${z.tls?' ; TLS: '+(typeof tlsCap==='number'?fmt3(tlsCap*1000)+' Mbps':'N/P'):''}.`;
  return {label:rowLabel,model:m,status,cls,details:reasons.join(' '),formula,source:m.source,need:need.target,cap, tlsCap};
}
function sizingEvidence(){
 const r=computedSizing(),out=state.bom.map((row,i)=>evaluateBom(row,i));
 let noModel=out.filter(v=>v.status==='NEDOSTAJE MODEL').length,
 fail=out.filter(v=>v.status==='FAIL – ISPOD TARGETA').length,
 insufficient=out.filter(v=>v.status==='INSUFFICIENT DATA'||v.status==='NEDOSTAJE TRAFFIC').length;
 return {r,out,noModel,fail,insufficient};
}
function sizingMatrix(){
 const z=state.sizing,x=sizingEvidence();
 const formula=x.r?`${fmt3(numeric(z.peak))} × (1 + ${fmt3(numeric(z.growth))}/100) × (1 + ${fmt3(numeric(z.headroom))}/100) = ${fmt3(x.r.mbps)} Mbps`:'Unesi mjerene peak Mbps i pretpostavke.';
 return `<div class="card"><h2 style="margin-top:0">Dinamički model i formula</h2>
 <div class="formula" data-live-formula>${esc(formula)}</div>
 <p class="terms">Svaka BOM stavka koristi peak projektnog opterećenja ili zasebni override. Qty u HA paru NE množi propusnost. Bez zbirnog „BOM throughputa“ kroz više uređaja ili različite slojeve mreže.</p>
 <p class="muted">Checkboxovi mijenjaju koje vendor metrike se provjeravaju: TLS → TLS/SSL inspection, NGFW/IPS → Threat Protection ili FW+AVC+IPS, HA → dva čvora kao početna pretpostavka. Nema proizvoljnih penala.</p></div>
 <div class="sectiontitle"><h2>Kapacitet za svaku BOM stavku</h2><span class="subtle">${x.out.length} stavki • ${x.fail} ispod cilja • ${x.insufficient+x.noModel} bez podataka</span></div>
 <div class="tablewrap"><table><thead><tr><th>#</th><th>Oprema / model</th><th>Provjera</th><th>Formula (Mbps)</th><th>Izvor i double check</th></tr></thead><tbody>
 ${x.out.map((v,i)=>`<tr><td>${i+1}</td><td><strong>${esc(v.model?.name||v.label)}</strong><br><small>${esc(state.bom[i].sku||'SKU nije definisan')}</small></td>
 <td><span class="badge ${v.cls}">${esc(v.status)}</span><div class="helper">${esc(v.details)}</div></td>
 <td style="min-width:260px"><code style="white-space:normal">${esc(v.formula)}</code></td>
 <td>${v.source?link(v.source):'Nedostaje izvor'}<br><small class="muted">As of 21.10.2026 • vendor SE double check obavezan</small></td></tr>`).join('')||'<tr><td colspan="5" class="empty">BOM je prazan. Idi na BOM & TCO ili učitaj DEMO.</td></tr>'}
 </tbody></table></div><div class="notice warning"><b>DOUBLE CHECK MANDATORY:</b> Ovaj prikaz ne dokazuje performanse istovremeno uključenih TLS + IPS/NGFW servisa. Cisco i Fortinet koriste različite metode mjerenja. Odobrenje Vendor SE i provjera odgovarajućeg datasheeta / dostupnosti / licence su obavezni. Čak i kada numerički benchmark prelazi target, status ostaje uslovan.</div>`;
}
function modelSelectOptions(row){
 const selected=row.modelId||'';
 return `<select data-bom-model="${esc(row._idx)}" style="min-width:195px"><option value="">— Odaberi referentni model —</option>`+
 D.models.filter(m=>m.vendor===row.vendor).map(m=>`<option value="${esc(m.id)}" ${selected===m.id?'selected':''}>${esc(m.name)} (${esc(m.capacityType)})</option>`).join('')+'</select>';
}

function renderSizing(){
let r=computedSizing();
return ph('Capacity & sizing','Indikativni capacity target zasnovan na stvarnim mjerenjima. Bez lažnog automatskog preporučivanja modela.',`<button class="btn" data-action="print">↗ Štampaj pregled</button>`)+
`<div class="grid cols2"><div class="card"><div class="sectiontitle" style="margin-top:0"><h2>Performance inputs</h2></div><div class="formgrid" style="grid-template-columns:repeat(2,1fr)">${snum('peak','Measured peak traffic','Mbps','Mjerena vršna vrijednost, ne ugovoreni link.')}
${snum('wan','Contracted WAN','Mbps','Kontrolna referenca, nije sizing osnova.')}
${snum('users','Number of users','broj','Samo informacija za kontekst.')}
${snum('growth','Planned growth','%','Pretpostavka planiranog rasta, promijeni prema kupcu.')}
${snum('headroom','Capacity headroom','%','Inženjerska rezerva; nije standard vendora.')}
</div><div class="grid" style="gap:9px;margin-top:20px">${scheck('tls','Deep TLS inspection aktivna')}${scheck('ips','NGFW / IPS sigurnosne funkcije')}${scheck('ha','High availability potrebna')}</div></div>
<div class="grid"><div class="card" style="background:#112b3d;color:white;border-color:#112b3d"><div style="font-size:11px;opacity:.8;letter-spacing:1px">INDICATIVE WORKING TARGET</div><div class="numberBig" style="color:#6de6cb;font-size:52px;margin-top:11px"><span data-live-mbps>${r?fmt(r.mbps):'—'}</span> <span style="font-size:20px">Mbps</span></div><p style="color:#b8d0d8">Growth & headroom adjusted peak throughput</p><hr style="border:0;border-top:1px solid #34566b;margin:22px 0"><div class="grid cols2"><div><div class="subtle" style="color:#b8d0d8">Gbps target</div><strong style="font-size:20px" data-live-gbps>${r?fmt(r.gbps):'—'}</strong></div><div><div class="subtle" style="color:#b8d0d8">HA nodes*</div><strong style="font-size:20px" data-live-ha>${r?r.ha:'—'}</strong></div></div></div>
<div class="card"><h3 style="margin-top:0">Formula</h3><div class="formula">Peak Mbps × (1 + Growth %) × (1 + Headroom %)</div><p class="terms">* Broj uređaja predstavlja isključivo pojednostavljenu active-passive pretpostavku. Potrebno je validirati dizajn, napajanje, failover i podržane HA topologije.</p></div></div></div>
<div data-live-matrix>${sizingMatrix()}</div>
<div class="notice warning"><b>Presales gate:</b> Izračunati target <b>nije</b> isto što i firewall datasheet throughput. Obavezno uporedi <b>Threat Protection / NGFW, IPsec, IPS i TLS inspection</b> mjerne uslove, portove, concurrent sessions i new sessions/sec. Vendor SE odobrava finalni izbor.</div>`;
}
function link(u){return `<a class="source" href="${esc(u)}" target="_blank" rel="noopener noreferrer">Vendor ↗</a>`}
function renderCatalog(){
let rows=D.models.filter(x=>category==='All'||x.vendor===category).filter(x=>[x.name,x.category,x.notes,x.profile].join(' ').toLowerCase().includes(searchTerm.toLowerCase()));
return ph('Product portfolio','Referentni modelarski katalog ('+D.models.length+' zapisa). Provjerene brojke samo kada postoje odgovarajući službeni benchmarkovi; ostalo zahtijeva double check.')+
`<div class="toolbar"><div class="left">${['All','Cisco','Fortinet'].map(v=>`<button class="btn ${category===v?'primary':''}" data-category="${v}">${v==='All'?'SVI':v.toUpperCase()}</button>`).join('')}</div><input class="input" style="max-width:310px" id="search" placeholder="Model, kategorija..." value="${esc(searchTerm)}"></div>
<div class="tablewrap"><table><thead><tr><th>Vendor / model</th><th>Funkcija</th><th>Firewall Gbps</th><th>NGFW / Threat Gbps</th><th>TLS Gbps</th><th>Detalji / metodologija</th><th>Izvor</th><th>BOM</th></tr></thead><tbody>
${rows.map(x=>`<tr><td><b>${esc(x.name)}</b><br><span class="badge">${esc(x.vendor)}</span></td><td>${esc(x.category)}</td><td>${x.firewallGbps??'—'}</td><td>${x.ngfwGbps??'—'}</td><td>${x.tlsGbps??'—'}</td><td style="min-width:210px">${esc(x.notes)}<br><small class="muted">${esc(x.method||x.status)} · ${esc(x.verifiedOn)}</small></td><td>${link(x.source)}</td><td><button class="btn" data-addmodel="${esc(x.id)}">+ BOM</button></td></tr>`).join('')||'<tr><td colspan="8" class="empty">Nema modela.</td></tr>'}
</tbody></table></div>
<div class="notice warning">N/P ili crtica znači <b>nije potvrđeno</b>, ne nula. Za switch/WLAN/manager koristi se poseban kriterij kapaciteta (portovi, PoE, fabric, RF, logs/sec). Nema pouzdane numeričke uporedbe sa NGFW Mbps. Podaci su snapshot od 21.10.2026. i zahtijevaju vendor double check.</div>`;
}
function renderRefresh(){
let rows=D.refresh.filter(x=>refreshVendor==='All'||x.vendor===refreshVendor);
return ph('Technology refresh','Legacy uređaj → mogući moderni pravac. Fortinet kandidati su posebno označeni kao nevalidirana mapiranja.')+
`<div class="toolbar"><div class="left">${['All','Cisco','Fortinet'].map(v=>`<button class="btn ${refreshVendor===v?'primary':''}" data-refreshvendor="${v}">${v==='All'?'SVI':v.toUpperCase()}</button>`).join('')}</div></div>
<div class="tablewrap"><table><thead><tr><th>Vendor</th><th>Legacy uređaj</th><th>Modernisation candidate</th><th>Nivo potvrde</th><th>Tehničke provjere</th><th>Referenca</th></tr></thead><tbody>${rows.map(x=>`<tr><td>${esc(x.vendor)}</td><td><b>${esc(x.legacy)}</b></td><td><b>${esc(x.target)}</b></td><td><span class="badge ${x.confidence.startsWith('DOCUMENTED')?'ok':'caution'}">${esc(x.confidence)}</span></td><td>${esc(x.checks)}</td><td>${link(x.source)}</td></tr>`).join('')}</tbody></table></div>
<div class="notice danger"><b>Never auto-substitute:</b> Dokumentovani family upgrade nije identičan SKU. Fortinet refresh lista je namjerno označena kao kandidat bez proizvođačeve 1:1 potvrde. FortiOS software upgrade path ≠ hardware migration path.</div>`;
}
const types=['Hardware','Software','Security subscription','Support','Implementation'];
const statuses=['Nije validirano','Vendor SE potvrđeno','Nabavka potvrđena','Kupac odobrio'];
function bomTotals(){let cost=0,sale=0;let incomplete=false;state.bom.forEach(r=>{if(r.include===false)return;let qty=numeric(r.qty),buy=numeric(r.buy),sell=numeric(r.sell);if(!Number.isFinite(qty)||qty<=0||!Number.isFinite(buy)||buy<0||!Number.isFinite(sell)||sell<0||!(r.sku||'').trim())incomplete=true;if(Number.isFinite(qty)&&qty>0){if(Number.isFinite(buy)&&buy>=0)cost+=qty*buy;if(Number.isFinite(sell)&&sell>=0)sale+=qty*sell}});return {cost,sale,margin:sale>0&&!incomplete?(sale-cost)/sale*100:null,incomplete}}
function bomCards(){
const t=bomTotals(),c=state.project.currency;
return `${stat('UKUPNA NABAVNA',money(t.cost,c),'Interne cijene, ako su unesene')}${stat('UKUPNA PRODAJNA',money(t.sale,c),'Bez PDV-a i dodatnih stavki ako nisu unesene')}${stat('INDIKATIVNA MARŽA',t.margin===null?'—':fmt(t.margin)+'%',t.incomplete?'Unesi sve cijene, SKU i količine':'(Prodajno - nabavno) / prodajno')}`;
}
function renderBom(){
const t=bomTotals(),c=state.project.currency;
return ph('BOM & commercial model','Interni radni Bill of Materials. Kupcu šalji izdvojenu ponudu bez nabavnih cijena i marže.',`<button class="btn accent" data-action="addBom">+ Nova stavka</button><button class="btn" data-action="csvBom">↓ BOM CSV</button>`)+
`<div class="grid cols3" data-live-bom>${bomCards()}</div>
<div class="sectiontitle"><h2>Bill of Materials</h2><span class="subtle">${state.bom.length} stavki</span></div>
<div class="tablewrap"><table><thead><tr><th>#</th><th>TCO?</th><th>Vendor</th><th>SKU / model</th><th>Referentni proizvod</th><th>Peak (Mbps) override</th><th>Opis</th><th>Tip</th><th>Qty</th><th>Buy / kom</th><th>Sell / kom</th><th>Prodajno total</th><th>Validacija</th><th></th></tr></thead><tbody>
${state.bom.map((r,i)=>{let qty=numeric(r.qty),price=numeric(r.sell),total=Number.isFinite(qty)&&Number.isFinite(price)?qty*price:0;return `<tr><td>${i+1}</td><td><input type="checkbox" title="Uključi u TCO" aria-label="Uključi red ${i+1} u TCO" data-bom="${i}" data-field="include" ${r.include!==false?'checked':'' }></td><td><select data-bom="${i}" data-field="vendor">${['Cisco','Fortinet','Other'].map(x=>`<option ${x===r.vendor?'selected':''}>${x}</option>`).join('')}</select></td><td><input class="input" style="min-width:135px" data-bom="${i}" data-field="sku" value="${esc(r.sku)}" placeholder="Exact SKU"></td><td>${modelSelectOptions({...r,_idx:i})}</td><td><input class="input" type="number" min="0" step="any" style="max-width:110px" data-bom="${i}" data-field="traffic" value="${esc(r.traffic??'')}" placeholder="global"></td><td><input class="input" style="min-width:160px" data-bom="${i}" data-field="desc" value="${esc(r.desc)}" placeholder="Hardware, license, support..."></td><td><select data-bom="${i}" data-field="type">${types.map(x=>`<option ${x===r.type?'selected':''}>${x}</option>`).join('')}</select></td><td><input class="input" type="number" min="0" step="1" style="max-width:70px" data-bom="${i}" data-field="qty" value="${esc(r.qty)}"></td><td><input class="input" type="number" min="0" step=".01" style="max-width:120px" data-bom="${i}" data-field="buy" value="${esc(r.buy)}"></td><td><input class="input" type="number" min="0" step=".01" style="max-width:120px" data-bom="${i}" data-field="sell" value="${esc(r.sell)}"></td><td><b>${money(total,c)}</b></td><td><select data-bom="${i}" data-field="status">${statuses.map(x=>`<option ${x===r.status?'selected':''}>${x}</option>`).join('')}</select></td><td><button class="btn warn" data-removebom="${i}">×</button></td></tr>`}).join('')||'<tr><td colspan="14" class="empty">BOM je prazan. Klikni „Nova stavka“ ili učitaj demo podatke.</td></tr>'}</tbody></table></div><div class="sectiontitle"><h2>Live sizing povezan s BOM-om</h2></div><div data-live-bom-sizing>${sizingMatrix()}</div>
<div class="notice warning"><b>TCO? checkbox:</b> alternativne opcije poredi se u sizingu čak i kad su isključene iz TCO zbirnog iznosa. U financijske totals ulaze samo označeni redovi. Stvarni SKU provjeriti.<br>Sve cijene su korisnički unos; nema aktuelnog distributerskog cjenovnika niti potvrde zaliha. Ova marža ne uključuje poreze, kursne razlike, shipping, rebate i druge troškove ako nisu zasebno uneseni. Nikada ne dijeli interni BOM javno.</div>`;
}
function qaCards(q){return `${stat('POTVRĐENO',q.confirmed,q.total+' kontrolnih tačaka')}${stat('VERIFIKOVANO',q.verified,'Owner + dokaz + status')}${stat('OTVORENO',q.open,'Za dalji rad')}${stat('BLOKIRANO',q.blocked,'Za eskalaciju')}${stat('STATUS',q.ready?'REVIEW':'NOT READY',q.unverified+' potvrđenih bez dokaza; formalni potpis potreban')}`;}
function qaNotice(q){return q.ready?'<b>REVIEW:</b> Svi statusi su zatvoreni. Potrebna je ručna tehnička, komercijalna i odgovorna validacija.':'<b>NOT READY:</b> Postoje nezatvorene stavke. Demo alat ne može formalno odobriti vendor, cijene ili ponudu.';}
function renderQa(){
let q=qaStatus();
return ph('Quality & approval gate','Broj POTVRĐENO prati odabrani status, VERIFIKOVANO traži OWNER i DOKAZ. Sam status ne odobrava ponudu.',`<button class="btn" data-action="csvQa">↓ QA CSV</button>`)+
`<div class="grid cols4" data-live-qa>${qaCards(q)}</div>
<div class="notice ${q.ready?'':'danger'}" data-live-qa-notice>${qaNotice(q)}</div>
<div class="tablewrap"><table><thead><tr><th>#</th><th>Oblast</th><th>Gate / dokaz</th><th>Status</th><th>Owner</th><th>Dokaz / komentar</th></tr></thead><tbody>${D.qa.map((r,i)=>{let z=state.qa[i]||{};return `<tr><td>${i+1}</td><td><span class="badge">${esc(r.group)}</span></td><td><b>${esc(r.title)}</b></td><td><select data-qa="${i}" data-field="status">${['Otvoreno','Potvrđeno','Nije primjenjivo','Blokirano'].map(x=>`<option ${x===(z.status||'Otvoreno')?'selected':''}>${x}</option>`).join('')}</select></td><td><input class="input" data-qa="${i}" data-field="owner" value="${esc(z.owner||'')}" placeholder="Odgovorna osoba"></td><td><textarea data-qa="${i}" data-field="evidence" placeholder="Ref. dokumenta, odobrenje...">${esc(z.evidence||'')}</textarea></td></tr>`}).join('')}</tbody></table></div>`;
}
function renderGuide(){return ph('How it works','Pripremljeno za demonstraciju na razgovoru: interaktivan workflow, primjeri i jasna kontrola rizika.',actions())+
`<div class="grid cols2">
<div class="card"><h2>01 — O čemu je aplikacija?</h2><p>Pokazuje kako bi presales inženjer organizovao <b>requirements → sizing → solution shortlist → refresh → BOM → quality gate</b> za Cisco i Fortinet kupce.</p><p class="muted">Cilj: manje preskočenih zahtjeva, jasniji handover između sales, presales, vendor SE i nabavke.</p></div>
<div class="card"><h2>02 — Demo u 90 sekundi</h2><ol><li>„Učitaj DEMO“ — isključivo sintetički podaci.</li><li>Otvori <b>Discovery</b> — statusi i dokazi.</li><li>Otvori <b>Sizing</b> — vidi baseline i ograničenja.</li><li>Pregledaj <b>Refresh</b> i upozorenja.</li><li>Otvori <b>BOM</b> i <b>QA</b>.</li></ol></div>
<div class="card"><h2>03 — Sačuvaj i prenesi</h2><p>Projekt se automatski sprema u <b>localStorage</b> uređaja na kojem radiš.</p><p>Koristi <b>Sačuvaj JSON</b> za backup i <b>Uvezi JSON</b> za nastavak rada. Na demo scenariju možeš i izvesti CSV listove.</p><p class="terms">JSON može sadržavati korisničke zahtjeve i komercijalne cijene. Izbjegavaj javno postavljanje osjetljivih podataka na GitHub.</p></div>
<div class="card"><h2>04 — Šta alat ne radi?</h2><p>Nema automatske Cisco/Fortinet konfiguracije ni AI SKU preporuke. Nema prenosa podataka na server, rezervacije zaliha, live cijena, vendor API-ja ili formalne autorizacije.</p><p>To je <b>svjesno dizajnirana sigurnosna granica</b>: presales inženjer potvrđuje izvore i uključuje vendor SE za složenije odluke.</p></div></div>
<div class="sectiontitle"><h2>Zvanične reference za ponovnu provjeru</h2></div>
<div class="tablewrap"><table><thead><tr><th>Proizvođač</th><th>Vrsta</th><th>Izvor</th></tr></thead><tbody>${Object.entries(D.sources).map(([name,u])=>`<tr><td>${name.includes('forti')||name==='upgrade'||name==='lifecycle'?'Fortinet':'Cisco'}</td><td>${esc(name)}</td><td>${link(u)}</td></tr>`).join('')}</tbody></table></div><div class="notice">Copyright © 2026 DAMIR OMERASEVIC. Independent interview showcase. Nema povezanosti s vlasnicima zaštitnih znakova.</div>`;
}
function render(){
document.getElementById('currentSection').textContent=labels[view]||'OVERVIEW';
document.querySelectorAll('nav button').forEach(b=>b.classList.toggle('active',b.dataset.view===view));
document.querySelector('#demoLabel').textContent=state.project.demo?'SYNTHETIC DEMO':'LIVE WORKSPACE';
document.querySelector('#demoLabel').classList.toggle('demo',Boolean(state.project.demo));
const fn={dashboard:renderDashboard,discovery:renderDiscovery,sizing:renderSizing,catalog:renderCatalog,refresh:renderRefresh,bom:renderBom,qa:renderQa,guide:renderGuide}[view];
document.getElementById('main').innerHTML=fn();save();
}
function navigate(to){view=to;searchTerm='';render();window.scrollTo({top:0,behavior:'instant'});document.querySelector('#sidebar').classList.remove('open')}
function setPath(obj,path,val){let seg=path.split('.'),target=obj;for(let i=0;i<seg.length-1;i++)target=target[seg[i]];target[seg.at(-1)]=val}
function demo(){
if(!confirm('Učitati primjer sa sintetičkim DEMO podacima? Postojeći projekt u ovom browseru biće zamijenjen.'))return;
state=blank();state.project={name:'Branch Secure Connect 2026',client:'DEMO – fictional retail network',owner:'DAMIR OMERASEVIC',scope:'Refresh / Modernisation',currency:'KM',demo:true};
state.sizing={peak:600,wan:1000,users:250,growth:30,headroom:25,tls:true,ips:true,ha:true};
['Cisco','Fortinet'].forEach(v=>D.discovery[v].forEach((q,i)=>{if(i<7)state.discovery[v][i]={answer:['Demo projekat za presales demonstraciju','Maloprodaja, poslovni servisi, segmentacija','Refresh mrežne i sigurnosne opreme','Izbor rješenja kroz tehničku i komercijalnu analizu','1 sjedište i 5 poslovnica; 250 korisnika','2 internet linka, jedan backup','L2/L3 segmentacija, VPN između lokacija'][i],status:'Potvrđeno',evidence:'SIMULIRANI DEMO — nije stvarni kupac'}}));
state.bom=[{"vendor":"Fortinet","modelId":"fortinet-fortigate-90g","include":true,"sku":"DEMO-NOT-A-SKU","desc":"FortiGate 90G – referentni model za usporedbu","type":"Hardware","qty":2,"traffic":"","buy":1300,"sell":1800,"status":"Nije validirano"},{"vendor":"Cisco","modelId":"cisco-secure-firewall-1210ce","include":false,"sku":"DEMO-NOT-A-SKU","desc":"Cisco Secure Firewall 1210CE – alternativni tehnički scenario","type":"Hardware","qty":2,"traffic":"","buy":2000,"sell":2700,"status":"Nije validirano"},{"vendor":"Fortinet","sku":"DEMO-SERVICE-VERIFY","include":true,"desc":"Simulirani FortiCare / FortiGuard (licenca nije potvrđena)","type":"Support","qty":2,"traffic":"","buy":480,"sell":690,"status":"Nije validirano"}];
state.qa[0]={status:'Potvrđeno',owner:'Presales',evidence:'SINTETIČKI DEMO'};
save();navigate('dashboard');toast('DEMO učitan — svi podaci su izmišljeni za prezentaciju.');
}
function dl(name,text,type='application/json;charset=utf-8'){let url=URL.createObjectURL(new Blob([text],{type})),a=document.createElement('a');a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000)}
function csvVal(v){return '"'+String(v??'').replace(/"/g,'""')+'"'}
function csvExport(kind){let rows;if(kind==='discovery'){rows=[['Vendor','Segment','Pitanje','Odgovor','Status','Dokaz']];D.discovery[vendor].forEach((r,i)=>{let z=state.discovery[vendor][i]||{};rows.push([vendor,r.group,r.question,z.answer||'',z.status||'Otvoreno',z.evidence||''])})}
else if(kind==='bom'){rows=[['U TCO','Vendor','SKU','Referentni model','Traffic override Mbps','Opis','Tip','Količina','Nabavna','Prodajna','Status','Sizing status']];state.bom.forEach((r,i)=>rows.push([r.include!==false?'DA':'NE',r.vendor,r.sku,bomModel(r)?.name||'',r.traffic??'',r.desc,r.type,r.qty,r.buy,r.sell,r.status,evaluateBom(r,i).status]))}
else{rows=[['Oblast','Kontrolni cilj','Status','Owner','Dokaz']];D.qa.forEach((r,i)=>{let z=state.qa[i]||{};rows.push([r.group,r.title,z.status||'Otvoreno',z.owner||'',z.evidence||''])})}
dl('presales_'+kind+'_'+(kind==='discovery'?vendor.toLowerCase():'')+'.csv','\uFEFF'+rows.map(r=>r.map(csvVal).join(',')).join('\r\n'),'text/csv;charset=utf-8');toast('CSV izvoz uspješan.')}
function importJSON(file){if(!file)return;if(file.size>3_000_000){toast('JSON fajl je prevelik.');return}let r=new FileReader();r.onload=()=>{try{let obj=JSON.parse(r.result);if(!obj||obj.version!==1||!obj.project||!obj.sizing||!obj.discovery||!obj.qa||!Array.isArray(obj.bom))throw Error('invalid');
if(!confirm('Zamijeniti lokalni projekat uvezenim JSON fajlom?'))return;state=obj;save();render();toast('Projekt uvezen.')}catch(e){toast('JSON nije validan presales projekt v1.')}};r.readAsText(file)}
document.addEventListener('click',e=>{
let v=e.target.closest('[data-view]');if(v){navigate(v.dataset.view);return}
let vd=e.target.closest('[data-vendor]');if(vd){vendor=vd.dataset.vendor;render();return}
let c=e.target.closest('[data-category]');if(c){category=c.dataset.category;render();return}
let rf=e.target.closest('[data-refreshvendor]');if(rf){refreshVendor=rf.dataset.refreshvendor;render();return}
let addmod=e.target.closest('[data-addmodel]');if(addmod){let m=D.models.find(x=>x.id===addmod.dataset.addmodel);if(m){state.bom.push({vendor:m.vendor,modelId:m.id,sku:'',desc:m.name,type:'Hardware',traffic:'',qty:1,include:true,buy:'',sell:'',status:'Nije validirano'});navigate('bom');toast('Model dodat u BOM; unesi stvarni prodajni SKU i cijene.')}return}
let rem=e.target.closest('[data-removebom]');if(rem){state.bom.splice(+rem.dataset.removebom,1);render();return}
let a=e.target.closest('[data-action]');if(!a)return;
switch(a.dataset.action){
case 'loadDemo':demo();break;
case 'export':dl('presales_project_'+new Date().toISOString().slice(0,10)+'.json',JSON.stringify(state,null,2));toast('Projekt izvezen kao JSON.');break;
case 'import':document.getElementById('fileInput')?.remove();let inp=document.createElement('input');inp.type='file';inp.id='fileInput';inp.accept='.json,application/json';inp.hidden=true;document.body.append(inp);inp.onchange=()=>importJSON(inp.files[0]);inp.click();break;
case 'addBom':state.bom.push({vendor:'Cisco',sku:'',desc:'',type:'Hardware',qty:1,include:true,buy:'',sell:'',status:'Nije validirano'});render();break;
case 'csvBom':csvExport('bom');break;
case 'csvDiscovery':csvExport('discovery');break;
case 'csvQa':csvExport('qa');break;
case 'print':window.print();break;
}});
document.addEventListener('input',e=>{
let t=e.target;if(t.id==='search'){searchTerm=t.value;let pos=t.selectionStart;render();let search=document.getElementById('search');search.focus();search.setSelectionRange(pos,pos);return}
if(t.dataset.path){setPath(state,t.dataset.path,t.value);save();return}
if(t.dataset.discovery){let v=t.dataset.discovery,i=t.dataset.index,f=t.dataset.field;state.discovery[v][i]??={};state.discovery[v][i][f]=t.value;save();liveUpdate();return}
if(t.dataset.sizing){state.sizing[t.dataset.sizing]=t.type==='checkbox'?t.checked:t.value;save();liveUpdate();return}
if(t.dataset.bom!==undefined){state.bom[+t.dataset.bom][t.dataset.field]=t.type==='checkbox'?t.checked:t.value;save();liveUpdate();return}
if(t.dataset.qa!==undefined){state.qa[t.dataset.qa]??={};state.qa[t.dataset.qa][t.dataset.field]=t.value;save();liveUpdate();return}
});
document.addEventListener('change',e=>{
let t=e.target;
if(t.dataset.bomModel!==undefined){const i=+t.dataset.bomModel,m=D.models.find(x=>x.id===t.value);state.bom[i].modelId=m?m.id:'';if(m){state.bom[i].vendor=m.vendor;state.bom[i].desc=m.name;state.bom[i].type='Hardware';}save();render();return}
if(t.dataset.sizing){state.sizing[t.dataset.sizing]=t.type==='checkbox'?t.checked:t.value;render();return}
if(t.dataset.path){setPath(state,t.dataset.path,t.value);render();return}
if(t.dataset.discovery){let v=t.dataset.discovery,i=t.dataset.index,f=t.dataset.field;state.discovery[v][i]??={};state.discovery[v][i][f]=t.value;if(f==='status')render();else save();return}
if(t.dataset.bom!==undefined){let row=state.bom[+t.dataset.bom];row[t.dataset.field]=t.type==='checkbox'?t.checked:t.value;if(t.dataset.field==='vendor'){row.modelId='';}render();return}
if(t.dataset.qa!==undefined){state.qa[t.dataset.qa]??={};state.qa[t.dataset.qa][t.dataset.field]=t.value;render();return}
});
document.querySelector('#resetBtn').onclick=()=>{if(confirm('Obrisati sve lokalno sačuvane podatke projekta?')){state=blank();vendor='Cisco';navigate('dashboard');toast('Projekt resetovan.')}};
document.querySelector('#menuToggle').onclick=()=>document.querySelector('#sidebar').classList.toggle('open');
render();

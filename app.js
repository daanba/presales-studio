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
const KEY='presales-studio-v1';
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
function pctDone(v){let q=D.discovery[v];let obj=state.discovery[v]||{};let done=q.filter((_,i)=>{const x=obj[i];return x&&(x.status==='Potvrđeno'?Boolean((x.answer||'').trim()&&(x.evidence||'').trim()):(x.status==='Nije primjenjivo'?Boolean((x.evidence||'').trim()):false))}).length;return [done,q.length,Math.round(done/q.length*100)]}
function qaStatus(){let ok=0,blocked=0,open=0;D.qa.forEach((_,i)=>{let s=state.qa[i]?.status||'Otvoreno';let r=state.qa[i]||{};if((s==='Potvrđeno'||s==='Nije primjenjivo')&&(r.owner||'').trim()&&(r.evidence||'').trim())ok++;else if(s==='Blokirano')blocked++;else open++});return {ok,blocked,open,total:D.qa.length,ready:ok===D.qa.length&&blocked===0}}
const stat=(title,number,hint)=>`<div class="card kpi"><div class="label">${title}</div><div class="number">${number}</div><div class="hint">${hint}</div></div>`;
function ph(title,desc,buttons=''){return `<div class="pagehead"><div><div class="eyebrow">PRESALES STUDIO / ${esc(view.toUpperCase())}</div><h1>${title}</h1><p>${desc}</p></div><div class="btnrow">${buttons}</div></div>`}
function actions(extra=''){return `<button class="btn" data-action="loadDemo">▶ Učitaj DEMO</button><button class="btn" data-action="export">↓ Sačuvaj JSON</button><button class="btn" data-action="import">↑ Uvezi JSON</button>${extra}`}
function progress(label,arr){return `<div style="margin:13px 0"><div style="display:flex;justify-content:space-between;margin-bottom:8px"><strong>${label}</strong><span class="subtle">${arr[0]} / ${arr[1]} potvrđeno · ${arr[2]}%</span></div><div class="progressbar"><div style="width:${arr[2]}%"></div></div></div>`}
function renderDashboard(){
const c=pctDone('Cisco'),f=pctDone('Fortinet'),q=qaStatus();
return ph('From discovery to decision.','Jedinstven, pregledan presales proces za Cisco & Fortinet — od prvog razgovora s kupcem do tehnički provjerene ponude.',actions())+
`<div class="grid cols4">${stat('CISCO DISCOVERY',c[2]+'%','Verifikovano '+c[0]+' / '+c[1])}${stat('FORTINET DISCOVERY',f[2]+'%','Verifikovano '+f[0]+' / '+f[1])}${stat('BOM STAVKE',state.bom.length,'Hardver, licence i support')}${stat('QA GATE',q.ready?'REVIEW':'NOT READY',q.open+' otvorenih · '+q.blocked+' blokiranih')}</div>
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
`<div class="toolbar"><div class="left">${vswitch()}<span class="badge">${arr.length} pitanja</span></div><div style="min-width:240px">${progress(vendor+' status',progressArr)}</div></div>
<div class="tablewrap"><table><thead><tr><th>#</th><th>Oblast</th><th>Pitanje / ulazni parametar</th><th>Odgovor kupca</th><th>Status</th><th>Dokaz / napomena</th></tr></thead><tbody>${arr.map((row,i)=>{let r=records[i]||{};return `<tr><td><span class="muted">${String(i+1).padStart(2,'0')}</span></td><td><span class="badge">${esc(row.group)}</span><br><small class="muted">${esc(row.priority)}</small></td><td style="min-width:220px"><b>${esc(row.question)}</b><div class="helper">${esc(row.unit)}</div></td><td><textarea data-discovery="${esc(vendor)}" data-index="${i}" data-field="answer" placeholder="Upiši odgovor...">${esc(r.answer||'')}</textarea></td><td><select data-discovery="${esc(vendor)}" data-index="${i}" data-field="status">${['Otvoreno','Potvrđeno','Nije primjenjivo','Blokirano'].map(x=>`<option ${x===(r.status||'Otvoreno')?'selected':''}>${x}</option>`).join('')}</select></td><td><textarea data-discovery="${esc(vendor)}" data-index="${i}" data-field="evidence" placeholder="Izvor, link ili referenca...">${esc(r.evidence||'')}</textarea></td></tr>`}).join('')}</tbody></table></div><div class="notice">Za izvještaj su važni statusi i dokazi, ne samo ispunjena tekstualna polja. Povjerljive mrežne konfiguracije, privatne ključeve i lozinke nemoj unositi u browser.</div>`;
}
function computedSizing(){let z=state.sizing,p=numeric(z.peak),g=numeric(z.growth),h=numeric(z.headroom);
if(!Number.isFinite(p)||p<=0||!Number.isFinite(g)||g<0||!Number.isFinite(h)||h<0)return null;
return {mbps:p*(1+g/100)*(1+h/100),gbps:p*(1+g/100)*(1+h/100)/1000,ha:z.ha?2:1};}
function snum(key,label,unit,desc){let z=state.sizing;return `<div class="field"><label>${esc(label)} (${unit})</label><input class="input" type="number" min="0" step="any" data-sizing="${key}" value="${esc(z[key])}" placeholder="Unos"><div class="helper">${esc(desc)}</div></div>`}
function scheck(key,title){return `<label class="field" style="display:flex;flex-direction:row;gap:12px;align-items:center;padding:13px;border:1px solid var(--line);border-radius:8px"><input type="checkbox" data-sizing="${key}" ${state.sizing[key]?'checked':''}><span>${esc(title)}</span></label>`}
function renderSizing(){
let r=computedSizing();
return ph('Capacity & sizing','Indikativni capacity target zasnovan na stvarnim mjerenjima. Bez lažnog automatskog preporučivanja modela.',`<button class="btn" data-action="print">↗ Štampaj pregled</button>`)+
`<div class="grid cols2"><div class="card"><div class="sectiontitle" style="margin-top:0"><h2>Performance inputs</h2></div><div class="formgrid" style="grid-template-columns:repeat(2,1fr)">${snum('peak','Measured peak traffic','Mbps','Mjerena vršna vrijednost, ne ugovoreni link.')}
${snum('wan','Contracted WAN','Mbps','Kontrolna referenca, nije sizing osnova.')}
${snum('users','Number of users','broj','Samo informacija za kontekst.')}
${snum('growth','Planned growth','%','Pretpostavka planiranog rasta, promijeni prema kupcu.')}
${snum('headroom','Capacity headroom','%','Inženjerska rezerva; nije standard vendora.')}
</div><div class="grid" style="gap:9px;margin-top:20px">${scheck('tls','Deep TLS inspection aktivna')}${scheck('ips','NGFW / IPS sigurnosne funkcije')}${scheck('ha','High availability potrebna')}</div></div>
<div class="grid"><div class="card" style="background:#112b3d;color:white;border-color:#112b3d"><div style="font-size:11px;opacity:.8;letter-spacing:1px">INDICATIVE WORKING TARGET</div><div class="numberBig" style="color:#6de6cb;font-size:52px;margin-top:11px">${r?fmt(r.mbps):'—'} <span style="font-size:20px">Mbps</span></div><p style="color:#b8d0d8">Growth & headroom adjusted peak throughput</p><hr style="border:0;border-top:1px solid #34566b;margin:22px 0"><div class="grid cols2"><div><div class="subtle" style="color:#b8d0d8">Gbps target</div><strong style="font-size:20px">${r?fmt(r.gbps):'—'}</strong></div><div><div class="subtle" style="color:#b8d0d8">HA nodes*</div><strong style="font-size:20px">${r?r.ha:'—'}</strong></div></div></div>
<div class="card"><h3 style="margin-top:0">Formula</h3><div class="formula">Peak Mbps × (1 + Growth %) × (1 + Headroom %)</div><p class="terms">* Broj uređaja predstavlja isključivo pojednostavljenu active-passive pretpostavku. Potrebno je validirati dizajn, napajanje, failover i podržane HA topologije.</p></div></div></div>
<div class="notice warning"><b>Presales gate:</b> 975 Mbps izražen kroz ovaj proračun <b>nije</b> isto što i firewall datasheet throughput. Obavezno uporedi <b>Threat Protection / NGFW, IPsec, IPS i TLS inspection</b> mjerne uslove, portove, concurrent sessions i new sessions/sec. Vendor SE odobrava finalni izbor.</div>`;
}
function link(u){return `<a class="source" href="${esc(u)}" target="_blank" rel="noopener noreferrer">Vendor ↗</a>`}
function renderCatalog(){
let rows=D.catalog.filter(x=>category==='All'||x.vendor===category).filter(x=>[x.family,x.category,x.use,x.verify].join(' ').toLowerCase().includes(searchTerm.toLowerCase()));
return ph('Product portfolio','Relevantne Cisco i Fortinet porodice; indikativni use-caseovi, bez izmišljanja SKU-a, cijena i dostupnosti.')+
`<div class="toolbar"><div class="left">${['All','Cisco','Fortinet'].map(v=>`<button class="btn ${category===v?'primary':''}" data-category="${v}">${v==='All'?'SVI PROIZVODI':v.toUpperCase()}</button>`).join('')}</div><input class="input" style="max-width:310px" id="search" placeholder="Pretraži porodice i namjenu..." value="${esc(searchTerm)}"></div>
<div class="tablewrap"><table><thead><tr><th>Vendor</th><th>Segment</th><th>Porodica / rješenje</th><th>Presales use-case</th><th>Validacija prije ponude</th><th>Izvor</th></tr></thead><tbody>
${rows.map(x=>`<tr><td><span class="badge ${x.vendor==='Fortinet'?'ok':''}">${esc(x.vendor)}</span></td><td>${esc(x.category)}</td><td><b>${esc(x.family)}</b></td><td>${esc(x.use)}</td><td>${esc(x.verify)}</td><td>${link(x.source)}</td></tr>`).join('')||'<tr><td colspan="6" class="empty">Nema podudaranja.</td></tr>'}</tbody></table></div>
<div class="notice warning">Prije RFQ-a provjeri <b>tačan SKU, EoS/EoL/LDOS, performance test methodology, softversku verziju, licencu, support i dostupnost</b> kod proizvođača i distributera. Ovaj katalog nije live feed.</div>`;
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
function bomTotals(){let cost=0,sale=0;let incomplete=false;state.bom.forEach(r=>{let qty=numeric(r.qty),buy=numeric(r.buy),sell=numeric(r.sell);if(!Number.isFinite(qty)||qty<=0||!Number.isFinite(buy)||buy<0||!Number.isFinite(sell)||sell<0||!(r.sku||'').trim())incomplete=true;if(Number.isFinite(qty)&&qty>0){if(Number.isFinite(buy)&&buy>=0)cost+=qty*buy;if(Number.isFinite(sell)&&sell>=0)sale+=qty*sell}});return {cost,sale,margin:sale>0&&!incomplete?(sale-cost)/sale*100:null,incomplete}}
function renderBom(){
const t=bomTotals(),c=state.project.currency;
return ph('BOM & commercial model','Interni radni Bill of Materials. Kupcu šalji izdvojenu ponudu bez nabavnih cijena i marže.',`<button class="btn accent" data-action="addBom">+ Nova stavka</button><button class="btn" data-action="csvBom">↓ BOM CSV</button>`)+
`<div class="grid cols3">${stat('UKUPNA NABAVNA',money(t.cost,c),'Samo validirane interne cijene')}${stat('UKUPNA PRODAJNA',money(t.sale,c),'Bez PDV-a i dodatnih stavki ako nisu unesene')}${stat('INDIKATIVNA MARŽA',t.margin===null?'—':fmt(t.margin)+'%',t.incomplete?'Unesi sve cijene, SKU i količine':'(Prodajno - nabavno) / prodajno')}</div>
<div class="sectiontitle"><h2>Bill of Materials</h2><span class="subtle">${state.bom.length} stavki</span></div>
<div class="tablewrap"><table><thead><tr><th>#</th><th>Vendor</th><th>SKU / model</th><th>Opis</th><th>Tip</th><th>Qty</th><th>Buy / kom</th><th>Sell / kom</th><th>Prodajno total</th><th>Validacija</th><th></th></tr></thead><tbody>
${state.bom.map((r,i)=>{let qty=numeric(r.qty),price=numeric(r.sell),total=Number.isFinite(qty)&&Number.isFinite(price)?qty*price:0;return `<tr><td>${i+1}</td><td><select data-bom="${i}" data-field="vendor">${['Cisco','Fortinet','Other'].map(x=>`<option ${x===r.vendor?'selected':''}>${x}</option>`).join('')}</select></td><td><input class="input" style="min-width:135px" data-bom="${i}" data-field="sku" value="${esc(r.sku)}" placeholder="Exact SKU"></td><td><input class="input" style="min-width:160px" data-bom="${i}" data-field="desc" value="${esc(r.desc)}" placeholder="Hardware, license, support..."></td><td><select data-bom="${i}" data-field="type">${types.map(x=>`<option ${x===r.type?'selected':''}>${x}</option>`).join('')}</select></td><td><input class="input" type="number" min="0" step="1" style="max-width:70px" data-bom="${i}" data-field="qty" value="${esc(r.qty)}"></td><td><input class="input" type="number" min="0" step=".01" style="max-width:120px" data-bom="${i}" data-field="buy" value="${esc(r.buy)}"></td><td><input class="input" type="number" min="0" step=".01" style="max-width:120px" data-bom="${i}" data-field="sell" value="${esc(r.sell)}"></td><td><b>${money(total,c)}</b></td><td><select data-bom="${i}" data-field="status">${statuses.map(x=>`<option ${x===r.status?'selected':''}>${x}</option>`).join('')}</select></td><td><button class="btn warn" data-removebom="${i}">×</button></td></tr>`}).join('')||'<tr><td colspan="11" class="empty">BOM je prazan. Klikni „Nova stavka“ ili učitaj demo podatke.</td></tr>'}</tbody></table></div>
<div class="notice warning">Sve cijene su korisnički unos; nema aktuelnog distributerskog cjenovnika niti potvrde zaliha. Ova marža ne uključuje poreze, kursne razlike, shipping, rebate i druge troškove ako nisu zasebno uneseni. Nikada ne dijeli interni BOM javno.</div>`;
}
function renderQa(){
let q=qaStatus();
return ph('Quality & approval gate','Ponuda nije spremna dok otvorene i blokirane stavke nisu razriješene i dokumentovane.',`<button class="btn" data-action="csvQa">↓ QA CSV</button>`)+
`<div class="grid cols4">${stat('POTVRĐENO',q.ok,q.total+' kontrolnih tačaka')}${stat('OTVORENO',q.open,'Za dalji rad')}${stat('BLOKIRANO',q.blocked,'Za eskalaciju')}${stat('STATUS',q.ready?'REVIEW':'NOT READY',q.ready?'Potrebno formalno odobrenje':'Nije spremno za izdavanje')}</div>
<div class="notice ${q.ready?'':'danger'}">${q.ready?'<b>REVIEW:</b> Svi statusi su zatvoreni. Potrebna je ručna tehnička, komercijalna i odgovorna validacija.':'<b>NOT READY:</b> Postoje nezatvorene stavke. Demo alat ne može formalno odobriti vendor, cijene ili ponudu.'}</div>
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
state.bom=[{vendor:'Fortinet',sku:'DEMO-SKU-VERIFY',desc:'Primjer firewall uređaja; SKU nije ponuda',type:'Hardware',qty:2,buy:1300,sell:1800,status:'Nije validirano'}, {vendor:'Fortinet',sku:'DEMO-SERVICE-VERIFY',desc:'Simulirani support + security subscription',type:'Support',qty:2,buy:480,sell:690,status:'Nije validirano'}];
state.qa[0]={status:'Potvrđeno',owner:'Presales',evidence:'SINTETIČKI DEMO'};
save();navigate('dashboard');toast('DEMO učitan — svi podaci su izmišljeni za prezentaciju.');
}
function dl(name,text,type='application/json;charset=utf-8'){let url=URL.createObjectURL(new Blob([text],{type})),a=document.createElement('a');a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000)}
function csvVal(v){return '"'+String(v??'').replace(/"/g,'""')+'"'}
function csvExport(kind){let rows;if(kind==='discovery'){rows=[['Vendor','Segment','Pitanje','Odgovor','Status','Dokaz']];D.discovery[vendor].forEach((r,i)=>{let z=state.discovery[vendor][i]||{};rows.push([vendor,r.group,r.question,z.answer||'',z.status||'Otvoreno',z.evidence||''])})}
else if(kind==='bom'){rows=[['Vendor','SKU','Opis','Tip','Količina','Nabavna','Prodajna','Status']];state.bom.forEach(r=>rows.push([r.vendor,r.sku,r.desc,r.type,r.qty,r.buy,r.sell,r.status]))}
else{rows=[['Oblast','Kontrolni cilj','Status','Owner','Dokaz']];D.qa.forEach((r,i)=>{let z=state.qa[i]||{};rows.push([r.group,r.title,z.status||'Otvoreno',z.owner||'',z.evidence||''])})}
dl('presales_'+kind+'_'+(kind==='discovery'?vendor.toLowerCase():'')+'.csv','\uFEFF'+rows.map(r=>r.map(csvVal).join(',')).join('\r\n'),'text/csv;charset=utf-8');toast('CSV izvoz uspješan.')}
function importJSON(file){if(!file)return;if(file.size>3_000_000){toast('JSON fajl je prevelik.');return}let r=new FileReader();r.onload=()=>{try{let obj=JSON.parse(r.result);if(!obj||obj.version!==1||!obj.project||!obj.sizing||!obj.discovery||!obj.qa||!Array.isArray(obj.bom))throw Error('invalid');
if(!confirm('Zamijeniti lokalni projekat uvezenim JSON fajlom?'))return;state=obj;save();render();toast('Projekt uvezen.')}catch(e){toast('JSON nije validan presales projekt v1.')}};r.readAsText(file)}
document.addEventListener('click',e=>{
let v=e.target.closest('[data-view]');if(v){navigate(v.dataset.view);return}
let vd=e.target.closest('[data-vendor]');if(vd){vendor=vd.dataset.vendor;render();return}
let c=e.target.closest('[data-category]');if(c){category=c.dataset.category;render();return}
let rf=e.target.closest('[data-refreshvendor]');if(rf){refreshVendor=rf.dataset.refreshvendor;render();return}
let rem=e.target.closest('[data-removebom]');if(rem){state.bom.splice(+rem.dataset.removebom,1);render();return}
let a=e.target.closest('[data-action]');if(!a)return;
switch(a.dataset.action){
case 'loadDemo':demo();break;
case 'export':dl('presales_project_'+new Date().toISOString().slice(0,10)+'.json',JSON.stringify(state,null,2));toast('Projekt izvezen kao JSON.');break;
case 'import':document.getElementById('fileInput')?.remove();let inp=document.createElement('input');inp.type='file';inp.id='fileInput';inp.accept='.json,application/json';inp.hidden=true;document.body.append(inp);inp.onchange=()=>importJSON(inp.files[0]);inp.click();break;
case 'addBom':state.bom.push({vendor:'Cisco',sku:'',desc:'',type:'Hardware',qty:1,buy:'',sell:'',status:'Nije validirano'});render();break;
case 'csvBom':csvExport('bom');break;
case 'csvDiscovery':csvExport('discovery');break;
case 'csvQa':csvExport('qa');break;
case 'print':window.print();break;
}});
document.addEventListener('input',e=>{
let t=e.target;if(t.id==='search'){searchTerm=t.value;let pos=t.selectionStart;render();let search=document.getElementById('search');search.focus();search.setSelectionRange(pos,pos);return}
if(t.dataset.path){setPath(state,t.dataset.path,t.value);save();return}
if(t.dataset.discovery){let v=t.dataset.discovery,i=t.dataset.index,f=t.dataset.field;state.discovery[v][i]??={};state.discovery[v][i][f]=t.value;save();return}
if(t.dataset.sizing){state.sizing[t.dataset.sizing]=t.type==='checkbox'?t.checked:t.value;save();return}
if(t.dataset.bom!==undefined){state.bom[+t.dataset.bom][t.dataset.field]=t.value;save();return}
if(t.dataset.qa!==undefined){state.qa[t.dataset.qa]??={};state.qa[t.dataset.qa][t.dataset.field]=t.value;save();return}
});
document.addEventListener('change',e=>{
let t=e.target;
if(t.dataset.sizing){state.sizing[t.dataset.sizing]=t.type==='checkbox'?t.checked:t.value;render();return}
if(t.dataset.path){setPath(state,t.dataset.path,t.value);render();return}
if(t.dataset.discovery){let v=t.dataset.discovery,i=t.dataset.index,f=t.dataset.field;state.discovery[v][i]??={};state.discovery[v][i][f]=t.value;if(f==='status')render();else save();return}
if(t.dataset.bom!==undefined){state.bom[+t.dataset.bom][t.dataset.field]=t.value;render();return}
if(t.dataset.qa!==undefined){state.qa[t.dataset.qa]??={};state.qa[t.dataset.qa][t.dataset.field]=t.value;render();return}
});
document.querySelector('#resetBtn').onclick=()=>{if(confirm('Obrisati sve lokalno sačuvane podatke projekta?')){state=blank();vendor='Cisco';navigate('dashboard');toast('Projekt resetovan.')}};
document.querySelector('#menuToggle').onclick=()=>document.querySelector('#sidebar').classList.toggle('open');
render();

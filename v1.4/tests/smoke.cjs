/* Presales Studio / DAMIR OMERASEVIC / local smoke tests: node tests/smoke.cjs */

const fs=require('fs'),vm=require('vm'),assert=require('assert');
const stateStore={};
let rootEl={innerHTML:''},heading={textContent:''},demoEl={textContent:'',classList:{toggle(){}}};
let document={
 getElementById(id){return id==='main'?rootEl:id==='currentSection'?heading:null},
 querySelector(s){if(s==='#main')return rootEl;if(s==='#demoLabel')return demoEl;if(s==='#resetBtn'||s==='#menuToggle')return {onclick:null};return {textContent:'',style:{},classList:{remove(){},toggle(){}}}},
 querySelectorAll(){return []},
 addEventListener(){},
};
const context={window:{},document,localStorage:{getItem(k){return stateStore[k]||null},setItem(k,v){stateStore[k]=v}},setTimeout(){},clearTimeout(){},console,confirm(){return true},URL,Blob,FileReader:function(){}};
vm.createContext(context);
vm.runInContext(fs.readFileSync('data.js','utf8'),context);
Object.assign(context.window.PRESALES_DATA,JSON.parse(fs.readFileSync(require('path').join(__dirname,'..','data/core.json'),'utf8')));
// v1.3: data.js holds core configuration; portfolio and refresh live in separate JSON.
const catDir=require('path').join(__dirname,'..','data');
const catalogModels=['cisco-portfolio.json','fortinet-portfolio.json'].flatMap(f=>JSON.parse(fs.readFileSync(require('path').join(catDir,f),'utf8')));
const catalogRefresh=['cisco-refresh.json','fortinet-refresh.json'].flatMap(f=>JSON.parse(fs.readFileSync(require('path').join(catDir,f),'utf8')));
context.window.PRESALES_DATA.models=catalogModels;
context.window.PRESALES_DATA.refresh=catalogRefresh;

vm.runInContext(fs.readFileSync('app.js','utf8'),context);
assert(rootEl.innerHTML.includes('From discovery to decision.'));
assert(rootEl.innerHTML.includes('NOT READY'));
vm.runInContext("state.sizing.peak=600; state.sizing.growth=30; state.sizing.headroom=25",context);
let size=vm.runInContext('computedSizing()',context);
assert(Math.abs(size.mbps-975)<0.0001);
vm.runInContext("state.bom.push({vendor:'Cisco',sku:'TEST',desc:'demo',type:'Hardware',qty:2,buy:100,sell:180,status:'Nije validirano'})",context);
let totals=vm.runInContext('bomTotals()',context);
assert(totals.cost===200&&totals.sale===360&&Math.round(totals.margin*100)/100===44.44);
let qa=vm.runInContext('qaStatus()',context);
assert(!qa.ready);
vm.runInContext("D.qa.forEach((r,i)=>state.qa[i]={status:'Potvrđeno',owner:'SE',evidence:'demo reference'})",context);
qa=vm.runInContext('qaStatus()',context);
assert(qa.ready);
vm.runInContext("state.qa[0].evidence=''",context);
qa=vm.runInContext('qaStatus()',context);
assert(!qa.ready);
console.log('PASS: boot, dashboard, sizing, BOM, QA evidence controls');

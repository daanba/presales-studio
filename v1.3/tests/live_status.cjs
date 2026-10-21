// Live status tests: event-driven discovery, QA, sizing and persistence.
const fs=require('fs'),vm=require('vm'),assert=require('assert');
const handlers={};const db={};
const elements={main:{innerHTML:''},currentSection:{textContent:''},demoLabel:{textContent:'',classList:{toggle(){}}},resetBtn:{onclick:null},menuToggle:{onclick:null}};
const doc={
 getElementById(k){return elements[k]||null},
 querySelector(q){
   if(q==='#main')return elements.main;
   if(q==='#demoLabel')return elements.demoLabel;
   if(q==='#resetBtn')return elements.resetBtn;
   if(q==='#menuToggle')return elements.menuToggle;
   if(q==='[data-live-discovery]')return elements.liveDiscovery;
   if(q==='[data-live-qa]')return elements.liveQa;
   if(q==='[data-live-qa-notice]')return elements.liveQaNotice;
   if(q==='[data-live-sizing]')return null;
   return {textContent:'',style:{},classList:{remove(){},toggle(){}}};
 },
 querySelectorAll(){return []},
 addEventListener(type,fn){handlers[type]=fn}
};
const ctx={window:{},document:doc,localStorage:{getItem(k){return db[k]||null},setItem(k,v){db[k]=v}},setTimeout(){},clearTimeout(){},URL,Blob,FileReader:function(){},confirm(){return true},console};
vm.createContext(ctx);
vm.runInContext(fs.readFileSync('data.js','utf8'),ctx);
Object.assign(ctx.window.PRESALES_DATA,JSON.parse(fs.readFileSync(require('path').join(__dirname,'..','data/core.json'),'utf8')));
// v1.3: data.js holds core configuration; portfolio and refresh live in separate JSON.
const catDir=require('path').join(__dirname,'..','data');
const catalogModels=['cisco-portfolio.json','fortinet-portfolio.json'].flatMap(f=>JSON.parse(fs.readFileSync(require('path').join(catDir,f),'utf8')));
const catalogRefresh=['cisco-refresh.json','fortinet-refresh.json'].flatMap(f=>JSON.parse(fs.readFileSync(require('path').join(catDir,f),'utf8')));
ctx.window.PRESALES_DATA.models=catalogModels;
ctx.window.PRESALES_DATA.refresh=catalogRefresh;

vm.runInContext(fs.readFileSync('app.js','utf8'),ctx);
assert(handlers.input && handlers.change);
vm.runInContext("view='discovery'; vendor='Cisco'",ctx);
elements.liveDiscovery={innerHTML:''};
function writeDiscovery(field,value){
  handlers.input({target:{id:'',dataset:{discovery:'Cisco',index:'0',field},value}});
}
writeDiscovery('answer','10 sites');
let stats=vm.runInContext("discoveryStats('Cisco')",ctx);
assert.equal(stats.answered,1);assert.equal(stats.verified,0);
writeDiscovery('status','Potvrđeno');
stats=vm.runInContext("discoveryStats('Cisco')",ctx);
assert.equal(stats.confirmed,1);assert.equal(stats.verified,0);
writeDiscovery('evidence','Workshop note 2026-10-21');
stats=vm.runInContext("discoveryStats('Cisco')",ctx);
assert.equal(stats.verified,1);
assert(elements.liveDiscovery.innerHTML.includes('1 /'));
assert(JSON.parse(db['presales-studio-v1.3']).discovery.Cisco[0].answer==='10 sites');
vm.runInContext("view='qa'",ctx);
elements.liveQa={innerHTML:''};
elements.liveQaNotice={innerHTML:'',className:''};
handlers.input({target:{dataset:{qa:'0',field:'status'},value:'Potvrđeno'}});
let qa=vm.runInContext("qaStatus()",ctx);
assert.equal(qa.ok,0);
handlers.input({target:{dataset:{qa:'0',field:'owner'},value:'SE'}});
handlers.input({target:{dataset:{qa:'0',field:'evidence'},value:'Review note'}});
qa=vm.runInContext("qaStatus()",ctx);
assert.equal(qa.ok,1);
assert(elements.liveQa.innerHTML.includes('1'));
console.log('PASS: live discovery + QA counters, proof rule, localStorage persistence');

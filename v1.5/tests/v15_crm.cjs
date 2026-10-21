const assert=require('assert'),fs=require('fs'),vm=require('vm');
const src=fs.readFileSync(require('path').join(__dirname,'../crm.js'),'utf8');
const store={};
const ctx={console,Date,Math,JSON,Set,Array,String,Number,Error,Blob:function(){},URL:{createObjectURL(){return 'blob:'},revokeObjectURL(){}},
 localStorage:{getItem:k=>store[k]||null,setItem:(k,v)=>store[k]=v},
 document:{querySelector(){return {innerHTML:'',textContent:'',style:{display:''}}},addEventListener(){}},
 window:{setTimeout(){},toastTimer:0},setTimeout(){},clearTimeout(){},confirm(){return true},alert(x){throw Error(x)}};
vm.createContext(ctx);
vm.runInContext(src+'\n globalThis.testApi={demo,submitQuote,base,valid,getDB:()=>d,setSection:x=>section=x,setSelected:x=>selectedId=x};',ctx);
ctx.testApi.demo();
const d=ctx.testApi.getDB();
assert.equal(d.companies.length,5);
assert.equal(d.opportunities.length,5);
assert.equal(d.quotes.length,5);
assert.equal(d.quotes.reduce((n,q)=>n+q.revisions.length,0),10);
const serial=JSON.parse(store['presales-studio-v1.5-crm']);
assert.equal(serial.quotes.length,5);
ctx.testApi.demo();
assert.equal(ctx.testApi.getDB().quotes.length,5,'demo must be idempotent');
const first=d.quotes[0],rev0=JSON.stringify(first.revisions);
ctx.testApi.setSelected(first.id);
const form={querySelectorAll(){return [
 {dataset:{field:'subject'},value:'Revidirani predmet'},
 {dataset:{field:'status'},value:'Pregovori'},
 {dataset:{field:'amount'},value:'1200'},
 {dataset:{field:'currency'},value:'BAM'},
 {dataset:{field:'equipment'},value:'2 x firewall'},
 {dataset:{field:'terms'},value:'Demo'},
 {dataset:{field:'reason'},value:'Izmjena količine'}]}};
ctx.testApi.submitQuote(form);
assert.equal(first.revisions.length,3);
assert.equal(first.revisions[2].version,'R03');
assert.equal(JSON.stringify(first.revisions.slice(0,2)),rev0,'older revisions preserved');
console.log('PASS: 5 demo companies, 5 RFQs, 5 quotes, 10 sample revisions, no duplicates, new R03 preserving history');

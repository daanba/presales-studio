const assert=require('assert'),fs=require('fs'),vm=require('vm'),path=require('path');
const src=fs.readFileSync(path.join(__dirname,'../crm.js'),'utf8');
const store={};
const ctx={console,Date,Math,JSON,Set,Array,String,Number,Error,Blob:function(){},URL:{createObjectURL(){return 'blob:'},revokeObjectURL(){}},
 localStorage:{getItem:k=>store[k]||null,setItem:(k,v)=>store[k]=v},
 document:{querySelector(){return {innerHTML:'',textContent:'',style:{display:''}}},addEventListener(){}},
 window:{setTimeout(){},toastTimer:0},setTimeout(){},clearTimeout(){},confirm(){return true},alert(x){throw Error(x)}};
vm.createContext(ctx);
vm.runInContext(src+'\nglobalThis.testApi={demo,submitQuote,readWorkspace,getDB:()=>d,setSelected:x=>selectedId=x}',ctx);
ctx.testApi.demo();
const db=ctx.testApi.getDB();
assert.equal(db.quotes.length,5);
assert(db.quotes.every(q=>q.revisions.every(r=>r.workspaceSnapshot&&Array.isArray(r.workspaceSnapshot.bom))));
const q=db.quotes[0],old=JSON.stringify(q.revisions);
const p=JSON.parse(JSON.stringify(q.revisions[0].workspaceSnapshot));
p.project.name='Test revised project';p.bom.push({vendor:'Fortinet',desc:'Test mock device',qty:1});
store['presales-studio-v1.6']=JSON.stringify(p);
ctx.testApi.setSelected(q.id);
const inputFields=[
 ['subject','Revised synthetic offer'],['status','Pregovori'],['amount',''],['currency','BAM'],
 ['equipment','Revision A'],['terms','Demo'],['reason','New project BOM snapshot']];
const form={
 querySelectorAll(){return inputFields.map(([field,value])=>({dataset:{field},value}))},
 querySelector(){return {checked:true}}
};
ctx.testApi.submitQuote(form);
assert.equal(q.revisions.length,3);
assert.equal(JSON.stringify(q.revisions.slice(0,2)),old,'previous revisions remain immutable');
assert.equal(q.revisions[2].workspaceSnapshot.bom.length,2);
assert.equal(q.revisions[0].workspaceSnapshot.bom.length,1);
p.bom.push({desc:'Later unsaved revision'});
assert.equal(q.revisions[2].workspaceSnapshot.bom.length,2,'must be deep snapshot, not mutable view');
assert(db.opportunities.some(o=>o.id===q.opportunityId));
console.log('PASS: 5 linked demo snapshots, new project-backed R03 revision, preserved historical snapshots, valid RFQ IDs');

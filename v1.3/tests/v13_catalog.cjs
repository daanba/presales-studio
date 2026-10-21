/* =============================================================================
 * PRESALES STUDIO - JSON PORTFOLIO CONTRACT TEST
 * Copyright (C) 2026 DAMIR OMERASEVIC. All rights reserved.
 * Author  : DAMIR OMERASEVIC
 * File    : tests/v13_catalog.cjs
 * Purpose : Verify four canonical JSON datasets and unique product IDs.
 * ============================================================================= */
const fs=require('fs'),path=require('path'),assert=require('assert');
const base=path.join(__dirname,'..','data');
const files=['cisco-portfolio','fortinet-portfolio','cisco-refresh','fortinet-refresh'];
const rows=Object.fromEntries(files.map(f=>[f,JSON.parse(fs.readFileSync(path.join(base,f+'.json'),'utf8'))]));
for(const [file,items] of Object.entries(rows)){
 assert(Array.isArray(items)&&items.length>0,file);
 const vendor=file.startsWith('cisco')?'Cisco':'Fortinet';
 items.forEach((x,i)=>{
  assert.strictEqual(x.vendor,vendor,file+' '+i);
  assert(/^https:\/\//.test(x.source),file+' '+i);
  if(file.endsWith('portfolio')){
   assert(x.id&&x.name&&x.capacityType,file+' '+i);
   ['firewallGbps','ngfwGbps','tlsGbps','ipsGbps'].forEach(k=>{
    assert(x[k]==null||(typeof x[k]==='number'&&x[k]>=0),file+' '+i+' '+k)
   });
  }else assert(x.legacy&&x.target&&x.confidence&&x.checks,file+' '+i);
 });
}
const models=[...rows['cisco-portfolio'],...rows['fortinet-portfolio']];
assert.equal(new Set(models.map(x=>x.id)).size,models.length);
assert(models.length===53,'Expected 53 product references');
console.log('PASS: 4 JSON sources, '+models.length+' models, '+(rows['cisco-refresh'].length+rows['fortinet-refresh'].length)+' refresh references');

const fs=require('fs'),vm=require('vm');
const ctx={window:{},localStorage:{getItem:()=>null,setItem:()=>{}},document:{addEventListener:()=>{},querySelector:()=>({onclick:null,classList:{toggle(){}}}),getElementById:()=>({})},confirm:()=>true,console};
vm.createContext(ctx);vm.runInContext(fs.readFileSync('data.js','utf8'),ctx);
let js=fs.readFileSync('app.js','utf8');js=js.replace(/\nrender\(\);\s*$/,'\n');
vm.runInContext(js,ctx);
const result=vm.runInContext(`(function(){
  state.sizing={peak:600,wan:1000,users:250,growth:30,headroom:25,tls:true,ips:true,ha:true};
  state.bom=[
    {vendor:'Fortinet',type:'Hardware',modelId:'fortinet-fortigate-90g',qty:2,sku:'DEMO'},
    {vendor:'Cisco',type:'Hardware',modelId:'cisco-secure-firewall-1210ce',qty:2,sku:'DEMO'},
    {vendor:'Fortinet',type:'Support',qty:2,sku:'LIC'},
    {vendor:'Fortinet',type:'Hardware',modelId:'fortinet-fortigate-60f',qty:2,traffic:600,sku:'DEMO'}
  ];
  return {base:computedSizing(),rows:state.bom.map(evaluateBom)};
})()`,ctx);
console.log(JSON.stringify(result.rows.map(x=>({status:x.status,model:x.model?.id,formula:x.formula})),null,2));
if(result.base.mbps!==975)throw Error('baseline');
if(result.rows[0].status!=='INSUFFICIENT DATA')throw Error('Forti TLS');
if(result.rows[1].status!=='CONDITIONAL – DOUBLE CHECK')throw Error('Cisco partial');
if(!result.rows[2].status.startsWith('N/A'))throw Error('support');
if(result.rows[3].status!=='FAIL – ISPOD TARGETA')throw Error('fail');
console.log(result.base, result.rows.map(r=>r.status));

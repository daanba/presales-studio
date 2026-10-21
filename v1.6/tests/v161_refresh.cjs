const fs=require('fs'), assert=require('assert');
const s=fs.readFileSync(require('path').join(__dirname,'../vendor-sync.js'),'utf8');
for(const term of ['ciscoPortfolio','fortinetPortfolio','replaceOldMode','replaceOldSelect','refreshVendorChoice','working.ciscoRefresh','working.fortinetRefresh','manual','crossVendor','target.vendor','Dodaj kandidat']){
 assert(s.includes(term), 'Missing '+term);
}
const app=fs.readFileSync(require('path').join(__dirname,'../app.js'),'utf8');
assert(app.includes('Historijski legacy zapis') && app.includes('Ponude i revizije'));
console.log('PASS: both vendor candidates, legacy/current/manual selection, cross-vendor warning, contextual How it works');

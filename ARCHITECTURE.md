<!--
=============================================================================
PRESALES STUDIO | CISCO & FORTINET
Copyright (C) 2026 DAMIR OMERASEVIC. All rights reserved.
Author  : DAMIR OMERASEVIC
Status  : INDEPENDENT INTERVIEW PORTFOLIO DEMO - NOT OFFICIAL COMTRADE
Reviewed: 2026-10-21
=============================================================================
-->
# ARCHITECTURE & SAFETY

## Model aplikacije
- `index.html`: statički SPA okvir.
- `styles.css`: responzivni UI dizajn.
- `data.js`: snapshot referentnih pitanja, portfolija, migracijskih kandidata i QA kontrola.
- `app.js`: rukovanje stanjem, pogledima, lokalnim čuvanjem i izvozom.
- GitHub Pages: hosting statičkih fajlova kroz Actions.

## Data flow
Korisnik → `app.js` state → `localStorage` (samo lokalni browser). Izvoz preko `Blob` i `URL.createObjectURL`, uvoz preko `FileReader`. Nema servera.

## Kontrole
- Render korisničkih polja kroz HTML escaping (`esc()`) za prikaz.
- Nema `eval`, analitike, CDN dependencija, backend logina ili secret ključeva.
- JSON import: oblik/schema i ograničenje veličine (3 MB); **nije enterprise-grade validator**.
- QA zatvaranje vodi samo do **REVIEW**, ne do automatskog Approved.
- Refresh liste nemaju API verifikaciju: svaki slučaj mora ići na manualni vendor SE pregled.

## Bezbednosna granica
LocalStorage nije sigurna baza niti šifrovani storage. Ne koristiti za stvarne osjetljive projekte, korisničke konfiguracije, lozinke, finansijske rabate ili komercijalne tajne. Ako bi aplikacija postala proizvod, potrebni su authentication, RBAC, audit logs, encryption, privacy review, input schema validation, backend, versioned product master data i controlled vendor price integration.

## Lifecycle izvora
Snapshot na dan 21.10.2026.; u aplikaciji su linkovi na službenu Cisco/Fortinet dokumentaciju. Pre svake stvarne ponude nužna je potvrda aktuelnosti.

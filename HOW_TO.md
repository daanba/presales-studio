<!--
=============================================================================
PRESALES STUDIO | CISCO & FORTINET
Copyright (C) 2026 DAMIR OMERASEVIC. All rights reserved.
Author  : DAMIR OMERASEVIC
Status  : INDEPENDENT INTERVIEW PORTFOLIO DEMO - NOT OFFICIAL COMTRADE
Reviewed: 2026-10-21
=============================================================================
-->
# HOW-TO — Presales Studio za demonstraciju

**Revizija:** 2026-10-21 | **Autor:** DAMIR OMERASEVIC | **Jezik:** bosanski

## A. Priprema demo intervjua — 3 minute prije razgovora

- Otvori lokalni `index.html` ili objavljeni GitHub Pages URL.
- Provjeri da je browser u normalnom 100% zoomu i da radi desktop prikaz.
- Klikni **▶ Učitaj DEMO** i potvrdi učitavanje **SINTETIČKIH** podataka.
- Ne mijenjaj oznaku „SIMULIRANI DEMO PODACI“ tako da izgleda kao stvarni projekat.
- Na razgovoru koristi neutralnu rečenicu „nezavisni showcase pripremljen za presales scenario“.

## B. HR prezentacija — 30 do 45 sekundi

> „Kako bih pokazao kako razmišljam o presales procesu, razvio sam web alat za prikupljanje zahtjeva i pripremu tehničke ponude. Cilj nije da automatski izbacuje uređaj ili mijenja stručnjaka, nego da sistematski poveže discovery, sizing, upgrade opcije, BOM i kontrolu odobrenja. Ovo su isključivo demo podaci.“

## C. Tehnički walkthrough — 2 do 4 minute

### 1. Pregled projekta

Unesi naziv, kupca, owner i valutu. Prati Cisco/Fortinet discovery napredak, broj BOM stavki i QA status.

### 2. Discovery

Izaberi **Cisco** ili **Fortinet** i popunjavaj odgovore po pitanjima. Kolone:

| Polje | Značenje |
|---|---|
| Oblast | Mreža, sigurnost, performanse, migracija itd. |
| Pitanje | Ulazni zahtjev, tehničko ograničenje ili poslovni kontekst |
| Odgovor | Ono što kupac potvrdi |
| Status | Otvoreno / Potvrđeno / Nije primjenjivo / Blokirano |
| Dokaz | Izvor mjerenja, specifikacija ili odobrenja |

**Za intervju:** pokaži da napredak nastaje tek kad je status zatvoren, ne samo kad postoji tekst.

### 3. Capacity sizing

Postavi `peak = 600 Mbps`, `growth = 30%`, `headroom = 25%`.

```text
Indicative target = 600 × (1 + 0.30) × (1 + 0.25)
                  = 975 Mbps
                  = 0.975 Gbps
```

Ako je HA uključen, alat prikazuje **2 uređaja kao pojednostavljeni active-passive koncept**.

**Ključna rečenica:** „Ovo je početna kapacitetna pretpostavka, ne preporuka SKU-a. Bez znanja o IPS, TLS inspekciji, aplikacijama i broju sesija ne mogu braniti izbor tačnog modela.“

### 4. Portfolio

Filtriraj Cisco ili Fortinet. Prikaži korisne porodice i polje „Validacija prije ponude“ te **link na izvor**. Nije obećana aktualna cijena ili raspoloživost.

### 5. Technology refresh

Pokaži da su Cisco prelazi na nivou porodica (npr. 2960-X → 9200, 3850 → 9300) i da se Fortinet zamjene označavaju kao **UNVERIFIED CANDIDATE**.

**Ključna rečenica:** „Ovdje namjerno ne dopuštam da kandidat za refresh izgleda kao garantovana zamjena.“

### 6. BOM & Commercial

Pokaži izmišljene `DEMO-*` stavke, promijeni količinu ili cijenu i pokaži preračunavanje. **Ne tumači demo cijene kao Comtradeove**. U stvarnom radu SKU i rabate potvrđuje nabavka.

### 7. Quality gate

U tabeli su zahtjevi za discovery, arhitekturu, sigurnost, vendor SE, licence, lifecycle, migraciju i komercijalno odobrenje.

- `NOT READY`: barem jedan status je otvoren ili blokiran.
- `REVIEW`: svi statusi su zatvoreni, ali još treba **ljudsko i formalno odobrenje**.

Aplikacija nikad ne tvrdi „Approved“.

## D. Tipična pitanja tehničkog intervjuera

**P: Odakle modeli i podaci?**  
O: „Iz javnih službenih vendor izvora evidentiranih u aplikaciji. Nema live integracije, zato se pred RFQ provjerava tačan SKU, lifecycle i aktuelni datasheet.“

**P: Da li alat garantuje da će FortiGate model ispuniti zahtjev?**  
O: „Ne. Formula je indikativni zahtjev za kapacitet. Konačni izbor zavisi od security benchmarka, TLS inspection, sesija, portova, HA i potvrde vendor SE.“

**P: Šta biste napravili naredno u kompaniji?**  
O: „Uveo bih autentikaciju i RBAC, server-side audit trail, pristup službenom ERP/cjenovniku i vendor API-ju uz odobrenja, generisanje kupčeve ponude i integraciju s CRM/ticketing procesima.“

**P: Zašto bez Reacta ili backenda?**  
O: „Za intervju sam birao rješenje koje se brzo i pouzdano pokreće, bez instalacije i bez iznošenja podataka na server. Za stvarni proizvod prvo bismo definisali korisnike, prava pristupa, čuvanje podataka, izvore cijena i integracije.“

## E. Prijenos projekta

Izaberi **Sačuvaj JSON**, pohrani fajl na disk. Na drugom uređaju otvori aplikaciju i **Uvezi JSON**. Discovery, sizing, BOM i QA podaci se prenose. CSV izvoz je dostupan za Discovery, BOM i QA.

> JSON i CSV nisu šifrovani; ne postavljati ih na javni GitHub.

## F. Deployment — GitHub Pages

Detaljna uputstva su u [README.md](README.md). Workflow `/.github/workflows/deploy.yml` se pokreće na push na `main`. U GitHub repozitoriju obavezno izaberi **Settings → Pages → Source: GitHub Actions**.

## G. Ograničenja i etika prezentacije

Ovo je **samostalni portfolio projekat**, ne službeni Comtrade sistem. Svi demo podaci su sintetički. Ne tvrditi da su Cisco/Fortinet potvrdili mape zamjene, da je postavljen vendor API ili da je proizvoda moguće kupiti po prikazanim demo cijenama.


## Statusi i automatsko ažuriranje (v1.1)

1. Otvori **Discovery** i izaberi Cisco ili Fortinet.
2. Upiši **Odgovor kupca** - brojač *odgovoreno* mijenja se odmah.
3. Postavi status **Potvrđeno** - brojač *potvrđeno* mijenja se odmah.
4. Upiši **Dokaz / napomena** - tek tada red ulazi u *verifikovano* i raste procenat.
5. Za **Nije primjenjivo** upiši razlog/obrazloženje u dokaz. Bez obrazloženja se
   stavka ne smatra verifikovanom.
6. Otvori **Pregled projekta**. Obje Discovery KPI kartice prikazuju upravo sačuvane
   rezultate; nije potrebno ručno snimanje.
7. U **QA Gate** status „Potvrđeno“ je dovoljan samo uz popunjene polja
   **Owner** i **Dokaz**. KPI brojači se automatski osvježavaju.
8. U **Capacity Sizing** unosi trenutnog peak prometa i pretpostavki odmah
   osvježavaju Mbps/Gbps/HA prikaz; u **BOM** cijene i količine odmah osvježavaju
   sumarne finansijske pokazatelje.
9. Sve izmjene se automatski spremaju u **localStorage** aktivnog browsera.
   Za prijenos na drugo računalo koristi **Sačuvaj JSON / Uvezi JSON**.

**NAPOMENA:** status „REVIEW“ znači da su sve QA stavke dokumentovane,
ali **ne predstavlja formalno tehničko ili komercijalno odobrenje ponude**.

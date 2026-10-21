<!--
# =============================================================================
# PRESALES STUDIO v1.4 - USER GUIDE
# Copyright (C) 2026 DAMIR OMERASEVIC. All rights reserved.
# =============================================================================
-->

# Kako koristiti v1.4

## 1. Sačuvaj postojeće verzije
Koristi **kompletni paket s četiri verzije** iz ZIP-a. Sadržaj ZIP-a kopiraj u root GitHub repozitorija, bez dodatnog foldera. Ne briši stare `index.html`, `app.js` ili foldere `v1.2` i `v1.3`. Novi kod nalazi se isključivo u `v1.4/`.

## 2. Otvori administraciju
`/v1.4/admin.html`. Stari katalog učitava se iz `v1.4/data/`. Klik na „Cisco – službeni katalog” i „Fortinet – službeni katalog” otvara zvanične web-stranice proizvođača.

## 3. Uvezi prijedlog kataloga
Odaberi proizvođača i klikni `JSON predložak`. Unesi potvrđene podatke u kopiju šablona. `id` mora biti stabilan identifikator modela, a `source` HTTPS link na relevantan datasheet/stranicu. Ako ne znaš performanse, koristi `null`, ne 0 i ne nagađaj.

Odaberi JSON datoteku ili unesi **kompatibilnu HTTPS JSON URL** adresu s CORS podrškom i klikni „Povuci JSON”.

Prikazat će se usporedba modela: NOVO, KONFLIKT ili IDENTIČNO; kod konflikta prikazat će se lista promijenjenih polja. Podrazumijevana radnja je „Preskoči”. Svaki model odaberi zasebno:
- `Dodaj` — novi model, ID još ne postoji.
- `Popuni samo prazna polja` — postojeće provjerene informacije ostaju netaknute.
- `Zamijeni cijeli zapis` — eksplicitna, rizičnija radnja; provjeri vendor datasheet i promjene.
- `Preskoči` — bez izmjene.

Klikni „Primijeni odabrane promjene u editor” → „Validiraj & snimi lokalno” → „Izvezi trenutni JSON” i tek onda odgovarajući datoteku zamijeni na GitHubu u `v1.4/data/`.

**Ne postoji potpuno automatsko povlačenje zvaničnog Cisco/Fortinet kataloga u normalizovanom obliku.** Kod proizvođača može biti PDF/HTML, CORS ograničenja, promjenjivi format i zahtjevi autorizacije.

## 4. Predloži refresh/zamjenu uređaja
U `admin.html` odaberi vendor, unesi naziv starog modela, pa izaberi noviji iz katalog liste. Klikni „Predloži refresh”. Provjeri podsjetnik na portove, kapacitet, licence, firmware, HA, VPN, opseg i rollback. Zatim klikni „Dodaj kandidat u Refresh editor”. Ručno provjeri, snimi i izvezi `cisco-refresh.json` / `fortinet-refresh.json`.

Kandidat **nije** proizvođački odobrena 1:1 zamjena. Dodatni double check s vendor SE je obavezan.

## 5. Kreiraj firmu i RFQ
Otvori `/v1.4/crm.html` → „Kompanije” → „Nova kompanija”; unesi izmišljenu firmu za probu. Potom „RFQ / Ponude / Narudžbe” → „Novi RFQ / Projekat”; izaberi firmu, navedu tražene uređaje, količine, proizvođača i status. Mijenjaj status od „Lead”, „Ponuda u pripremi”, „Ponuda poslana” do „Narudžba potvrđena” ili „Izgubljeno”. Dodaj aktivnost („Zahtjev kupca”, „Ponuda poslana”, „Narudžba zaprimljena” itd.). Pregledaj vremensku historiju.

## 6. Kreiraj upitnik
„Upitnici” → „Novi upitnik”; napiši naziv i pitanja, po jedno u redu. „Popunjeni upitnici” → „Novo popunjavanje”; poveži ga s RFQ-om, odaberi predložak, unesi odgovore (red po pitanju), dokaze i status. Snapshot pitanja sačuvan je uz popunjavanje.

## 7. Demonstracija
Klikni „▶ DEMO podaci” u CRM-u; kreira se izmišljena firma `DEMO – Adriatic Retail d.o.o.`, projekat `Branch Secure Connect 2026`, primjer RFQ-a, popunjeni upitnik i aktivnosti. U drugom tabu otvori v1.4 Dashboard i demonstriraj sizing kao u v1.2/v1.3. CRM i tehnički projekat nisu automatski sinkronizovani — veza je opisna, bez automatskog sinhronizovanja BOM stavki u narudžbe.

## 8. Backup i oprez
CRM **Backup JSON** može sadržavati sve što si unio. Čuvaj ga lokalno i zaštićeno. `Restore` zamjenjuje lokalnu bazu poslije potvrde. Rad u drugom browseru ili na drugom računaru ne dijeli podatke automatski. Brisanje browser podataka briše lokalni projekat, osim ako je izvezen backup.

`actor` je samo ručno upisana oznaka, ne dokaz identiteta; nije prava višekorisnička historija. Ovaj demo ne koristiti s pravim poslovnim ili ličnim podacima.

## v1.6 – evidencija verzija ponuda
1. Otvori `v1.6/crm.html` i klikni `▶ DEMO podaci` (dodaje 5 sintetičkih firmi/RFQ/ponuda).
2. Odaberi karticu **Ponude i revizije** i klikni npr. `DEMO-Q-002`.
3. Pregledaj verzije `R01`, `R02`, `R03` i promjene u opremi/uslovima.
4. Promijeni status ili specifikaciju, obavezno upiši **razlog izmjene** i klikni **Snimi novu reviziju**.
5. Historija prethodnih verzija ostaje; nova verzija dobija sljedeću oznaku.
6. Klikni **Backup JSON (sve)**. Za vraćanje koristi **Vrati backup**.
**Ograničenje:** Datumi/autor su informativni, bez autentifikacije i zaštite od naknadnog uređivanja localStorage/JSON.


## v1.6 – Project and offer linkage walkthrough

1. Open `./crm.html`; if starting fresh, select **▶ DEMO podaci** to add five *synthetic* companies, RFQs and quotes. Never add real customer data to this static demo.
2. Select **RFQ / Ponude / Narudžbe** and choose a case. Its lower panel lists associated quote(s) with shortcuts.
3. Select **Ponude i revizije**, choose the relevant quote, then expand any R01/R02/R03 revision.
4. Click **↗ Otvori ovu reviziju u Pregledu projekta**. Confirm replacing the *live* project; any previous workspace should be exported first. The selected revision is NOT modified.
5. In Dashboard observe **Povezivanje projekta i CRM ponude** and review linked RFQ/reference.
6. Modify the current BOM/sizing/discovery/QA data as needed, then click **↗ Sačuvaj kao novu reviziju u CRM-u**.
7. Confirm the quote, enter meaningful reason, review whether **Priloži snapshot aktivnog v1.6 projekta** is checked; click **Snimi novu reviziju**.
8. Return to historical revisions: the former snapshot is unchanged and the newly created revision has its own updated project snapshot.
9. Export BOTH **project JSON** and **CRM backup JSON** to preserve the full local demo.

### Important boundary

A v1.5 quote revision **without** `workspaceSnapshot` cannot magically be reconstructed from its equipment text. Opening such a legacy quote generates a clearly labelled, unfinished project with empty BOM and sizing; fill it manually, validate and create the first complete v1.6 snapshot. Newly seeded v1.6 DEMO cases *do* include synthetic snapshots, still marked unvalidated.

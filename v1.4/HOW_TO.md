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

<!--
# =============================================================================
# PRESALES STUDIO v1.6 – UPDATED WORKFLOW & GUIDED TECHNOLOGY REFRESH
# Copyright (C) 2026 DAMIR OMERASEVIC. All rights reserved.
# Reviewed: 2026-10-21
# Status: Independent demonstration, not a vendor certified configurator.
# =============================================================================
-->

# HOW TO — Presales Studio v1.6 (Refresh patch)

## 1. Lokalno pokretanje
JSON katalog zahtijeva HTTP(S). Iz korijena repozitorija pokreni `python3 -m http.server 8000`, pa otvori `http://localhost:8000/v1.6/`. Direktni `file://` može blokirati učitavanje JSON-a.

## 2. DEMO i aktivni projekat
Na Dashboardu prvo izvezi projekt JSON ako želiš sačuvati promjene, a zatim klikni `Učitaj DEMO`. Na `crm.html` odvojeno učitaj CRM DEMO: kompanije, RFQ, ponude, revizije i historiju aktivnosti. CRM DEMO i projekat nisu proizvodna baza, niti se automatski sinhronizuju na GitHub.

Poveži aktivni projekt s izabranim RFQ/ponudom i snimi snapshot u odgovarajuću reviziju ponude. Otvaranje stare revizije može zamijeniti aktivni radni projekat; prvo sačuvaj JSON.

## 3. Guided Technology Refresh (ispravljeno)
Otvori **Portfolio Administration → Guided Technology Refresh**.

**Proizvođač kandidata:** `Cisco + Fortinet` (oba), `Cisco` ili `Fortinet`. Ovo je odvojeno od `Proizvođača` za uvoz kataloga.

**Stara oprema** (tri načina):
1. **Historijski refresh / legacy zapis** — popis starih modela iz oba `cisco-refresh.json` i `fortinet-refresh.json`.
2. **Postojeći model u portfoliju** — bilo koji trenutno evidentirani model iz Cisco ili Fortinet portfolija, ako je stvarno instaliran kod kupca.
3. **Ručno — nije u katalogu** — slobodan unos naziva i, po mogućnosti, precizne oznake starog SKU-a. To je *ispravan izbor za model koji nije prisutan u katalogu*.

**Novi model / kandidat:** odaberi iz oba portfolija ili filtriraj po proizvođaču. Uređaji nisu automatske 1:1 zamjene. Cisco → Fortinet i Fortinet → Cisco zahtijevaju dodatnu provjeru kompatibilnosti i migracije.

**Predloži refresh:** prikazuje kandidat smjernice. Provjeri:
- Interfejse, SFP/transceiver/module, VLAN/routing, VPN, PoE i HA gdje je relevantno.
- Uređajsku funkcionalnost i performanse s uključenim NGFW/IPS i TLS profilom — ne sabirati zasebne benchmarkove.
- Broj uređaja, transakcija/sesija, datacentar i branch scenarije te failover performanse.
- Licenciranje, podršku, EoL/EoS, dostupnost, instalaciju, migraciju konfiguracije i rollback.
- Validaciju od Cisco/Fortinet Vendor SE ili Solution Architect prije finalne ponude.

Klikni **Dodaj kandidat u Refresh editor** (zapis ide u refresh grupu **ciljnog proizvođača**). Zatim **Validiraj & snimi lokalno** i **Izvezi JSON**. Tek commitovanjem odgovarajućeg `v1.6/data/<vendor>-refresh.json` u GitHub možeš javno distribuirati promjene.

**Važno:** Legacy drop-down je popis evidencije i kandidata iz historijskih zapisa, **ne dokaz da kupac trenutno posjeduje taj uređaj**. Stvarno stanje se mora dokumentovati u Discovery/RFQ.

## 4. Portfolio data merge
Službena vendor web-stranica nije garancija mašinski čitljivog JSON API-ja. Uvezi JSON lokalno ili preko kompatibilne HTTPS+CORS adrese, pogledaj NOVO/KONFLIKT/IDENTIČNO i odaberi Preskoči / Popuni prazno / Zamijeni cijeli zapis. Validiraj i izvezi prije GitHub commita. Nepoznate performanse = `null`, ne procjena.

## 5. Discovery → BOM → Capacity → QA
Odgovori i dokazi u Discovery služe za potvrdu zahtjeva. Sizing: `Peak Mbps × (1 + growth %) × (1 + headroom %)`. BOM može imati posebni peak po lokaciji, količine i TCO scope. NGFW/TLS/HA checkboxi određuju potrebne vrste benchmarka, ali ne potvrđuju kombinovane performanse; active-passive HA ne duplira efektivni protok. QA razlikuje Potvrđeno i Verifikovano, a finalno odobrenje ostaje ljudska odgovornost.

## 6. Ponude i revizije
U CRM-u je moguće više ponuda i R01/R02/R03… revizija s razlogom izmjene. U v1.6 postoji povezivanje aktivnog radnog projekta i snapshot-a s revizijom. Staru reviziju bez snapshot-a nemoj prikazivati kao dokumentovanu konfiguraciju; ostaje nepotpuna. Izvezi redovan JSON backup i zabilježi ko je promjenu unio (ručno, nije autentifikovan audit log).

## 7. Ograničenja
Javni GitHub Pages i localStorage nisu odobreni CRM za stvarne poslovne tajne. Ne unositi stvarna imena kupaca, mrežne podatke, cijene, ugovore ili lozinke. Ne postoje live cijene, zalihe ili službeno vendor odobrenje. Statusi refresh su isključivo prijedlozi za stručnu verifikaciju.

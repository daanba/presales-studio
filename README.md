<!--
=============================================================================
PRESALES STUDIO | CISCO & FORTINET
Copyright (C) 2026 DAMIR OMERASEVIC. All rights reserved.
Author  : DAMIR OMERASEVIC
Status  : INDEPENDENT INTERVIEW PORTFOLIO DEMO - NOT OFFICIAL COMTRADE
Reviewed: 2026-10-21
=============================================================================
-->
# Presales Studio — Cisco & Fortinet

**Web aplikacija za demonstraciju na intervjuu za poziciju Presales Engineer – Networking & Cybersecurity.**

> **Status:** Samostalni portfolio projekat koji je izradio **DAMIR OMERASEVIC**. Nije službeni proizvod kompanija Comtrade Distribution, Cisco ili Fortinet; njihovi nazivi su vlasništvo odgovarajućih vlasnika. Ovdje nema odobrenja, pristupa cjenovniku ili vezi sa stvarnim distributerskim sistemima.

## Live demo — preporučeno za HR i tehnički intervju

Otvoriti `index.html` ili GitHub Pages adresu, kliknuti **▶ Učitaj DEMO**, a zatim pokazati:

1. **Pregled projekta:** proces i KPI upitnika.
2. **Discovery:** potvrđena pitanja i otvorene stavke s dokazima.
3. **Sizing:** 600 Mbps peak × 30% rast × 25% rezerva = **975 Mbps** indikativnog cilja. Ne zamjenjuje NGFW / IPS / TLS inspekcijski benchmark.
4. **Refresh:** Cisco dokumentovani smjerovi zamjene porodica, Fortinet isključivo nevalidirani kandidati.
5. **BOM:** u demonstraciji su izmišljene cijene i SKU-ovi eksplicitno označeni `DEMO-...`; računaju se ukupne vrijednosti i gruba marža.
6. **QA Gate:** `NOT READY` dok su kontrole otvorene; čak i kada su zatvorene, status je **REVIEW**, nikada automatsko odobrenje.

**Predložena poruka intervjueru:**

> „Nisam htio napraviti samo statičnu tabelu; napravio sam radni presales tok koji povezuje zahtjeve, kapacitet, vendor portfolio, migraciju i kontrolu ponude. Ono što mi je jednako važno kao funkcionalnost jeste da alat nikada automatski ne proglasi nepouzdanu zamjenu opreme ili nepotvrđen SKU odobrenim.“

## Tehnologija

- Vanilla **HTML5, CSS3 i JavaScript**; bez frameworks, build procesa i biblioteka.
- **GitHub Pages** static hosting (repo workflow uključen).
- **localStorage**: automatsko lokalno čuvanje projekta u pregledniku.
- **JSON** import/export projekta.
- **CSV** export Discovery, BOM i QA.
- Responsive dizajn, browser print view, tastaturna navigacija i osnovni accessibility atributi.
- Bez backenda, korisničkih računa, API poziva, trackinga, kolačića analitike i mrežnog slanja unesenih podataka.
- Linkovi prema javnim, službenim izvorima proizvođača. Popis i primjeri nisu automatski sinhronizovani s katalogom.

## Struktura repozitorija

```text
Comtrade_Presales_Web_App/
├── index.html                 # SPA shell
├── styles.css                 # UX i responsive stilovi
├── data.js                    # discovery, portfolio, refresh i QA referentni podaci
├── app.js                     # poslovna logika, UI, localStorage i import/export
├── README.md                  # ovaj dokument
├── HOW_TO.md                  # korisnički vodič
├── ARCHITECTURE.md            # arhitektura, sigurnost i poznata ograničenja
├── .nojekyll                  # GitHub Pages
└── .github/
    └── workflows/
        └── deploy.yml        # automatska GitHub Pages objava
```

## Pokretanje lokalno

Nije potrebna instalacija ni `npm install`:

```bash
# Opcija 1: dvostruki klik na index.html
# Opcija 2: lokalni razvojni server:
python3 -m http.server 8000
# zatim otvori http://localhost:8000/
```

## GitHub — objava aplikacije (bez automatskog pristupa nalogu)

1. Napravi **novi GitHub repozitorij** npr. `presales-studio`; izaberi Public samo ako želiš da aplikacija bude vidljiva svima.
2. Raspakuj ZIP i prebaci **sadržaj** ovog direktorija u root repozitorija (uključujući `.github/workflows/deploy.yml`).
3. Otvori **Settings → Pages → Build and deployment → Source: GitHub Actions**.
4. Push/commit na granu `main` pokreće workflow `Deploy static Presales Studio to GitHub Pages`.
5. Pričekaj da Actions job završi; stranica će obično biti na `https://USERNAME.github.io/REPO/`.
6. Ako je privatni repo, provjeri GitHub plan i Pages podršku. **GitHub Pages stranica može biti javna čak i kada pristup kodu nije javan.**
7. Za demo otvori Pages adresu i klikni `▶ Učitaj DEMO`.

**Git kroz komandnu liniju:**

```bash
git init
git add .
git commit -m "Initial independent Cisco and Fortinet presales demo"
git branch -M main
git remote add origin https://github.com/USERNAME/presales-studio.git
git push -u origin main
```

## Brzi funkcionalni test

Ako imaš Node.js, pokreni:

```bash
node --check app.js
node --check data.js
node tests/smoke.cjs
```

Smoke test provjerava inicijalni prikaz, sizing proračun, BOM i uslov da QA nema automatsko odobrenje bez dokaza. Ne zamjenjuje browser UI testiranje.

## Ograničenja — pošten presales standard

- Nema real-time inventara, vendor konfiguratortora, tender kataloga ili zaliha.
- Nema stvarnih SKU-ova u DEMO BOM-u; izmišljene cijene se ne smiju tretirati kao tržišne.
- Cisco mapiranje je porodica / smjer, ne tačna automatska ekvivalentnost starog i novog SKU-a.
- Fortinet zamjene su **kandidati za provjeru**, ne zvanična 1:1 mapa.
- Sizing formula samo prilagođava peak za rast i rezervu; throughput se mora provjeriti protiv istog profila vendor datasheeta.
- Ne postoji server-side autentikacija, autorizacija ili šifrovana baza: **ne unositi povjerljive klijentske konfiguracije, IP planove, komercijalne cijene, pristupne podatke i privatne ključeve u javni demo.**
- localStorage vrijedi za konkretan browser i domen; brisanje lokalnih podataka briše sačuvani projekat, osim ako je prethodno izvezen JSON.

## Reference

Službeni vendor URL-ovi su dostupni u aplikaciji: **How it works → Zvanične reference**, uz odgovarajuće portfolio i refresh redove.

## Autorska prava

© 2026 **DAMIR OMERASEVIC**. Sva prava zadržana. Nije dodana open-source licenca. Objavljivanje koda na GitHubu **ne** znači automatski pravo trećim stranama na komercijalnu redistribuciju. Brendovi Comtrade, Cisco i Fortinet su vlasništvo svojih nosilaca.


## v1.1 - Live status synchronization (21 October 2026)

The dashboard displays calculated state, not manually set counters. Discovery and QA
figures now update without requiring a page reload or leaving the active screen.

- **Answered**: non-empty answer.
- **Confirmed**: a selected `Potvrđeno` status (declared confirmation).
- **Verified**: `Potvrđeno` + non-empty answer + non-empty evidence, or
  `Nije primjenjivo` + non-empty justification/evidence.
- **Completion percentage**: verified records divided by all discovery questions.
- **QA confirmed**: `Potvrđeno` / `Nije primjenjivo` + non-empty owner + evidence.
- **QA REVIEW**: all QA items meet documented confirmation criteria; still not
  a formal approval to submit an offer.

State is stored locally in the same `presales-studio-v1` localStorage key and persists
across GitHub Pages updates in the same browser/profile/domain. JSON export is recommended
before upgrades or loading a different demo project.

### Upgrade from GitHub Pages v1.0
Upload/replace `app.js`, `index.html`, `README.md`, `HOW_TO.md`, and
`tests/smoke.cjs` on branch `main`. Preserve `.github/workflows/deploy.yml` in the
`.github/workflows/` directory. Wait for a green Pages workflow run, then hard-refresh
your browser (Cmd+Shift+R on macOS or Ctrl+Shift+R on Windows).

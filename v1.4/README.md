<!--
# =============================================================================
# PRESALES STUDIO - v1.4 CATALOG CONTROL & PRESALES HISTORY
# Copyright (C) 2026 DAMIR OMERASEVIC. All rights reserved.
# Author : DAMIR OMERASEVIC
# File : README.md
# Version : 1.4
# Status : INDEPENDENT PORTFOLIO DEMO (NOT PRODUCTION CRM)
# =============================================================================
-->

# Presales Studio v1.4 — Catalog Control & Presales History

Standalone v1.4 alongside v1.1 (repository root), v1.2 (`/v1.2/`) and v1.3 (`/v1.3/`). **v1.4 does not overwrite earlier releases**.

## Start

`https://daanba.github.io/presales-studio/v1.4/`

- App: `index.html` — prior discovery, sizing, product portfolio, refresh, BOM/TCO and QA gate.
- Catalog editor: `admin.html` — manual Cisco/Fortinet portfolio and refresh editing, new controlled merge/import tools.
- Presales history / CRM: `crm.html` — companies, RFQ opportunities, quotations, requested/ordered equipment, activities, configurable questionnaires and responses.

**First load requires an HTTP(S) server.** For offline local test run `python3 -m http.server 8000` at repo root and browse `http://localhost:8000/v1.4/`; do not open `file://.../index.html` because catalog fetching is blocked in many browsers.

## Cisco and Fortinet catalog refresh

At `admin.html` choose vendor, then:
1. `Cisco – službeni katalog` / `Fortinet – službeni katalog` opens the official manufacturer's product page.
2. `JSON predložak` downloads the accepted schema. Transfer only *verified* vendor document information into the template; unknown numeric performance values remain `null`.
3. Choose the completed `.json` file in the **Datoteka** picker **or** enter an HTTPS URL exposing a **normalised JSON feed that explicitly permits CORS** and click **Povuci JSON**.
4. The app compares by **stable `id`** and previews NEW / IDENTICAL / CONFLICT, with changed fields listed. Default per-row decision is **Preskoči**. For each item explicitly select **Dodaj**, **Popuni samo prazna polja**, or **Zamijeni cijeli zapis**, then click **Primijeni odabrane promjene u editor**.
5. Click **Validiraj & snimi lokalno**, then **Izvezi JSON** and commit the downloaded file into `v1.4/data/` for public deployment. Import by itself does **not** modify public GitHub content.

**Important technical limitation:** Cisco and Fortinet public web catalogues are not guaranteed to expose a stable public, compatible, browser-CORS-enabled machine-readable catalogue API. The official-link buttons **open vendor catalogues**, not secretly scrape them. `Povuci JSON` only fetches user-specified compatible HTTPS JSON endpoints. PDFs and HTML pages are **not parsed automatically**. Authentication, SKU mapping, wholesale stock and pricing are not supplied.

### Guided refresh suggestions

The `Guided Technology Refresh` panel asks for the old device and a proposed new catalogue model, then displays mandatory migration checks: ports/interfaces, throughput under combined NGFW/TLS load, HA, routing/VPN, firmware, subscriptions, EOS/EOL, configuration migration and rollback. Click **Dodaj kandidat u Refresh editor** to append a **candidate** mapping. It is **never** treated as an approved 1:1 replacement. A Vendor SE / Solution Architect must validate the proposal.

## CRM / full presales case history

At `crm.html`:
- **Kompanije**: create/edit synthetic customer name, sector, region and reference contact.
- **RFQ / Ponude / Narudžbe**: link a company to a project; record requests, quote reference/date, customer equipment requirements and quantities, order date, commercial stage, outcome and next steps.
- **Historija aktivnosti**: append date, claimed actor, event type, project and notes. Search by company/project/person/equipment.
- **Upitnici**: create/change a question template (one line per question).
- **Popunjeni upitnici**: link questionnaires and saved question snapshots to an RFQ/project; record answers, evidence and verification state.
- **Backup JSON / Restore JSON**: saves/restores *all local CRM records* as a single file. Restore **replaces** the local CRM database after confirmation; export a backup first.
- **DEMO podaci**: adds an explicitly fictional firm, RFQ, questionnaire and activity trail, keeping existing records.

Changes are immediately stored in browser `localStorage` under `presales-studio-v1.4-crm`. Earlier projects live in their **own keys**. `actor` is manually entered, not authenticated; local history can be edited by a browser user. This is not reliable, compliant, multi-user audit history.

**Do not enter actual customer identities, personal contact details, customer infrastructure, credentials, tenders, contracts, prices, orders or regulated data in this GitHub Pages demo.** Real CRM requires server-side authenticated users, permissions, event logging, central encrypted storage, backups, retention/GDPR controls and an approved information-security architecture.

## Existing v1.3 features retained

- Manufacturer-sourced model reference data for 53 products/families in release dataset and 12 refresh references.
- Dynamic BOM-line sizing and formula transparency; NGFW/IPS, TLS and HA checks.
- Missing vendor metrics remain `null`; only provisional sizing statuses, no automatic engineering certification.
- Discovery questionnaires, BOM/TCO, QA and JSON project export remain separate from CRM records.
- Local catalog drafts and local projects deliberately use **v1.4-specific storage keys**.

## Source of truth and required double-check

Public manufacturer datasheet/source links are kept on each model. Measurements published separately for TLS, NGFW, IPS or firewall throughput are not equivalent to simultaneous-service validation. Check exact orderable SKU, interface requirements, licensing, lifecycle, availability, test methodology, operating conditions and HA/failover sizing before presenting a real quotation.

Manufacturer product directories:
- Cisco: https://www.cisco.com/c/en/us/products/index.html
- Fortinet: https://www.fortinet.com/products

## Technical files

`catalog-loader.js`: loads four canonical product/refresh JSON files and `core.json`.
`admin.js`: local catalogue record editor.
`vendor-sync.js`: manufacturer links, compatible JSON pull/import, preview and per-record merge, guided refresh candidate creation.
`crm.js`: browser-only customer/RFQ/history/questionnaire subsystem.
`data/`: curated baseline technical reference records.
`tests/`: regression tests inherited from v1.3; test newly developed UI interactions manually after deployment.

This release was developed for **DAMIR OMERASEVIC**, 21 October 2026. Not affiliated with or approved by Comtrade Distribution, Cisco or Fortinet.

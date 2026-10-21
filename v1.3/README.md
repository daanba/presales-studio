<!--
# =============================================================================
# PRESALES STUDIO – CISCO & FORTINET
# Copyright (C) 2026 DAMIR OMERASEVIC. All rights reserved.
# Author  : DAMIR OMERASEVIC
# File    : README.md
# Purpose : Project overview, verified model registry, setup and safety limits.
# Version : 1.2.0
# Reviewed: 2026-10-21
# Status  : INDEPENDENT INTERVIEW PORTFOLIO DEMO – NOT COMTRADE APPROVED
# =============================================================================
-->

# Presales Studio v1.2 — Cisco & Fortinet

**Independent, local-first presales demonstration** for a Networking & Cybersecurity interview. Prepared by **DAMIR OMERASEVIC**. Not affiliated with or endorsed by Comtrade Distribution, Cisco or Fortinet.

## Key capabilities

- Two discovery questionnaires; answers, confirmation, evidence and live completion indicators.
- **Model-aware product catalogue** covering **53 reference entries** (Cisco Secure Firewall, Meraki, Catalyst, FortiGate, switching, wireless and management families).
- **Per-BOM-item dynamic capacity screening**, a visible, parameterised formula and traceable source for every supported model.
- Service-aware metrics: basic firewall throughput, NGFW/Threat Protection or FW+AVC+IPS, separately documented TLS inspection throughput and active-passive HA requirements.
- **No invented throughput** for products with unknown metrics. Switch/AP/management capacity deliberately requires different design tests; license/support items are excluded from throughput calculations.
- A **TCO?** checkbox selects lines to include in commercial totals; *all* BOM lines are still screened individually in sizing, including alternatives.
- QA gate differentiates **Potvrđeno** from **Verifikovano** (owner + documented evidence).
- Local autosave, JSON import/export and CSV exports; no backend or live vendor feed.

## Deployment to GitHub Pages

Upload the contents of the package to the **root of your GitHub repository**. Preserve `.github/workflows/deploy.yml` at the exact path — not as a file in root.

In GitHub: **Settings → Pages → Source: GitHub Actions**. Push/commit to `main`, check the workflow in **Actions**. Public URL normally follows `https://<github-user>.github.io/<repository>/`.

The app does not require npm or a build step. Open `index.html` locally for an offline demonstration (depending on local browser storage policy, use a static HTTP server to ensure stable autosave: `python3 -m http.server 8000`).

## Start the demo

1. Export an existing project JSON before loading a demo — DEMO **replaces local workspace data**.
2. Click **▶ Učitaj DEMO**. The synthetic `Branch Secure Connect 2026` project loads 600 Mbps peak, 30% growth, 25% headroom, IPS/TLS/HA enabled.
3. In Capacity sizing, review the visible **600 × 1.30 × 1.25 = 975 Mbps** formula.
4. In BOM, compare FortiGate 90G with Cisco Secure Firewall 1210CE. **Cisco is marked TCO? = off** because it is an alternative rather than simultaneously purchased hardware.
5. FortiGate 90G Threat Protection = **2.2 Gbps** from the public Fortinet catalogue, but TLS value is **missing** in this reference registry → **INSUFFICIENT DATA** if TLS is enabled.
6. Cisco Secure Firewall 1210CE FTD FW+AVC+IPS = **6.0 Gbps** and TLS decryption = **1.0 Gbps**, published as **separate test metrics** → **CONDITIONAL – DOUBLE CHECK** for 975 Mbps.
7. Add FortiGate 60F from Portfolio, or change the reference model in BOM; its public Threat Protection **0.7 Gbps** is below 975 Mbps → **FAIL**.
8. Open QA gate and show why a status without owner and evidence is **not verified**.

## Critical technical principles

**Capacity target** = `peak traffic Mbps × (1 + planned growth/100) × (1 + headroom/100)`. This is a planning requirement, NOT a statement of product performance.

**Per-row assessment:** Each BOM hardware line uses the global peak or its optional `Peak (Mbps) override`; traffic is assumed to represent a distinct traffic domain unless architecture proves otherwise. A number of devices in an active-passive HA pair **must not multiply throughput**.

**Security benchmarks:** When NGFW/IPS is selected, use the appropriate FW+AVC+IPS or Threat Protection benchmark; when TLS is selected, additionally require a TLS benchmark. Do **not** sum independent benchmark numbers or pretend they represent a simultaneous combined test.

**Conditional ≠ PASS.** An entry with all necessary *separately* published metric values above the target remains **CONDITIONAL** until vendor SE validates simultaneous services, software versions, ports, sessions, licensing and actual traffic patterns.

**Insufficient data is not a failure of the tool.** It prevents false precision when the public source does not include a comparable metric.

**TCO vs capacity:** Alternative models may be screened simultaneously but only checkbox-selected BOM lines enter financial totals. Vendor prices, lead times, lifecycle and product availability are not sourced live.

## Verified and provisional information

Information is a **snapshot dated 21 October 2026**. Each model links to its **official manufacturer source**, with a separate status:
- `VENDOR PUBLISHED`: named metric(s) copied from vendor data sheet/catalogue.
- `VENDOR PUBLISHED – THREAT ONLY`: only Fortinet public Threat Protection throughput available in this reference row.
- `VENDOR PUBLISHED – FIREWALL ONLY`: Meraki public basic firewall throughput, not an NGFW/IPS benchmark.
- `FAMILY / MODEL-SPECIFIC DATA REQUIRED`: no defensible single Mbps number for the family; specialist sizing required.
- `MODEL SPECS PENDING`: product family identified, per-SKU data intentionally not invented.

**The registry is a curated technical reference, not an exhaustive listing of every sales SKU** in Cisco's or Fortinet's current global catalogue. The exact SKUs, product lifecycle status, firmware compatibility, port mix, subscriptions, EoL and regional distribution stock must be checked at each RFQ.

## Files

- `index.html` — static app entry point.
- `app.js` — live evaluation, BOM, QA and front-end event handling.
- `data/core.json` — discovery prompts, QA controls, source URLs and family reference list; `data/*.json` — four editable vendor datasets.
- `styles.css` — theme/responsive layout.
- `HOW_TO.md` — click-by-click workflow.
- `ARCHITECTURE.md` — data logic and technical boundaries.
- `CHANGELOG.md` — release history.
- `.github/workflows/deploy.yml` — GitHub Pages deployment.
- `tests/` — Node.js smoke, live status and v1.2 sizing checks.

## Safety and confidentiality

Do not enter passwords, private keys, detailed customer network diagrams, device configs or real commercial prices into a public interview demo. `localStorage` is not an approved secure customer-data repository. Never present the app as an official manufacturer sizing tool or claim that a provisional model has been technically approved.

## Links used for source verification

- Fortinet NGFW catalogue: https://www.fortinet.com/products/next-generation-firewall
- Cisco Secure Firewall 1200 datasheet: https://www.cisco.com/c/en/us/products/collateral/security/firewalls/secure-firewall-1200-series-ds.html
- Cisco Secure Firewall 3100 datasheet: https://www.cisco.com/c/en/us/products/collateral/security/firewalls/secure-firewall-3100-series-ds.html
- Cisco Secure Firewall 4200 datasheet: https://www.cisco.com/c/en/us/products/collateral/security/firewalls/secure-firewall-4200-ds.html
- Cisco Meraki MX models: https://meraki.cisco.com/products/security-sd-wan/models/
- Cisco Catalyst product families: https://www.cisco.com/c/en/us/products/collateral/switches/catalyst-9000/nb-06-cat-9k-aag-cte-en.html

**Next stage before production:** tested source updates, exact SKUs, licensing/service renewal, vendor-specific performance test metadata, RBAC/audit trail, authenticated secure storage, formal vendor SE sign-off and CI browser tests.

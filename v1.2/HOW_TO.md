<!--
# =============================================================================
# PRESALES STUDIO – CISCO & FORTINET
# Copyright (C) 2026 DAMIR OMERASEVIC. All rights reserved.
# Author  : DAMIR OMERASEVIC
# File    : HOW_TO.md
# Purpose : End-to-end workflow and a six-minute interview demonstration.
# Version : 1.2.0
# Reviewed: 2026-10-21
# Status  : DEMONSTRATION WORKFLOW – REQUIRES VENDOR DOUBLE CHECK
# =============================================================================
-->

# HOW TO — Presales Studio v1.2

## A. Start and protect your data

1. Open the GitHub Pages URL or run `python3 -m http.server 8000` in the repo and visit `http://localhost:8000`.
2. For an existing customer/project, click **↓ Sačuvaj JSON** before loading another project.
3. Click **▶ Učitaj DEMO** and confirm that the existing *local* project will be overwritten.
4. DEMO entries are synthetic. Real customer diagrams, configs, credentials and discounted prices must NOT be stored in this public portfolio demonstration.

## B. Discovery

1. Choose Cisco or Fortinet using the vendor tabs.
2. Collect requirements for traffic, security services, interfaces/PoE, sites, WAN/VPN, compliance, hardware lifecycle and HA.
3. Enter **answer + status + evidence**; the app counts answered, declared confirmed and *fully verified* independently.
4. Document measurements and assumptions. Do not automatically treat `Potvrđeno` as proven without evidence.

## C. Capacity sizing

1. Enter measured peak Mbps (demo = 600), WAN contracted Mbps (1000; reference only), users, growth percent (30) and reserve percent (25).
2. Formula automatically displayed: `600 × (1 + 30/100) × (1 + 25/100) = 975 Mbps`.
3. Tick NGFW/IPS when requiring intrusion prevention/security profiles. Tick Deep TLS when traffic is decrypted/inspected. Tick HA when designing redundant devices.
4. These boxes change **which benchmarks must be reviewed**, never artificially reduce performance by arbitrary percentages.
5. Each BOM line gets its own capacity comparison. If line-specific traffic is different (branch vs headquarters), populate the `Peak (Mbps) override` field in BOM.
6. Change global inputs, BOM model, qty, TLS/IPS/HA or line-specific peak; the formula and status update automatically.

### What the numbers mean

- `PASS` is **not issued automatically** based on datasheet throughput alone.
- `CONDITIONAL – DOUBLE CHECK` means preliminary published performance exceeds capacity target but real-world combined conditions remain unverified.
- `INSUFFICIENT DATA` means required comparable reference metric is missing (for example Fortinet public Threat Protection value without verified TLS benchmark).
- `FAIL – ISPOD TARGETA` means an applicable published benchmark is below the calculated target.
- `ZASEBAN DIMENZIONIŠI` means switch/Wi-Fi/management needs independent dimensioning such as switch fabric, PoE, RF survey, device counts and logs/s.
- `N/A – KOMERCIJALNA STAVKA` means licenses, support and implementation are not throughput-bearing appliances.
- `NEDOSTAJE MODEL` means the row needs a reference model and a proper sales SKU confirmation.

**Do not sum appliance throughput** just because BOM Qty=2. In an active-passive HA pair, each node needs adequate independent capacity during failure. Do not sum access switch fabric, firewall threat throughput and wireless theoretical radio rate.

## D. Portfolio and adding models to BOM

1. Open **Product portfolio**.
2. Filter Cisco/Fortinet or search a product such as `FortiGate 90G`, `1210CE`, `Catalyst 9300`.
3. Review the listed capacity metrics and their **benchmark names**. Blank/`—` means **not confirmed**, not zero.
4. Click the official vendor documentation link (Vendor ↗). Record the review date.
5. Press **+ BOM** next to a model. The app opens BOM with that reference model selected.
6. In BOM, enter **exact sales SKU**, description, quantity, costs/prices (only if appropriate), and optional per-site peak.
7. Hardware reference model name **is not a validated orderable SKU**. Manufacturer SE/procurement must validate actual SKU and entitlements.

## E. BOM & TCO

- `TCO?` checked → row contributes to overall buy/sell totals and indicative gross margin.
- `TCO?` unchecked → item stays in comparison and dynamic sizing but is **excluded from financial totals**, useful for mutually exclusive vendor alternatives.
- A single project may contain HQ and branch devices; use per-row traffic override for a separate traffic domain.
- The demo loads FortiGate 90G (included in TCO), Cisco 1210CE (alternative, excluded) and a synthetic support line (included). No genuine price, licence or availability is implied.
- A hardware quantity alone does not prove HA topology, and a missing licensing line makes the real offer incomplete.
- Internal procurement costs and margins must not be included in a customer-facing export.

## F. Refresh and QA gate

`Technology refresh` is **directional candidate mapping**, not an authorised 1:1 replacement list. Model replacement needs a detailed feature/configuration audit, firmware migration path and rollback plan.

For each QA line:
- Selecting `Potvrđeno` increases **declared confirmed**.
- **Verifikovano** increases only when status is confirmed or N/A AND owner plus evidence are present.
- Open/blocked and unverified items keep the offer in `NOT READY`; even all verified yields only `REVIEW` requiring human approval.

## G. Six-minute interview demo script

| Time | Action | What to say |
|---|---|---|
| 00:00–00:45 | Load DEMO on Dashboard | “Independent presales workflow: discovery to approved offer.” |
| 00:45–01:30 | Discovery, confirm a row and cite evidence | “Status and evidence are different.” |
| 01:30–02:15 | Change peak 600→800→600 on Sizing | “The formula responds immediately; 975 Mbps is the base target.” |
| 02:15–03:15 | Portfolio search for 90G and 1210CE | “Manufacturer references and benchmark definitions are visible.” |
| 03:15–04:30 | BOM model selections and `TCO?` | “Alternatives are screened separately; they are not bought together.” |
| 04:30–05:30 | Sizing per BOM line, optionally add FortiGate 60F | “Insufficient / conditional / fail are intentional engineering safeguards.” |
| 05:30–06:00 | QA gate | “No automatic vendor signoff; documented owner + evidence required.” |

### Technical talking points

**FortiGate 90G:** Fortinet public Threat Protection **2.2 Gbps**, but the current registry deliberately lacks a verified TLS benchmark → `INSUFFICIENT DATA` with TLS enabled.

**Cisco Secure Firewall 1210CE:** Cisco FTD FW+AVC+IPS **6 Gbps**, separate TLS **1 Gbps** benchmark vs target 975 Mbps → `CONDITIONAL`; not a proven simultaneous IPS+TLS performance.

**FortiGate 60F:** Fortinet Threat Protection **0.7 Gbps**, below 975 Mbps → `FAIL`, even in a simple active-passive HA pair.

## H. Technical double-check before a real quote

For every candidate:
- Obtain **current** per-SKU datasheet and confirm its benchmark methodology, packet size and enabled security profile.
- Confirm encrypted traffic percentage, IPS + TLS interactions, sessions/sec, VPN tunnels and actual interface speeds.
- Confirm HA feature/mode, exact devices, support entitlement, licence terms and updates.
- Verify compatibility, EOS/EOL/LDOS, regional availability, lead time and relevant compliance obligations.
- Secure review from **Vendor Systems Engineer / Solution Architect**, then procurement and commercial owner.

Documentation snapshot: **21 October 2026**. No live API feed. Public manufacturer's links are accessible from catalogue and README.

## I. GitHub Pages update

To publish a new release, **replace changed files in repository root** (`app.js`, `data.js`, `index.html`, docs, `styles.css` if applicable), preserve `.github/workflows/deploy.yml`, commit to `main`, wait for green **Actions** check, then hard refresh (Ctrl/Cmd + Shift + R). Export any local JSON before resetting the demo. Storage persists under the same `presales-studio-v1.2` key for v1.2 isolation.

## J. Preparing for the interview

The main evaluation is **not** whether the app can choose a firewall automatically; the key is demonstrating disciplined requirements discovery, correct engineering comparisons and safe acknowledgement of unknowns. Use `DAMIR_OMERASEVIC_Presales_Studio_v1_2_Intervju_Demo_Vodic.pdf` for the detailed rehearsed presentation.

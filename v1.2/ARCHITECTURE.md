<!--
# =============================================================================
# PRESALES STUDIO – CISCO & FORTINET
# Copyright (C) 2026 DAMIR OMERASEVIC. All rights reserved.
# Author  : DAMIR OMERASEVIC
# File    : ARCHITECTURE.md
# Purpose : Client-side architecture, data model and trust boundaries.
# Version : 1.2.0
# Reviewed: 2026-10-21
# =============================================================================
-->

# Architecture

A single-page, dependency-free HTML/CSS/JavaScript static application, deployable to GitHub Pages. No backend. It stores state in browser `localStorage` under key `presales-studio-v1.2` (isolated from the v1.1 root version) and allows import/export as JSON. **No production security/audit guarantees** are implied by local storage.

`data.js` contains discovery prompts, company-neutral portfolio and refresh descriptions, QA control questions and 53 **reference model entries** with source URL, benchmark, status and the 2026-10-21 review date. Not a dynamic distributor inventory.

`app.js` holds the dynamic UI, per-BOM-row sizing, live formulas, evidence-aware QA, TCO scoping and CSV/JSON export. `index.html` binds the application and `styles.css` provides layout.

## Sizing model

```
target_mbps = (override_peak_mbps || project_peak_mbps)
            × (1 + growth_pct/100)
            × (1 + headroom_pct/100)

NGFW/IPS ON  → require benchmark named NGFW/Threat Protection/FW+AVC+IPS
NGFW/IPS OFF → require published basic firewall benchmark
TLS ON       → additionally require separately published TLS inspection benchmark
HA ON        → ensure each active-passive node independently meets target;
               quantities are NOT added to obtain failover throughput
```

No direct *automatic* PASS exists: even apparently sufficient separate benchmarks yield CONDITIONAL when the actual combined feature profile is unproven. Any applicable published benchmark below target yields FAIL. Missing needed benchmark yields INSUFFICIENT DATA (unless a known benchmark already FAILS). A non-firewall product is handled with its own design parameters; it cannot be converted into NGFW Mbps.

## Commercial scoping

A BOM row has `modelId`, optional `traffic` override, `include` (default true) and user-entered `sku`. Product catalogue name and actual orderable SKU are deliberately different. Commercial totals sum *only* rows with `include !== false`; dynamic capacity checks consider **all** rows so alternate solutions can be screened without charging them both.

## Limits

Static manufacturer benchmarks are not comparable across vendors without matching test methodology. Software version, network topology, packet mix, latency, decrypted TLS share, NGFW policies, session counts and entitlements can affect capacity. All outcomes require Vendor SE double check. No credentials or customer secrets should be entered.

## Testing

`node tests/smoke.cjs`  
`node tests/live_status.cjs`  
`node tests/v12_sizing.cjs`

For live DOM interaction, manually verify on the deployed GitHub Pages application, including browser-specific localStorage behaviour and caching.

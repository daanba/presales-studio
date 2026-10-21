<!--
# =============================================================================
# PRESALES STUDIO - JSON DATA CONTRACT
# Copyright (C) 2026 DAMIR OMERASEVIC. All rights reserved.
# Author  : DAMIR OMERASEVIC
# File    : DATA_DICTIONARY.md
# Purpose : Document editable JSON schemas, validation and safe publishing.
# Version : 1.3.0
# Reviewed: 2026-10-21
# Status  : INDEPENDENT DEMO - NOT VENDOR APPROVED
# =============================================================================
-->
# Data dictionary

The five files in `data/` are **canonical JSON**, and therefore intentionally do not contain JavaScript-style comments. Each file's source, verification status and date belong in the record's fields; file-level ownership/version information is in this document and the README. Keep JSON parseable.

## Portfolio record
`id` (globally unique stable string; do not change on an in-use model), `vendor` (`Cisco` / `Fortinet`), `name`, `category`, `profile`, `capacityType` (`firewall`, `switch`, `wireless`, `management`, `other`), `firewallGbps`, `ngfwGbps`, `tlsGbps`, `ipsGbps` (nonnegative **numbers or null**, never guessed), `interfaces`, `notes`, `method` (published benchmark methodology), `source` (HTTPS official vendor URL), `status` (evidence confidence), `verifiedOn` (`YYYY-MM-DD`).

When a throughput is missing or not comparable, use **null** and label the record clearly. Individual published throughput metrics must never be added to estimate concurrent TLS+IPS throughput.

## Technology refresh record
`vendor`, `legacy`, `target`, `confidence`, `checks`, `source`. Replacement candidates are not guaranteed 1:1 migrations. Confirm EOS/EOL, license transfer, port counts, feature parity, configuration conversion and migration window before quotation.

## Publishing
1. Open `admin.html` → edit/validate → **Snimi lokalno**.
2. Export the appropriate JSON file(s). Files are downloaded to the local device and do **not** automatically update GitHub.
3. Upload to `v1.3/data/` inside repository and commit; GitHub Pages deployment should run.
4. Clear a local draft to view the current committed GitHub data. Otherwise local draft intentionally takes precedence.
5. If a referenced model's `id` changes, existing project BOM rows referencing its old ID will no longer match.

## Security
No back-end authentication or user accounts. Local drafts are a **personal browser feature**, not a shared governed data store. Never store secrets, private configs, real end-customer security topology or confidential prices in the demo.

`data/core.json` stores discovery question sets, QA controls, product family summaries and documentation source links. The visual administration editor focuses on the four vendor portfolio/refresh files; core JSON is edited using a text editor/GitHub pull request.

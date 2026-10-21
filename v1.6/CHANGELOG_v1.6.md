# Presales Studio v1.6 — Change log
Reviewed: 2026-10-21 | Author: DAMIR OMERASEVIC

## Feature: Closed-loop presales workflow

- Linked Dashboard working project to one selected CRM RFQ/quote via immutable business IDs.
- Added bidirectional UI navigation between **Pregled projekta** and **Ponude i revizije**, including from the RFQ screen.
- Added optional **full project snapshot per quote revision**: BOM, sizing, discovery, QA and relevant project metadata, saved as separate deep-copy JSON.
- Added safe re-opening of a specific historical revision into a working project, after a clear overwrite warning.
- Prevented falsified project reconstruction: v1.5 old revisions with no attached snapshot open a clearly labelled unfinished workspace.
- DEMO seed for five companies and quotes now includes explicitly synthetic, unverified project snapshots in each revision.
- Preserved old v1.1–v1.5 directories **byte-for-byte** in the combined ZIP; v1.6 is a standalone folder.
- Copied v1.5 localStorage CRM and workspace data into independent v1.6 keys on first use; did not rewrite existing historical localStorage.
- Preserved v1.5 portfolio, capacity screening, optional JSON editor, vendor sync, RFQ history and revision functions.

## Engineering boundaries

Static localStorage only; not a server-backed CRM. A change to active project **does not silently rewrite** stored offer versions. A new revision requires an explicit action and reason. Historical version snapshot never constitutes manufacturer approval.

## v1.6.1 — Guided Technology Refresh and Help patch

- Fixed Cisco-only candidate dropdown by sourcing selectable new models from **both** portfolios.
- Added vendor filter: Cisco + Fortinet / Cisco / Fortinet.
- Added 3 choices for legacy device: historical refresh, current portfolio, manual unlisted.
- Explicitly distinguished old inventory confirmation from reference-catalog records.
- Target-vendor refresh editor receives the candidate record; cross-vendor migration note and double-check added.
- Updated `How it works` UI, HOW_TO.md and README.
- Previous version folders v1.1–v1.5 are retained unmodified.

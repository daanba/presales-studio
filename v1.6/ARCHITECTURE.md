# Architecture v1.4

**Author: DAMIR OMERASEVIC — independent demo; not production.**

The static application is hosted under `/v1.4/` (separate from previous releases). Core modules are unmodified v1.3 functionality cloned into v1.4 and isolated with versioned browser storage.

- `index.html`, `app.js`, `data.js`, `styles.css`: technical presales workflow.
- `catalog-loader.js` + `data/*.json`: baseline portfolio, refresh and discovery data.
- `admin.html`, `admin.js`: v1.3 catalogue local editor.
- `vendor-sync.js`: browser-only controlled catalog import/merge and guided refresh candidates. Imports must be normalized JSON; no official Cisco/Fortinet vendor API integration.
- `crm.html`, `crm.js`: separate browser-only company, opportunity, quote/order, event log, questionnaire and response records.
- Persistence keys: `presales-studio-v1.4` (technical project), `presales-studio-v1.4-catalog-draft` (catalog), `presales-studio-v1.4-crm` (CRM).
- Releases v1.1, v1.2 and v1.3 are physically separate. No automatic migration/import from prior versions.

`crm.js` stores event records with timestamp and manually entered actor. Actor authenticity is not verified. Data can be edited via browser storage, therefore this is not an audit-proof transactional system. Production deployment requires approved backend, identity/RBAC, sensitive-data governance, field-level validation, reconciliation, backups, signed logs and secure integrations.

For catalogue merge, compare by stable model `id`; require vendor match, valid URL and nonnegative throughput numeric values. Full replacement requires explicit user selection. For refresh candidates, do not treat an old-to-new mapping as a validated 1:1 match. Human sign-off and vendor SE double-check required.

For performance sizing, separately published Firewall, NGFW/IPS and TLS metrics cannot be combined into a guarantee of simultaneous throughput. No sum of HA active-passive node throughput.

## v1.6 CRM + project data link

Project key `presales-studio-v1.6`, CRM key `presales-studio-v1.6-crm` (both localStorage on the same origin). Project `crmLink` holds immutable `opportunityId`, `quoteId`, and optional `revision`, while `CRM.quotes[].revisions[].workspaceSnapshot` stores a point-in-time deep copy of the working state.

Old releases remain separate. First-run v1.6 copies older v1.5 storage values if available; it never deletes their previous keys. This schema remains CRM v1 but revisions can now include `workspaceSnapshot`; old records still validate.

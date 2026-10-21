# GitHub Pages deployment — four independent versions

Prepared for DAMIR OMERASEVIC, 21 October 2026.

| Version | Expected URL after successful GitHub Pages deploy |
| --- | --- |
| v1.1 | https://daanba.github.io/presales-studio/ |
| v1.2 | https://daanba.github.io/presales-studio/v1.2/ |
| v1.3 | https://daanba.github.io/presales-studio/v1.3/ |
| v1.4 | https://daanba.github.io/presales-studio/v1.4/ |
| Catalog Admin v1.4 | https://daanba.github.io/presales-studio/v1.4/admin.html |
| CRM / RFQ History v1.4 | https://daanba.github.io/presales-studio/v1.4/crm.html |

## Steps
1. Backup existing `presales-studio` repository and export any browser projects and CRM data before changing anything.
2. Download `DAMIR_OMERASEVIC_Presales_Studio_v1_1_v1_2_v1_3_v1_4_GitHub.zip`.
3. Unzip and copy the **contents** into the root of a local clone of `daanba/presales-studio` (GitHub Desktop recommended).
4. Previous v1.1 files and v1.2/v1.3 folders remain **byte-for-byte identical** to the previously distributed 3-version package.
5. New release lives only in `v1.4/`. Preserve `.github/workflows/deploy.yml` exactly under that folder path. Commit, then Push origin.
6. Check GitHub Actions for a successful deployment; then open the URLs above and hard refresh your browser.
7. Verify `/v1.4/admin.html` official manufacturer links, normalized JSON template/export, controlled merge preview, guided refresh.
8. Verify `/v1.4/crm.html` company, RFQ/opportunity, activity history, custom questionnaire, demo records and JSON backup/restore.
9. For published catalog changes, export locally then commit the JSON into `v1.4/data/`. Browser-only saved drafts are not uploaded automatically.

## Limitations
Manufacturer websites are not guaranteed to offer normalized CORS-enabled JSON APIs. Vendor buttons point to official catalog webpages; the separate JSON fetch is only for CORS-enabled, compatible feeds. Do not assert direct automatic vendor synchronization. Imported metrics require double check.
CRM is browser-only and self-declared actors are not authenticated. Do not use real customer, order, financial or confidential data in this public portfolio demo.

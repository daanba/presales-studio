# Presales Studio — deployment of three independent versions

**Prepared by DAMIR OMERASEVIC · 2026-10-21**

This package is prepared for the existing GitHub repository `daanba/presales-studio`:

| Public path | Version | Notes |
| --- | --- | --- |
| `https://daanba.github.io/presales-studio/` | v1.1 | Root files, unchanged |
| `https://daanba.github.io/presales-studio/v1.2/` | v1.2 | Prior feature version, unchanged |
| `https://daanba.github.io/presales-studio/v1.3/` | v1.3 | JSON portfolio administration |
| `https://daanba.github.io/presales-studio/v1.3/admin.html` | v1.3 Admin | Local editing & JSON export |

## Upload

1. Download and extract this package.
2. Clone repository `daanba/presales-studio` using GitHub Desktop.
3. Copy the **contents** of this ZIP into the repository root (not a nested folder); root `index.html` must remain v1.1.
4. Check the file tree: `v1.2/index.html`, `v1.3/index.html`, `v1.3/admin.html`, `v1.3/data/`, `.github/workflows/deploy.yml`.
5. Commit and push to `main`; ensure **Settings → Pages → Source = GitHub Actions**.
6. Verify the deploy in **Actions**, then open all three paths. Force-refresh if cached.

## Editing the catalogue

Open `v1.3/admin.html` and select Cisco/Fortinet Portfolio or Refresh. Edit entries, validate, and save local draft. The regular v1.3 application will use the same local draft in that browser. To publish for everyone, **export edited JSON files and upload them to `v1.3/data/` in GitHub**.

Existing local state for v1.1 and v1.2 is not altered. v1.3 uses its own `presales-studio-v1.3` key for project state and `presales-studio-v1.3-catalog-draft` for catalogue drafts. Projects exported as JSON in older versions can be imported manually; vendor-model IDs are stable.

**Safety:** Independent portfolio demonstration, NOT endorsed by Comtrade, Cisco, or Fortinet. Performance data require current vendor double-check before any quote.

## Troubleshooting

- `v1.3` shows “JSON catalogue cannot load”: verify all four `.json` files are present and served through HTTP(S). Opening HTML via `file://` will not load `fetch()` datasets reliably.
- Admin edits appear only in one browser: expected. GitHub Pages is static; export and commit JSON to publish globally.
- Updates still show old data: hard refresh and click **Vrati GitHub bazu** in Admin to clear the previous local draft.
- GitHub Actions workflow not starting: verify the workflow is in `.github/workflows/deploy.yml`, NOT at root.

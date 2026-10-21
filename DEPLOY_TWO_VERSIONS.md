# DEPLOY: v1.1 at root + v1.2 in /v1.2

Repository: `daanba/presales-studio`

| Address | Folder in repository | localStorage key |
|---|---|---|
| https://daanba.github.io/presales-studio/ | `/` (root) | `presales-studio-v1` |
| https://daanba.github.io/presales-studio/v1.2/ | `/v1.2/` | `presales-studio-v1.2` |

**Both versions live on the SAME github.io origin, so unique localStorage keys are essential**: without that adjustment, both would overwrite each other's project.

## Structure

```
presales-studio/
  index.html           <- v1.1
  app.js               <- v1.1
  data.js              <- v1.1
  styles.css           <- v1.1
  README.md            <- v1.1
  .nojekyll
  .github/workflows/deploy.yml
  tests/
  v1.2/
    index.html         <- v1.2
    app.js             <- v1.2 (isolated storage key)
    data.js            <- v1.2
    styles.css         <- v1.2
    README.md
    HOW_TO.md
    ARCHITECTURE.md
    CHANGELOG.md
    docs/
    tests/
```

## How to upload

### Recommended: GitHub Desktop

1. Open GitHub Desktop and clone `daanba/presales-studio` to your computer.
2. Make a local backup. Unzip this archive and copy its **contents** into the repository root, overwriting current v1.1 root files ONLY if they correspond to v1.1 and adding the new `v1.2/` folder.
3. In Desktop inspect changed files; v1.1 root should stay the same.
4. Commit: `Deploy v1.1 root and isolated v1.2 subfolder`.
5. Push to `main`.
6. GitHub → Actions: wait for green deployment.
7. Test both URLs above (GitHub Pages may redirect `/v1.2` to `/v1.2/`).

### Alternative: git command line

```
git clone https://github.com/daanba/presales-studio.git
cd presales-studio
# Copy the UNZIPPED contents from this archive into this repository
git status
git add .
git commit -m "Deploy v1.1 root and v1.2 in subfolder"
git push origin main
```

Do not upload the ZIP itself to the repo expecting GitHub Pages to unpack it.

**Browser Upload files warning:** GitHub browser uploads can omit hidden folders or fail to retain nested paths; verify `.github/workflows/deploy.yml` and `v1.2/index.html` in the Code view. GitHub Desktop is safer.

## GitHub Pages

Settings → Pages → Build and deployment → Source = **GitHub Actions**.

The root `.github/workflows/deploy.yml` uploads `path: '.'`, which publishes both root files and `v1.2/` on the same Pages site. No separate Actions workflow is needed for v1.2.

## Verification

- Root: left sidebar shows **v1.1**.
- `/v1.2/`: left sidebar shows **v1.2**.
- In v1.1 load demo/change field. In v1.2 load demo/change different field. Refresh both and verify independent state.
- Before any new deployment, use **Sačuvaj JSON** in BOTH versions to back up local project data.
- Hard refresh if old cached JS appears (Cmd/Ctrl + Shift + R).

## Independence and security

These are independent portfolio demos, not official Cisco/Fortinet/Comtrade tools. Data stored in localStorage is **not** secure storage. Use only synthetic customer information for a public demo.

## State migration (optional)

v1.1 and v1.2 have different state structures/features. JSON import may be used if compatible, but verify all imported fields and re-run sizing/QA; use demo as a clean start for v1.2 instead of assuming full schema compatibility.

---
name: github-pages-deploy
description: Documents GitHub Pages deploy for gotta-catch-em-all—base href, workflow, and dist layout. Use when editing deploy, base-href, static hosting, or GitHub Actions for this repo.
---

# GitHub Pages deploy guardrails

## URLs

- Live site shape: `https://<user>.github.io/<repository-name>/`
- **Base href** must be `/<repository-name>/` (leading and trailing slash as Angular expects for the repo segment). Local check: **`npm run build:github-pages`** (same base href as CI for this repo name).

## Local vs CI

- **package.json** script: `build:github-pages` uses `--base-href /gotta-catch-em-all/` (matches this repo name).
- **Test** (`.github/workflows/test.yml` → `quality`) builds with:
  `npx ng build --configuration production --base-href /${{ github.event.repository.name }}/`
  so the segment stays correct if the repo is renamed—then update the **npm script** to match.
- On **`push` to `main`**, Test uploads artifact **`github-pages-site`** (`dist/.../browser` + `.nojekyll`).

## Workflow responsibilities

- **Deploy** (`.github/workflows/deploy-github-pages.yml`) runs after **Test** succeeds on `main` (`workflow_run`), or via manual **`workflow_dispatch`**.
- On `workflow_run`, **download** `github-pages-site` from the Test run (`run-id`) and publish—**do not rebuild** the SPA.
- On **`workflow_dispatch`**, Deploy may rebuild with the same base-href (no Test artifact).
- **`upload-pages-artifact`** path is the downloaded/built `site` folder; **`deploy-pages`** follows. Requires repo **Settings → Pages → Source: GitHub Actions**.

## When to edit the workflow

- Change Node version, install steps, or base-href strategy.
- Change **output path** if `angular.json` `outputPath` changes—keep dist subpaths in sync with `touch`, artifact upload, and Deploy.
- Change when deploy is allowed (Test gate / manual dispatch) or artifact name/retention.

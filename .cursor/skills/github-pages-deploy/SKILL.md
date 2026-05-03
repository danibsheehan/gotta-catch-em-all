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
- **CI** (`.github/workflows/deploy-github-pages.yml`) builds with:
  `npx ng build --configuration production --base-href /${{ github.event.repository.name }}/`
  so the segment stays correct if the repo is renamed—then update the **npm script** to match.

## Workflow responsibilities

- **Build output:** `dist/gotta-catch-em-all/browser` (application builder output).
- After build: **`touch dist/gotta-catch-em-all/browser/.nojekyll`** so GitHub Pages does not run Jekyll on static assets.
- **Artifact path** for `upload-pages-artifact` is that `browser` folder.
- **Deploy** uses `deploy-pages` after the build job; requires repo **Settings → Pages → Source: GitHub Actions**.

## When to edit the workflow

- Change Node version, install steps, or base-href strategy.
- Change **output path** if `angular.json` `outputPath` changes—keep dist subpaths in sync with `touch` and `upload-pages-artifact`.

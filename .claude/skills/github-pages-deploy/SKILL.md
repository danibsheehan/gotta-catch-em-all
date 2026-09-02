---
name: github-pages-deploy
description: Documents GitHub Pages deploy for gotta-catch-em-all—base href, workflow, and dist layout. Use when editing deploy, base-href, static hosting, or GitHub Actions for this repo.
---

# GitHub Pages deploy guardrails

For the general shared-workflow mechanism (build+deploy in one run, no artifact hand-off),
see the **`foundations:github-pages-deploy`** skill. This file is gotta-catch-em-all's own
build-command/path reference.

## URLs

- Live site shape: `https://<user>.github.io/<repository-name>/`
- **Base href** must be `/<repository-name>/` (leading and trailing slash as Angular expects for the repo segment). Local check: **`npm run build:github-pages`** (same base href as CI for this repo name).

## Local vs CI

- **package.json** script: `build:github-pages` uses `--base-href /gotta-catch-em-all/` (matches this repo name).
- **`.github/workflows/test.yml`**'s `quality` job builds with the same command as a compile
  check only (not used for the deployed artifact):
  `npx ng build --configuration production --base-href /${{ github.event.repository.name }}/`
  so the segment stays correct if the repo is renamed—then update the **npm script** to match.

## Workflow responsibilities

- **`deploy`** job in `test.yml` (`needs: [quality, unit-tests]`, only on push to `main`) calls
  `danibsheehan/dani-actions`'s shared `deploy-github-pages.yml@v2` with this repo's actual
  build command (including the `.nojekyll` touch) and `dist-path: dist/gotta-catch-em-all/browser`.
  No artifact hand-off between jobs — the shared workflow does its own build in the same run.
- Requires repo **Settings → Pages → Source: GitHub Actions**.

## When to edit the deploy job

- Change Node version, install steps, or base-href strategy.
- Change **output path** if `angular.json` `outputPath` changes — keep `dist-path` in the
  `deploy` job's `with:` block in sync.
- Change the required-check names in `needs:` if `quality`/`unit-tests` are ever renamed or restructured.

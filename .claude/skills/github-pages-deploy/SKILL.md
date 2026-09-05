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
- **`.github/workflows/verify.yml`**'s build step (inside the shared `npm-verify.yml` job — see that
  file's `uses:` line for the version pin) runs the same templated build command as a compile check
  only (not used for the deployed artifact) — see that file for the exact command. If the repo is
  renamed, update the **npm script** to match the templated segment.

## Workflow responsibilities

- **`deploy`** job in **`.github/workflows/deploy-pages.yml`** (push to `main` only) calls
  `danibsheehan/dani-actions`'s shared `deploy-github-pages.yml` (see `deploy-pages.yml`'s `uses:`
  line for the version pin) with this repo's actual build command (including the `.nojekyll` touch)
  and `dist-path: dist/gotta-catch-em-all/browser`.
  No artifact hand-off — the shared workflow does its own build in the same run.
- Deploy is **not** gated by an in-workflow `needs:` on `verify.yml`. It relies on the branch
  ruleset requiring `verify.yml`'s check to pass before a push lands on `main` — see the
  rationale comment at the top of `deploy-pages.yml`.
- Requires repo **Settings → Pages → Source: GitHub Actions**.

## When to edit the deploy job

- Change Node version, install steps, or base-href strategy.
- Change **output path** if `angular.json` `outputPath` changes — keep `dist-path` in the
  `deploy` job's `with:` block in sync.
- If `verify.yml`'s required check name changes, update the branch ruleset's required-status-check
  setting (not this file) — gating is via ruleset, not an in-workflow `needs:`.

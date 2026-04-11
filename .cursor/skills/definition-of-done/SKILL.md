---
name: definition-of-done
description: Verifies gotta-catch-em-all changes by running lint, tests, and production build. Use after substantive edits to TypeScript, templates, styles, or config, or when the user asks to validate or finish a task.
---

# Definition of done (gotta-catch-em-all)

After **substantive** edits (features, services, components, tests, `angular.json`, environments, workflows), run these from the repo root in order:

1. `npm run lint`
2. `npm run test:ci`
3. `npm run build`

Fix failures before considering the task complete.

## When to also run GitHub Pages build

Run **`npm run build:github-pages`** (or confirm the same `base-href` as deploy) if the change touches any of:

- `src/index.html`, app routing, or **base `href`**
- `package.json` scripts `build` / `build:github-pages`
- `.github/workflows/deploy-github-pages.yml`
- Anything that could break a static deploy under a subpath

If unsure after a routing or deploy change, run it.

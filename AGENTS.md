# AGENTS.md

Instructions for any coding agent (Cursor, Claude Code, or otherwise) working in this repo.
Human contributors: see [`README.md`](README.md) instead — this file is written for agents
and skips the stylized tour.

**Gotta Catch Em All** is an Angular ~22 PokeAPI playground: pick a Pokémon by type, the app
rolls a random opponent, and one stat decides the room — higher **`special-attack`** wins,
tie goes to the opponent. No accounts, no backend of its own; all data comes from
[pokeapi.co](https://pokeapi.co/) through a single HTTP client.

## Install

```bash
npm install
```

Requires the Node version pinned in `.nvmrc` / `package.json` `engines` (`>=22.22.3`). No
env vars or other configuration are needed for local dev.

## Run

```bash
npm start                    # ng serve
npm run build                # production build
npm run build:github-pages   # production build with the GitHub Pages base-href
npm run serve:dist           # serve a production build locally
```

## Test / CI parity

```bash
npm run format:check   # Prettier — run `npm run format` first if this fails
npm run lint            # ESLint
npm audit --audit-level=high
npm run test:ci         # Vitest (via @angular/build:unit-test) with coverage
npm run build            # production build, same config CI/Deploy rebuild from
```

This is the same sequence `.github/workflows/test.yml` runs (`quality` + `unit-tests` jobs)
on push to `main` and on pull requests. `npm test` runs tests in watch mode; use that while
iterating on a single suite. See the **`definition-of-done`** skill for exactly when a
GitHub Pages build check is also required.

## Conventions

Detailed, path-scoped conventions live in `.cursor/rules/*.mdc` and are read automatically by
Claude Code via [`CLAUDE.md`](CLAUDE.md); Cursor reads them natively. Do not restate them here
— this section is the map, not the content:

| Area                                                                          | Rule                              |
| ----------------------------------------------------------------------------- | --------------------------------- |
| Angular shell, standalone conventions, Prettier, folder layout (always-apply) | `.cursor/rules/project-stack.mdc` |
| PokeAPI HTTP client boundary, caching, URL/path-segment rules                 | `.cursor/rules/http-pokeapi.mdc`  |
| Battle resolution logic and match history                                     | `.cursor/rules/battle-domain.mdc` |
| Global SCSS design tokens and style composition                               | `.cursor/rules/styles-tokens.mdc` |

Step-by-step playbooks (both `.cursor/skills/*/SKILL.md` and `.claude/skills/` — same files,
symlinked, auto-invoked by either tool based on the task):

- `definition-of-done` — runs Prettier check, lint, tests, and production build after
  substantive edits; flags when a GitHub Pages build check is also needed.
- `github-pages-deploy` — base-href, workflow, and dist layout for GitHub Pages deploys.
- `pokeapi-rxjs` — `PokeApiClient`, caching, and RxJS/error-handling conventions for PokeAPI
  calls.
- `test-generator` — generates Vitest unit tests for Angular components/services/pipes.
- `doc-writer` — README, JSDoc, and inline documentation, including keeping the README
  palette table and `docs/readme-ui-palette.svg` in sync with `_tokens.scss`.

## Constraints — do not

- **Scatter raw `HttpClient` calls in features.** All PokeAPI HTTP goes through
  **`PokeApiClient`** (`src/app/core/api/`).
- **Reimplement battle win/loss rules outside `resolveSpecialAttackBattle()`**
  (`src/app/features/battle/special-attack-battle.ts`). UI components must not reinvent them.
- **Hand-format against a different style than Prettier**, or reintroduce ESLint formatting
  rules that fight it. Match `.prettierrc.json`; CI enforces `format:check`.
- **Introduce a second color palette in global SCSS.** Use the `:root` tokens in
  `src/styles/_tokens.scss` via `var(--…)`.
- **Change `:root` token values without updating `README.md`'s palette table and
  `docs/readme-ui-palette.svg`** in the same change — see the `doc-writer` skill.
- **Commit secrets** or amend/force-push/skip hooks (`--no-verify`) without being explicitly
  asked.
- **Open, push, or merge a PR unless the user asks.** (This repo has no autonomous exception of
  its own — see README's **Automation** section. A scheduled routine in
  `danibsheehan/portfolio-automation` reads this repo read-only and may open a PR *in a different
  repo*, `danibsheehan.github.io`; it never touches this one.)

## Definition of done

- **Task done**: follow the scoped rule/skill for files touched; run the smallest relevant
  check (`npm run format:check`, `npm run lint`, `npm run test:ci` for touched suites). Run
  `npm run build:github-pages` when the change touches routing, base `href`, deploy scripts,
  or `.github/workflows/deploy-github-pages.yml` — see the `definition-of-done` skill.
- **PR done**: full sequence under Test / CI parity above, green. Commit, push, or open a PR
  only when the user asks.

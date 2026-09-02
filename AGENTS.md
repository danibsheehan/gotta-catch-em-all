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

### Stack and shell

- Angular ~22, **standalone** components/directives/pipes (`standalone: true`), `bootstrapApplication` + `app.config.ts`.
- **`@angular/platform-browser/animations`**: `provideAnimations()` vs `provideNoopAnimations()` based on **`prefers-reduced-motion`** (reduced motion → noop).
- New UI lives under `src/app/features/<feature>/` with colocated `*.component.ts` / `*.html` / `*.scss` as existing features do.
- Type-picker region: **`@defer`** in the app shell so battle chrome can paint first (viewport + idle prefetch) — preserve that pattern when changing `AppComponent`.

### Formatting (Prettier)

- **Prettier is required.** Match **`.prettierrc.json`** — do not hand-format against a different style, and do not reintroduce formatting rules that fight Prettier in ESLint.
- Defaults that matter for this repo: **single quotes**, **trailing commas (`all`)**, **`printWidth` 100**, **2-space** indent, **LF** endings (aligned with `.editorconfig`).
- After editing TS / HTML / SCSS / JSON / Markdown / YAML (or when finishing a substantive change), run **`npm run format`** on touched files or the repo, then confirm with **`npm run format:check`**. CI enforces `format:check`.
- Respect **`.prettierignore`** (`dist`, `coverage`, `node_modules`, `package-lock.json`, `.angular`, generated SVG docs). Do not format ignored paths into the tree.

### Where code belongs

- **`src/app/core/api/`** — HTTP to PokeAPI **only** via **`PokeApiClient`**. Do not scatter raw `HttpClient` URLs in features.
- **`src/app/core/audio/`** — **`AudioService`**: optional Web Audio SFX (ticks, battle stings), autoplay-safe unlock; **sound off by default**; preference in **`localStorage`** key **`gcea-sound-effects`**.
- **`src/app/features/battle/`** — battle orchestration: **`PokemonBattleService`**, **`PokemonPlayerService`**, **`PokemonOpponentService`**, **`BattleHistoryService`** (`recordMatch`, recent entries), **`resolveSpecialAttackBattle()`** in `special-attack-battle.ts`, flavor/helpers, result and recent-matchups UI.
- **`src/app/features/pokemon-picker/`** — **`PokemonCatalogService`**, type index + menus (`pokemon-selector/`, `pokemon-type/`).
- **`src/app/features/pokemon-display/`** — read-only presentation (`pokemon-details/`, `pokemon-card/`).
- **`src/app/shared/models/`** — shared TypeScript models (`Pokemon`, types, etc.).

### PokeAPI HTTP client

- **`PokemonCatalogService`** (`features/pokemon-picker/`) caches the type index and per-type lists with **`shareReplay(1)`** on **singleton** observables (private fields). New subscribers must reuse those streams; avoid re-creating pipes that drop the cache.
- Path segments for names/ids go through **`PokeApiClient`**'s `encodePathSegment` (via `getTypeDetail` / `getPokemon`). Preserve that for any new endpoints on the client.
- Random opponent ids are **`1…environment.maxPokemonSpeciesId`** (inclusive upper bound from env).

### Battle resolution

- Pure comparison logic stays in **`resolveSpecialAttackBattle()`** in `src/app/features/battle/special-attack-battle.ts` (stat name **`special-attack`**, tie → **opponent wins**, missing stat → `null`). UI components must not reimplement win/loss rules.
- **`BattleHistoryService`** persists the **newest three** matchups in **`sessionStorage`** under **`gcea-battle-history-v1`** (in-memory fallback if storage is blocked).

### Styles / design tokens

- Global design tokens: **`src/styles/_tokens.scss`** (`:root` CSS variables). Prefer **`var(--…)`** for colors, radius, shadows. Battle chrome partials **consume** those variables — do not introduce a second ad-hoc palette in global SCSS.
- **`src/styles.scss`** composes global modules from **`src/styles/`** (including **`_tokens.scss`**, **`_arena-type-wash.scss`**, **`_battle-chrome.scss`**, **`_battle-panel-frames.scss`**, plus shell/layout/focus partials). Type chip styling is centralized in **`_pokemon-type-chips.scss`** (shared with picker features).
- If you change **`:root`** token values, keep **`README.md`** (palette table) and **`docs/readme-ui-palette.svg`** in sync so docs stay honest.

Step-by-step playbooks live in `.claude/skills/*/SKILL.md` (canonical — add new skills here;
`.cursor/skills` is a symlink to it), auto-invoked by task:

- `github-pages-deploy` — base-href, workflow, and dist layout for GitHub Pages deploys.
- `pokeapi-rxjs` — `PokeApiClient`, caching, and RxJS/error-handling conventions for PokeAPI
  calls.

This repo also installs the `foundations` plugin from the `dani-foundations` marketplace
(see `.claude/settings.json`), providing `doc-writer`, `definition-of-done`, and
`angular-vitest-testing` (namespaced `foundations:*`) — no local copies needed; each
verified generic enough on its own (the GitHub-Pages-build trigger conditions are already in
Definition of done below; the local `test-generator` skill's Angular patterns are now in
`foundations:angular-vitest-testing`, and its only repo-specific content — `test:ci`,
Prettier formatting — was already documented in Test/CI parity and Definition of done).

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
  `docs/readme-ui-palette.svg`** in the same change — see the `foundations:doc-writer` skill.
- **Commit secrets** or amend/force-push/skip hooks (`--no-verify`) without being explicitly
  asked.
- **Open, push, or merge a PR unless the user asks.** (Agents never do this autonomously here.
  The one repo-level exception is CI itself:
  [`dependabot-auto-merge.yml`](.github/workflows/dependabot-auto-merge.yml) auto-merges grouped
  npm minor/patch Dependabot PRs once checks pass — that's GitHub Actions, not an agent action. A
  scheduled routine in `danibsheehan/portfolio-automation` reads this repo read-only and may open
  a PR _in a different repo_, `danibsheehan.github.io`; it never touches this one.)

## Definition of done

- **Task done**: follow the scoped rule/skill for files touched; run the smallest relevant
  check (`npm run format:check`, `npm run lint`, `npm run test:ci` for touched suites). Run
  `npm run build:github-pages` when the change touches routing, base `href`, deploy scripts,
  or `.github/workflows/deploy-github-pages.yml` — see the `foundations:definition-of-done`
  skill.
- **PR done**: full sequence under Test / CI parity above, green. Commit, push, or open a PR
  only when the user asks.

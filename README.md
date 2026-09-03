<h1 align="center">GOTTA CATCH EM ALL</h1>

<p align="center">
  <samp>
    <b>╔══════════════════════════════════════════════════════════════════╗</b><br>
    <b>║</b>  <code>░░</code> <strong>SPECIAL ATTACK ONLY</strong> <code>░░</code> <strong>POKEAPI</strong> <code>░░</code> <strong>ANGULAR 22</strong> <code>░░</code>  <b>║</b><br>
    <b>║</b>  <code>░░</code> <strong>STICKER SHELL · MAX VOLUME UI</strong> <code>░░</code>                      <b>║</b><br>
    <b>╠══════════════════════════════════════════════════════════════════╣</b><br>
    <b>║</b>  cream canvas · halftone + stripe wash · rim shadows · neon CTAs <b>║</b><br>
    <b>║</b>  Fredoka / Bebas · arcade cabinet SFX bus · battle ribbons       <b>║</b><br>
    <b>╚══════════════════════════════════════════════════════════════════╝</b>
  </samp>
</p>

<p align="center">
  <a href="https://angular.dev/"><img src="https://img.shields.io/badge/ANGULAR-22.0-6f3cff?style=for-the-badge&logo=angular&logoColor=ffee33&labelColor=141414" alt="Angular 22 — accent-lilac-deep on outline"></a>
  <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TYPESCRIPT-6.0-ffee33?style=for-the-badge&logo=typescript&logoColor=141414&labelColor=6f3cff" alt="TypeScript — accent-primary on lilac-deep"></a>
  <a href="https://rxjs.dev/"><img src="https://img.shields.io/badge/RxJS-7.8-b388ff?style=for-the-badge&logo=reactivex&logoColor=ffee33&labelColor=141414" alt="RxJS — accent-lilac on outline"></a>
  <br>
  <a href="https://nodejs.org/"><img src="https://img.shields.io/badge/NODE-%3E%3D22.22-2ad4a8?style=for-the-badge&logo=node.js&logoColor=141414&labelColor=ead9ff" alt="Node.js — accent-mint on surface-muted"></a>
  <a href="https://pokeapi.co/"><img src="https://img.shields.io/badge/POKEAPI-v2-ff4dad?style=for-the-badge&logo=pokemon&logoColor=ffee33&labelColor=141414" alt="PokeAPI — accent-pink"></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/LICENSE-MIT-ffee33?style=for-the-badge&logo=opensourceinitiative&logoColor=141414&labelColor=6f3cff" alt="MIT License"></a>
</p>

<p align="center">
  <img src="./docs/readme-ui-palette.svg" width="900" alt="UI palette swatches: canvas cream, muted lavender, neon yellow, electric purple, hot pink, mint, arcade cyan — matching src/styles/_tokens.scss" />
</p>

<p align="center">
  <sub>Badges + strip use the same hex as <a href="src/styles/_tokens.scss"><code>src/styles/_tokens.scss</code></a> (<code>:root</code>) — cream canvas, <code>#ffee33</code> punch, <code>#6f3cff</code> depth, <code>#00e5c8</code> arcade focus ring, <code>#ff4dad</code> accent pop.</sub>
</p>

<p align="center">
  <strong>PICK BY TYPE → RANDOM RIVAL → ONE STAT DECIDES THE ROOM.</strong><br>
  <em>Winner = higher <code>special-attack</code> base stat. Tie → <strong>opponent wins</strong>. Nothing else is scored.</em><br>
  <sub>Powered by <a href="https://pokeapi.co/">pokeapi.co</a> · loading / errors / retry stay on-screen · no silent dead-ends</sub>
</p>

---

## Contents

- [Overview](#overview--what-this-is-fast)
- [Source Map](#source-map--where-each-folder-points)
- [Features](#features--what-ships-in-the-box)
- [Prerequisites](#prerequisites--install-first)
- [Install, Run, Ship](#install-run-ship--clone-dev-build)
- [Configuration](#configuration--api--rival-id-cap)
- [CI](#ci--what-github-actions-runs)
- [Automation](#automation--what-runs-on-its-own)
- [Scripts](#scripts--npm-decoded)
- [Cursor](#cursor--legacy-compatibility-only)

---

## Start here

| I want to…                          | Go here                                                                                                      |
| :---------------------------------- | :----------------------------------------------------------------------------------------------------------- |
| **Play it right now**               | [danibsheehan.github.io/gotta-catch-em-all](https://danibsheehan.github.io/gotta-catch-em-all/) — no install |
| **Run it on my machine**            | [Prerequisites](#prerequisites--install-first) → [Install, Run, Ship](#install-run-ship--clone-dev-build)    |
| **Understand what it does**         | [Overview](#overview--what-this-is-fast) → [Features](#features--what-ships-in-the-box)                      |
| **Find where code lives**           | [Source Map](#source-map--where-each-folder-points)                                                          |
| **Change the API or opponent pool** | [Configuration](#configuration--api--rival-id-cap)                                                           |
| **See what CI and automation do**   | [CI](#ci--what-github-actions-runs) → [Automation](#automation--what-runs-on-its-own)                        |

---

## Overview — what this is, fast

> **Angular ~22** playground: **standalone** everything, `bootstrapApplication` + `app.config.ts`, **`@angular/animations`** (respects `prefers-reduced-motion: reduce` → noop). **RxJS 7** + **SCSS** global tokens under `src/styles/` — **colors, radii, sticker shadows, and grain** all flow from [`_tokens.scss`](src/styles/_tokens.scss) (`:root`); battle chrome partials **consume** those variables rather than inventing a second palette.
>
> You draft from a **per-type** menu; the app rolls an opponent and runs **`resolveSpecialAttackBattle()`** so the UI never reinvents win/loss rules. **Recent matchups** (session, **last 3**) remember the drama. **HTTP** hits PokeAPI **only** through **`PokeApiClient`**.

<details>
<summary><strong>▼ Extra palette rows → same <code>_tokens.scss</code> as the UI ▼</strong></summary>

| CSS variable          | Hex       | Where it shows up                                   |
| :-------------------- | :-------- | :-------------------------------------------------- |
| `--border-outline`    | `#141414` | Panel rims, sticker outlines, high-contrast strokes |
| `--text-secondary`    | `#4a3566` | Softer body / hints on pastel surfaces              |
| `--accent-lilac`      | `#b388ff` | Mid lavender, gradients, secondary fills            |
| `--surface-wash-mint` | `#bfffec` | Arena wash / mint-tinted surfaces                   |
| `--surface-elevated`  | `#ffffff` | Cards and elevated strips (see SVG runway)          |
| `--border-subtle`     | `#c9a8ff` | Soft dividers, chip rails                           |
| `--semantic-danger`   | `#ff2d6b` | Errors / destructive emphasis                       |
| `--chip-border`       | `#b898f0` | Type chips and selector chrome                      |

Update this table and [`docs/readme-ui-palette.svg`](docs/readme-ui-palette.svg) whenever you change `:root` values so the README stays honest.

</details>

---

## Source Map — where each folder points

**In plain English:** each folder below owns one piece of the app — pick the row that matches what you're touching.

| Zone             | Path                                                                                                                                                                                                               |
| :--------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **SHELL**        | `src/app/app.component.*`, `app.config.ts`                                                                                                                                                                         |
| **GLOBAL LOOK**  | `src/styles.scss` pulls `_tokens.scss`, `_arena-type-wash.scss`, `_battle-chrome.scss`, `_battle-panel-frames.scss`; type chips → `_pokemon-type-chips.scss`                                                       |
| **CORE · HTTP**  | `src/app/core/api/` — **PokeAPI only** via `PokeApiClient`                                                                                                                                                         |
| **CORE · AUDIO** | `src/app/core/audio/` — `AudioService` (ticks + battle stings, autoplay-safe)                                                                                                                                      |
| **MODELS**       | `src/app/shared/models/` (`Pokemon`, types, type list)                                                                                                                                                             |
| **BATTLE**       | `src/app/features/battle/` — `PokemonBattleService`, player/opponent services, `battle-history.service`, `special-attack-battle.ts`, `type-matchup-flavor.ts`, `pokemon-battle-result/`, `battle-recent-matchups/` |
| **PICKER**       | `src/app/features/pokemon-picker/` — `pokemon-catalog.service`, `pokemon-selector/`, `pokemon-type/`                                                                                                               |
| **DISPLAY**      | `src/app/features/pokemon-display/` — `pokemon-details/`, `pokemon-card/` (`app-pokemon`)                                                                                                                          |

---

## Features — what ships in the box

**In plain English:** here's what happens, in order, from opening the app to seeing a winner.

|        Feature        | What happens                                                                                                                                                             |
| :-------------------: | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Deferred loading**  | Type-picker region loads with **`@defer`** (viewport + idle prefetch) so the **battle shell paints first**.                                                              |
|    **Type menus**     | Type index from PokeAPI → **one collapsible menu per type**; names hydrate on **first open**.                                                                            |
| **Full Pokémon card** | **`pokemon`** record fetch on **confirm**.                                                                                                                               |
|  **Random opponent**  | Random opponent id **`1…maxPokemonSpeciesId`** (upper bound from env; often **964**), sprite **preload**, **try again** if opponent fetch fails.                         |
|  **Battle verdict**   | **`resolveSpecialAttackBattle()`** + `PokemonBattleResultComponent` timing/UI + **`BattleHistoryService.recordMatch`**. Optional **type-pair flavor** (not damage math). |
|   **Sound effects**   | **Sound off by default** — arcade tick on pick, sting on result; header toggle; `localStorage` **`gcea-sound-effects`**.                                                 |
|  **Recent matchups**  | Up to **three** per tab — `sessionStorage`, in-memory fallback if storage is blocked.                                                                                    |
|  **Cached lookups**   | `shareReplay(1)` on the **type index** + **per-type lists** — don't blast duplicate HTTP.                                                                                |
|     **Safe URLs**     | Path segments encoded for PokeAPI (weird names survive).                                                                                                                 |

---

## Prerequisites — install first

| Requirement              | Notes                                                                    |
| :----------------------- | :----------------------------------------------------------------------- |
| **Node.js `>= 22.22.3`** | Matches `package.json` `engines`, `.nvmrc`, and CI (Angular 22 minimum). |
| **nvm** _(optional)_     | Run **`nvm use`** — `.nvmrc` pins **`22.22.3`**.                         |

---

## Install, Run, Ship — clone, dev, build

```bash
# ═══ GRAB THE REPO ═══
git clone https://github.com/danibsheehan/gotta-catch-em-all.git
cd gotta-catch-em-all
npm install
```

**DEV — HOT RELOAD ARENA**

```bash
npm start
```

→ **[http://localhost:4200/](http://localhost:4200/)**

**PROD BUILD + STATIC SERVE**

```bash
npm run build
npm run serve:dist
```

Use whatever URL **`serve:dist`** prints (often **`http://localhost:8080/`**).

**GITHUB PAGES — BASE HREF LOCKED IN**

```bash
npm run build:github-pages
```

---

<details>
<summary><strong>▼ Who owns what — services + HTTP ▼</strong></summary>

| Symbol / area                   | Responsibility                                                                                                                                               |
| :------------------------------ | :----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `PokeApiClient`                 | Thin HTTP client for PokeAPI v2 (`src/app/core/api/`).                                                                                                       |
| `AudioService`                  | Optional Web Audio SFX (`src/app/core/audio/`): `soundEnabled$`, `playUiTick()`, `playBattleResult()`; unlock/resume follows autoplay rules.                 |
| `PokemonCatalogService`         | Cached type index and per-type lists (`shareReplay`) in `features/pokemon-picker/`.                                                                          |
| `PokemonPlayerService`          | Player selection (`features/battle/`): `getPokemonDetails`, `pokemonDetails` / `pokemonDetailsError`.                                                        |
| `PokemonOpponentService`        | Random opponent id, `getPokemonById`, sprite URL (`features/battle/`).                                                                                       |
| `PokemonBattleService`          | Unified battle state: `vm$` (`PokemonBattleVm`), `loadOpponent()`, `selectPlayerPokemon()`, `playAgain()`, split streams (`playerDetails$`, `opponent$`, …). |
| `BattleHistoryService`          | `entries$`, `recordMatch()`; newest three in `sessionStorage` (`gcea-battle-history-v1`).                                                                    |
| `BattleRecentMatchupsComponent` | Reads `entries$`, formats recent lines.                                                                                                                      |
| `getPokemonTypes()`             | `GET /type/` — paginated type list.                                                                                                                          |
| `getPokemonByType(typeName)`    | `GET /type/{typeName}` — Pokémon in that type.                                                                                                               |
| `getPokemonDetails(name)`       | `GET /pokemon/{name}` — full details or error stream.                                                                                                        |
| `getPokemonById(id)`            | `GET /pokemon/{id}` — opponent path.                                                                                                                         |
| `pickRandomOpponentId()`        | Random int `1…environment.maxPokemonSpeciesId`.                                                                                                              |
| `PokemonSelectorComponent`      | Type index after first render (`afterNextRender`); `@defer` in `AppComponent`.                                                                               |
| `PokemonTypeComponent`          | Dropdown; names on first open; `selectPlayerPokemon` on battle service.                                                                                      |
| `resolveSpecialAttackBattle()`  | Pure helper — **special-attack** compare, messages, victor; **UI must not reimplement rules**.                                                               |
| `PokemonBattleResultComponent`  | Presentation + delay; `recordMatch` when winner known.                                                                                                       |
| `AppComponent`                  | Battle shell from `vm$`; sound toggle; deferred selector; recent matchups below fold.                                                                        |

</details>

---

## Configuration — API + rival ID cap

**In plain English:** these three values live in `environment*.ts` and control which API `PokeApiClient` talks to and how big the opponent roster is.

| Field                        | Where             | Description                                                 |
| :--------------------------- | :---------------- | :---------------------------------------------------------- |
| `pokeApi.baseUrl`            | `environment*.ts` | PokeAPI v2 root (**no** trailing slash).                    |
| `pokeApi.frontSpriteBaseUrl` | `environment*.ts` | Base URL for opponent **front** sprites by national dex id. |
| `maxPokemonSpeciesId`        | `environment*.ts` | **Inclusive** upper bound when rolling random opponent id.  |

`PokeApiClient` assembles HTTP from these values. Point at a mock or mirror, **rebuild**. Production swaps in `environment.prod.ts` via `angular.json` file replacement.

---

## CI — what GitHub Actions runs

**In plain English:** every push and pull request runs formatting checks; app changes also get linting, a security audit, type-checked build, and tests — each as its own separate required check.

Pushes to **`main`** and pull requests run **`verify.yml`** (via dani-actions' shared `npm-verify.yml`), as separate parallel jobs — one required check per concern:

| Check                       | Command / check                                                                                                                              |
| :-------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------- |
| **`verify / format (app)`** | `npm run format:check` — always runs, even on docs-only PRs                                                                                  |
| **`verify / lint (app)`**   | `npm run lint` — skipped on docs/skills-only PRs (still reports green)                                                                       |
| **`verify / audit (app)`**  | `npm audit --audit-level=high` — skipped on docs/skills-only PRs                                                                             |
| **`verify / test (app)`**   | Chrome + `npm run test:ci` with coverage — skipped on docs/skills-only PRs                                                                   |
| **`verify / build (app)`**  | Pages-ready `ng build` (Angular's AOT compile already type-checks, so there's no separate typecheck check) — skipped on docs/skills-only PRs |

**GitHub Pages:** deploy lives in its own **`deploy-pages.yml`**, triggered directly on push to `main` — it does its own `ng build` rather than reusing an artifact from `verify.yml`, since the two are separate files with separate triggers. Local parity: `npm run format:check && npm run lint && npm run test:ci && npm run build` (and `npm audit --audit-level=high` when touching deps).

---

## Automation — what runs on its own

**In plain English:** CodeQL scans on its own schedule, and grouped npm minor/patch Dependabot
PRs auto-merge once required checks pass — everything else (npm majors, GitHub Actions bumps)
still gets a human review before it merges.

- **CodeQL** ([`codeql.yml`](.github/workflows/codeql.yml)) — scans the Angular/TypeScript app on
  push to `main`, on every PR, and weekly (Monday), flagging known vulnerability patterns. No
  auto-merge, no LLM — plain GitHub code scanning.
- **Dependency review** ([`dependency-review.yml`](.github/workflows/dependency-review.yml)) —
  flags newly-introduced vulnerable or license-incompatible dependencies in a PR's diff, before
  merge.
- **PR guide** ([`pr-guide.yml`](.github/workflows/pr-guide.yml)) — scaffolds an empty PR
  description, posts a sticky checklist/reviewer-focus comment, and applies path-based `area:*`
  labels (same-repo PRs only).
- **Dependabot auto-merge** ([`dependabot-auto-merge.yml`](.github/workflows/dependabot-auto-merge.yml))
  — auto-merges (squash) only the grouped `npm-minor-and-patch` Dependabot PRs once required
  checks pass. Ungrouped npm majors and GitHub Actions bumps from `.github/dependabot.yml` stay
  manual — reviewed and merged by hand.
- **`dependabot-triage` skill** — not ported to this repo yet either; the Dependabot backlog here
  is small enough to review directly.
- **Cross-repo, read-only**: a scheduled Claude Code routine, defined in
  [`danibsheehan/portfolio-automation`](https://github.com/danibsheehan/portfolio-automation)'s
  [`weekly-project-update`](https://github.com/danibsheehan/portfolio-automation/blob/main/.claude/skills/weekly-project-update/SKILL.md)
  skill, reads this repo once a week (never writes to it) and — only when there's something
  people-relevant to report — opens a PR against
  [danibsheehan.github.io](https://github.com/danibsheehan/danibsheehan.github.io) updating this
  project's page. See
  [`portfolio-automation`'s README](https://github.com/danibsheehan/portfolio-automation#autonomy-boundary)
  for the full autonomy boundary (it opens, never merges).

---

## Scripts — npm, decoded

**In plain English:** these are the npm commands you'll actually type day to day.

| Script                       | What it does                                                    |
| :--------------------------- | :-------------------------------------------------------------- |
| `npm start`                  | Dev server (`ng serve`).                                        |
| `npm run build`              | Production build → `dist/gotta-catch-em-all/browser/`.          |
| `npm run build:dev`          | Dev build (no prod env replacement).                            |
| `npm run build:github-pages` | Prod build + GitHub Pages base href **`/gotta-catch-em-all/`**. |
| `npm run serve:dist`         | Serves prod output on port **8080** (after `npm run build`).    |
| `npm run lint`               | ESLint (Angular ESLint).                                        |
| `npm run format`             | Format the repo with Prettier.                                  |
| `npm run format:check`       | Check Prettier formatting (CI).                                 |
| `npm test`                   | Vitest via Angular unit-test builder (**watch**).               |
| `npm run test:ci`            | Single Vitest run with coverage thresholds.                     |

---

## Cursor — legacy compatibility only

This project is developed with Claude Code. Conventions live directly in
[`AGENTS.md`](AGENTS.md) / [`CLAUDE.md`](CLAUDE.md) — there are no separate
`.cursor/rules/*.mdc` files. `.cursor/skills` is kept only as a symlink to the canonical
`.claude/skills/` directory, for compatibility if this repo is opened in Cursor.

| Path                                   | Purpose                                                                                                                                          |
| :------------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------- |
| `.claude/skills/*/`                    | Canonical skills: definition-of-done (includes `format:check`), GitHub Pages, PokeAPI/RxJS, Vitest, doc writer — `.cursor/skills` symlinks here. |
| `.prettierrc.json` / `.prettierignore` | Prettier style + ignore list — agents and CI follow these; use `npm run format` / `format:check`.                                                |

```
██████████████████████████████████████████████████████████████████████████████
```

<p align="center">
  <samp>
    <b>╔════════════════════════════════════╗</b><br>
    <b>║</b>  <strong>LICENSE: MIT</strong>  —  <a href="LICENSE"><code>LICENSE</code></a>  <b>║</b><br>
    <b>╚════════════════════════════════════╝</b>
  </samp><br>
  <sub>THANKS FOR PLAYING · STAY LOUD · KEEP THE NEON ON</sub>
</p>

# Gotta Catch Em All

> Angular 20 sample app: pick a Pokémon by type, fight a random opponent, and resolve the match from **Special Attack** stats via [PokeAPI](https://pokeapi.co/).

## Overview

This project is a small browser game for experimenting with Angular, `HttpClient`, and RxJS against a public REST API. You choose your fighter from a per-type menu; the app assigns a random opponent and compares each Pokémon’s `special-attack` base stat to pick a winner. Resolved matchups can appear in **Recent matchups** (session-scoped, last three). The UI surfaces loading and error states (including retry) so failed fetches do not leave the screen stuck.

**Stack:** Angular ~20.3 (standalone components, `bootstrapApplication` + `app.config.ts`), Angular Animations (`@angular/animations`), RxJS 7, SCSS (global tokens in `src/styles/`), Karma/Jasmine.

## Source layout

| Area | Path |
| --- | --- |
| App shell | `src/app/app.component.*`, `app.config.ts` |
| Global styles | `src/styles.scss` imports tokens and battle/arena partials: `_tokens.scss`, `_arena-type-wash.scss`, `_battle-chrome.scss`, `_battle-panel-frames.scss`. Picker type chips use `_pokemon-type-chips.scss`. |
| Core (HTTP API client) | `src/app/core/api/` |
| Shared models | `src/app/shared/models/` (`Pokemon`, types, type list) |
| Battle feature | `src/app/features/battle/` — `PokemonBattleService`, player / opponent services, `battle-history.service`, `special-attack-battle.ts`, `pokemon-battle-result/`, `battle-recent-matchups/` |
| Picker feature | `src/app/features/pokemon-picker/` — `pokemon-catalog.service`, `pokemon-selector/`, `pokemon-type/` |
| Display feature | `src/app/features/pokemon-display/` — `pokemon-details/`, `pokemon-card/` (`app-pokemon`) |

## Features

- Loads the type index from PokeAPI and renders one collapsible menu per type (names for a type load when you first open that menu). The type-picker region is loaded with `@defer` (viewport + idle prefetch) so the battle shell can paint first.
- Fetches full `pokemon` records when you confirm a selection.
- Draws a random opponent (numeric id in `1…964`), preloads its front sprite for faster paint, and exposes **try again** when the opponent request fails.
- Declares battle outcome via `resolveSpecialAttackBattle()`; `PokemonBattleResultComponent` handles timing, display, and recording the result to `BattleHistoryService`.
- Shows up to three **Recent matchups** for the tab session (`sessionStorage`, with in-memory fallback if storage is unavailable).
- Caches type list and per-type Pokémon list responses with `shareReplay(1)` to avoid duplicate HTTP calls.
- URL-encodes path segments when calling PokeAPI (handles names with spaces or special characters).

## Prerequisites

- **Node.js** `>= 20.19.0` (matches `package.json` `engines` and current Angular CLI expectations).
- Optional: [nvm](https://github.com/nvm-sh/nvm) — this repo includes `.nvmrc` (`22.12.0`) if you pin versions that way.

## Installation

```bash
git clone https://github.com/danibsheehan/gotta-catch-em-all.git
cd gotta-catch-em-all
npm install
```

## Quick Start

```bash
npm start
```

Open [http://localhost:4200/](http://localhost:4200/).

**Production build + static preview:**

```bash
npm run build
npm run serve:dist
```

Then open the URL `serve:dist` prints (for example `http://localhost:8080/`).

**GitHub Pages–style base href:**

```bash
npm run build:github-pages
```

## API Reference (app)

| Symbol / area | Responsibility |
| --- | --- |
| `PokeApiClient` | Thin HTTP client for PokeAPI v2 (`src/app/core/api/`). |
| `PokemonCatalogService` | Cached type index and per-type Pokémon lists (`shareReplay`) in `features/pokemon-picker/`. |
| `PokemonPlayerService` | Player selection (`features/battle/`): `getPokemonDetails`, `pokemonDetails` / `pokemonDetailsError` streams. |
| `PokemonOpponentService` | Random opponent id, `getPokemonById`, sprite URL (`features/battle/`). |
| `PokemonBattleService` | Unified battle state (`features/battle/`): `vm$` (`PokemonBattleVm`: opponent/player loading, partial Pokémon, player error), `loadOpponent()`, `selectPlayerPokemon()`, `playAgain()` (clears player, notifies `closeSelectorDropdowns$`, reloads opponent), split streams (`playerDetails$`, `opponent$`, etc.). |
| `BattleHistoryService` | `features/battle/` — `entries$` and `recordMatch()`; keeps newest three `BattleHistoryEntry` values in `sessionStorage` (`gcea-battle-history-v1`). |
| `BattleRecentMatchupsComponent` | `features/battle/battle-recent-matchups/` — reads `BattleHistoryService.entries$` and formats lines for the list. |
| `getPokemonTypes()` | `GET /type/` — returns the paginated type list (names + URLs). |
| `getPokemonByType(typeName)` | `GET /type/{typeName}` — returns brief entries for Pokémon in that type. |
| `getPokemonDetails(name)` | `GET /pokemon/{name}` — pushes full details into `pokemonDetails` or sets `pokemonDetailsError`. |
| `getPokemonById(id)` | `GET /pokemon/{id}` — used for the opponent and for `getPokemonOpponent()`. |
| `pickRandomOpponentId()` | Returns a random integer from 1 through `environment.maxPokemonSpeciesId`. |
| `PokemonSelectorComponent` | `features/pokemon-picker/` — after first render, loads the type index (`afterNextRender`); wrapped by `@defer` in `AppComponent` for viewport-based loading. |
| `PokemonTypeComponent` | `features/pokemon-picker/` — dropdown, loads names on first open, `selectPlayerPokemon` on battle service. |
| `resolveSpecialAttackBattle()` | Pure helper in `features/battle/special-attack-battle.ts` — **special-attack** comparison, messages, victor. |
| `PokemonBattleResultComponent` | `features/battle/pokemon-battle-result/` — presentation + 2s delay; calls `BattleHistoryService.recordMatch` when a winner is known. |
| `AppComponent` | Battle shell from `PokemonBattleService.vm$` (opponent retry → `battle.loadOpponent()`); deferred `app-pokemon-selector`; `app-battle-recent-matchups` below the fold. |

## Configuration

| Field | Where | Description |
| --- | --- | --- |
| `pokeApi.baseUrl` | `environment*.ts` | PokeAPI v2 root (no trailing slash). |
| `pokeApi.frontSpriteBaseUrl` | `environment*.ts` | Base URL for opponent front sprites by national dex id. |
| `maxPokemonSpeciesId` | `environment*.ts` | Inclusive upper bound when rolling a random opponent id. |

`PokeApiClient` assembles HTTP requests from these values. Swap URLs for a mock server or mirror, then rebuild; production uses `environment.prod.ts` via `angular.json` file replacement.

## Contributing

| Script | Purpose |
| --- | --- |
| `npm start` | Dev server (`ng serve`). |
| `npm run build` | Production build; static assets land in `dist/gotta-catch-em-all/browser/`. |
| `npm run build:dev` | Development build (no prod env replacement). |
| `npm run build:github-pages` | Production build with GitHub Pages `base-href` (`/gotta-catch-em-all/`). |
| `npm run serve:dist` | Serves the production output folder on port 8080 (after `npm run build`). |
| `npm run lint` | ESLint (Angular ESLint). |
| `npm test` | Karma + Chrome (watch mode). |
| `npm run test:ci` | Single run, headless Chrome with `--no-sandbox` (CI-friendly). |

If `npm test` fails with **ChromeHeadless cannot start**, run `npm run test:ci`. On macOS you can point Karma at a known Chrome binary:

```bash
CHROME_BIN="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" npm run test:ci
```

## Cursor (optional)

This repo ships **Cursor** context under `.cursor/` (not required to run or build the app):

| Path | Purpose |
| --- | --- |
| `.cursor/rules/gotta-catch-em-all-conventions.mdc` | Project conventions for the AI (layout, API boundaries, battle helper, styles). |
| `.cursor/skills/*/` | Task-focused skills (e.g. definition-of-done checks, GitHub Pages notes, PokeAPI/RxJS patterns, Karma/Jasmine test generation, doc writing). |

## License

MIT. See [`LICENSE`](LICENSE).

# Gotta Catch Em All

> Angular 20 sample app: pick a Pokémon by type, fight a random opponent, and resolve the match from **Special Attack** stats via [PokeAPI](https://pokeapi.co/).

## Overview

This project is a small browser game for experimenting with Angular, `HttpClient`, and RxJS against a public REST API. You choose your fighter from a per-type menu; the app assigns a random opponent and compares each Pokémon’s `special-attack` base stat to pick a winner. The UI surfaces loading and error states (including retry) so failed fetches do not leave the screen stuck.

**Stack:** Angular ~20.3 (standalone components, `bootstrapApplication` + `app.config.ts`), Angular Animations (`@angular/animations`), RxJS 7, SCSS (global tokens in `src/styles/`), Karma/Jasmine.

## Source layout

| Area | Path |
| --- | --- |
| App shell | `src/app/app.component.*`, `app.config.ts` |
| Global styles | `src/styles.scss`, `src/styles/_tokens.scss` (CSS variables, theme) |
| Core (HTTP API client) | `src/app/core/api/` |
| Shared models | `src/app/shared/models/` (`Pokemon`, types, type list) |
| Battle feature | `src/app/features/battle/` — services (battle / player / opponent), `special-attack-battle.ts`, `pokemon-battle-result/` |
| Picker feature | `src/app/features/pokemon-picker/` — `pokemon-catalog.service`, `pokemon-selector/`, `pokemon-type/` |
| Display feature | `src/app/features/pokemon-display/` — `pokemon-details/`, `pokemon-card/` (`app-pokemon`) |

## Features

- Loads the type index from PokeAPI and renders one collapsible menu per type (names for a type load when you first open that menu).
- Fetches full `pokemon` records when you confirm a selection.
- Draws a random opponent (numeric id in `1…964`), preloads its front sprite for faster paint, and exposes **Choose Again** when the opponent request fails.
- Declares battle outcome via `resolveSpecialAttackBattle()`; `PokemonBattleResultComponent` handles only timing and display.
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
| `PokemonBattleService` | Unified battle state (`features/battle/`): `vm$`, `loadOpponent()` / `selectPlayerPokemon()`. |
| `getPokemonTypes()` | `GET /type/` — returns the paginated type list (names + URLs). |
| `getPokemonByType(typeName)` | `GET /type/{typeName}` — returns brief entries for Pokémon in that type. |
| `getPokemonDetails(name)` | `GET /pokemon/{name}` — pushes full details into `pokemonDetails` or sets `pokemonDetailsError`. |
| `getPokemonById(id)` | `GET /pokemon/{id}` — used for the opponent and for `getPokemonOpponent()`. |
| `pickRandomOpponentId()` | Returns a random integer from 1 through `environment.maxPokemonSpeciesId`. |
| `PokemonSelectorComponent` | `features/pokemon-picker/` — defers the initial type request until after first render. |
| `PokemonTypeComponent` | `features/pokemon-picker/` — dropdown, loads names on first open, `selectPlayerPokemon` on battle service. |
| `resolveSpecialAttackBattle()` | Pure helper in `features/battle/special-attack-battle.ts` — **special-attack** comparison, messages, victor. |
| `PokemonBattleResultComponent` | `features/battle/pokemon-battle-result/` — presentation + 2s delay. |
| `AppComponent` | Renders the battle UI from `PokemonBattleService.vm$` (retry calls `battle.loadOpponent()`). |

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
| `npm run lint` | ESLint (Angular ESLint). |
| `npm test` | Karma + Chrome (watch mode). |
| `npm run test:ci` | Single run, headless Chrome with `--no-sandbox` (CI-friendly). |

If `npm test` fails with **ChromeHeadless cannot start**, run `npm run test:ci`. On macOS you can point Karma at a known Chrome binary:

```bash
CHROME_BIN="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" npm run test:ci
```

## License

MIT. See [`LICENSE`](LICENSE).

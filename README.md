# Gotta Catch Em All

> Angular 20 sample app: pick a Pokémon by type, fight a random opponent, and resolve the match from **Special Attack** stats via [PokeAPI](https://pokeapi.co/).

## Overview

This project is a small browser game for experimenting with Angular, `HttpClient`, and RxJS against a public REST API. You choose your fighter from a per-type menu; the app assigns a random opponent and compares each Pokémon’s `special-attack` base stat to pick a winner. The UI surfaces loading and error states (including retry) so failed fetches do not leave the screen stuck.

**Stack:** Angular ~20.3 (standalone components, `bootstrapApplication` + `app.config.ts`), RxJS 7, SCSS, Karma/Jasmine.

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
| `PokemonCatalogService` | Cached type index and per-type Pokémon lists (`shareReplay`). |
| `PokemonPlayerService` | Player selection: `getPokemonDetails`, `pokemonDetails` / `pokemonDetailsError` streams. |
| `PokemonOpponentService` | Random opponent id, `getPokemonById`, default sprite URL, `getPokemonOpponent()`. |
| `PokemonBattleService` | Unified battle state: opponent loading + Pokémon via `switchMap`, player via `PokemonPlayerService`, `vm$` for the shell, `loadOpponent()` / `selectPlayerPokemon()`. |
| `getPokemonTypes()` | `GET /type/` — returns the paginated type list (names + URLs). |
| `getPokemonByType(typeName)` | `GET /type/{typeName}` — returns brief entries for Pokémon in that type. |
| `getPokemonDetails(name)` | `GET /pokemon/{name}` — pushes full details into `pokemonDetails` or sets `pokemonDetailsError`. |
| `getPokemonById(id)` | `GET /pokemon/{id}` — used for the opponent and for `getPokemonOpponent()`. |
| `pickRandomOpponentId()` | Returns a random integer from 1 through `environment.maxPokemonSpeciesId`. |
| `PokemonSelectorComponent` | Defers the initial type request until after first render. |
| `PokemonTypeComponent` | Opens a type dropdown, loads names on first open, calls `selectPlayerPokemon` on the battle service when you pick a species. |
| `resolveSpecialAttackBattle()` | Pure domain helper in `src/app/domain/special-attack-battle.ts`: compares **special-attack** base stats, user win / loss copy, victor. |
| `PokemonBattleResultComponent` | Presentation + 2s delay; delegates outcome to `resolveSpecialAttackBattle`. |
| `AppComponent` | Renders the battle UI from `PokemonBattleService.vm$` (retry calls `battle.loadOpponent()`). |

## Configuration

API root URLs and dex upper bound live in `src/environments/environment*.ts` (`pokeApi.baseUrl`, `pokeApi.frontSpriteBaseUrl`, `maxPokemonSpeciesId`). `PokeApiClient` builds request URLs from those values.

To point at a mock server or another deployment, change those environment fields (and rebuild).

## Contributing

| Script | Purpose |
| --- | --- |
| `npm start` | Dev server (`ng serve`). |
| `npm run build` | Production build to `dist/gotta-catch-em-all/`. |
| `npm run lint` | ESLint (Angular ESLint). |
| `npm test` | Karma + Chrome (watch mode). |
| `npm run test:ci` | Single run, headless Chrome with `--no-sandbox` (CI-friendly). |

If `npm test` fails with **ChromeHeadless cannot start**, run `npm run test:ci`. On macOS you can point Karma at a known Chrome binary:

```bash
CHROME_BIN="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" npm run test:ci
```

## License

MIT. See [`LICENSE`](LICENSE).

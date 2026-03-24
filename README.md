# Gotta Catch Em All

> Angular 20 sample app: pick a Pokémon by type, fight a random opponent, and resolve the match from **Special Attack** stats via [PokeAPI](https://pokeapi.co/).

## Overview

This project is a small browser game for experimenting with Angular, `HttpClient`, and RxJS against a public REST API. You choose your fighter from a per-type menu; the app assigns a random opponent and compares each Pokémon’s `special-attack` base stat to pick a winner. The UI surfaces loading and error states (including retry) so failed fetches do not leave the screen stuck.

**Stack:** Angular ~20.3, RxJS 7, SCSS, Karma/Jasmine.

## Features

- Loads the type index from PokeAPI and renders one collapsible menu per type (names for a type load when you first open that menu).
- Fetches full `pokemon` records when you confirm a selection.
- Draws a random opponent (numeric id in `1…964`), preloads its front sprite for faster paint, and exposes **Choose Again** when the opponent request fails.
- Declares battle outcome in `PokemonBattleResultComponent` by comparing `stats` entries for `special-attack`.
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
| `PokemonListService` | HTTP access, caching, opponent id helper, default sprite URL helper. |
| `getPokemonTypes()` | `GET /api/v2/type/` — returns the paginated type list (names + URLs). |
| `getPokemonByType(typeName)` | `GET /api/v2/type/{typeName}` — returns brief entries for Pokémon in that type. |
| `getPokemonDetails(name)` | `GET /api/v2/pokemon/{name}` — pushes full details into `pokemonDetails` or sets `pokemonDetailsError`. |
| `getPokemonById(id)` | `GET /api/v2/pokemon/{id}` — used for the opponent and for `getPokemonOpponent()`. |
| `pickRandomOpponentId()` | Returns a random integer from 1 through 964. |
| `PokemonSelectorComponent` | Defers the initial type request until after first render. |
| `PokemonTypeComponent` | Opens a type dropdown, loads names on first open, calls `getPokemonDetails` on selection. |
| `PokemonBattleResultComponent` | Reads both fighters’ stats and determines the winner from **special-attack**. |
| `AppComponent` | Loads the opponent on init, preloads sprite, handles opponent errors and retry. |

## Configuration

PokeAPI URLs live in code today, not in `environment` files:

| Concern | Location | Value / notes |
| --- | --- | --- |
| Type index | `pokemon-list.service.ts` | `https://pokeapi.co/api/v2/type/` |
| Type detail | same | `https://pokeapi.co/api/v2/type/{name}` |
| Pokémon by name or id | same | `https://pokeapi.co/api/v2/pokemon/{nameOrId}` |
| Sprite CDN | `PokemonListService.defaultFrontSpriteUrl` | `raw.githubusercontent.com/PokeAPI/sprites/...` |

To support multiple deployments or a mock server, move these into `src/environments/environment*.ts` and inject or import them in the service.

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

---
name: pokeapi-rxjs
description: PokeAPI access and RxJS usage in gotta-catch-em-all—PokeApiClient, caching, and error handling at feature layer. Use when adding or changing HTTP calls, PokeAPI endpoints, or RxJS pipes in this app.
---

# PokeAPI + HTTP / RxJS (gotta-catch-em-all)

## Single HTTP surface

- Add new PokeAPI calls on **`PokeApiClient`** (`src/app/core/api/poke-api.client.ts`) using `environment.pokeApi.baseUrl` (no trailing slash on base; paths like `/type/`, `/pokemon/{segment}`).
- **Encode path segments** the same way as existing methods: names and ids can include characters that must not break URLs—use the private `encodePathSegment` pattern for any new path parameter.

## Environment

- **`environment.pokeApi`**: `baseUrl`, `frontSpriteBaseUrl`, and **`maxPokemonSpeciesId`** for random opponent ids. Adjust bounds only when PokeAPI’s dex coverage changes.

## Caching streams

- **Type list** and **per-type Pokémon lists** are cached in **`PokemonCatalogService`** (`src/app/features/pokemon-picker/`) with `shareReplay(1)` behind private fields. Extending this service: keep one shared observable per resource; do not replace cached observables on every call.

## Errors and retries (feature layer)

- **`PokeApiClient`** stays a thin `HttpClient` wrapper. **Do not** add global `catchError` there unless the project standard changes.
- Loading/error UX (e.g. **catchError**, **finalize**, retry buttons) lives in **feature services/components** (see battle and picker code). New flows should follow that pattern: surface failures and allow retry in the UI.

## Battle data

- Opponent/player fetch details feed **`resolveSpecialAttackBattle()`**; ensure `stats` include the `special-attack` stat from API responses when testing battle outcomes.

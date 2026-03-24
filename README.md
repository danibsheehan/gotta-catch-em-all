# Gotta Catch Em All
> Angular Pokemon battle game that lets you choose a fighter by type and battle a random opponent.

## Overview
Gotta Catch Em All is a client-side Angular app powered by the [PokeAPI](https://pokeapi.co/).
You pick a Pokemon by opening a type dropdown, then selecting a Pokemon from that type.
The app fetches a random opponent and runs a simple battle based on each Pokemon's `special-attack` stat.
The higher `special-attack` value wins.

## Features
- Loads Pokemon types from PokeAPI.
- Preloads Pokemon names for each type from `getPokemonTypes()`.
- Shows type-specific dropdowns immediately (no click-to-load behavior).
- Fetches full Pokemon details when you select a Pokemon.
- Picks a random opponent from the Pokemon list.
- Simulates battle outcome using `special-attack` comparison.
- Displays the winning Pokemon and match result message.
- Handles opponent-load failure with a retry action.

## Installation
```bash
npm install
```

## Prerequisites
- Node.js `v20.19+` (or `v22.12+`) is required by the Angular CLI used in this project.
- This repo includes `/.nvmrc` set to `22.12.0` for `nvm` users.

## Quick Start
```bash
npm start
```

Open `http://localhost:4200/` in your browser.

## API Reference
Core app pieces:

- `PokemonListService`
  - `getPokemonTypes()`: Fetches all Pokemon types and enriches each type with its Pokemon list.
  - `getPokemonDetails(name)`: Fetches and publishes full details for one Pokemon.
  - `getPokemonOpponent()`: Fetches a random opponent by numeric ID.
- `PokemonTypeComponent`: Uses preloaded type Pokemon names and triggers selection.
- `PokemonBattleResultComponent`: Computes winner using each fighter's `special-attack` stat.

## Configuration
This app currently uses hardcoded PokeAPI endpoints in `PokemonListService`:

- `https://pokeapi.co/api/v2/type/`
- `https://pokeapi.co/api/v2/type/{name}`
- `https://pokeapi.co/api/v2/pokemon/{nameOrId}`

If you want environment-based API configuration, move these URLs into Angular environment files.

## Contributing
Use the standard Angular scripts while developing:

- `npm start` to run the dev server
- `npm test` to run unit tests
- `npm run test:ci` to run headless tests with a no-sandbox Chrome launcher
- `npm run build` to build production assets

If `npm test` fails with `ChromeHeadless cannot start`, try:

```bash
npm run test:ci
```

On macOS, if needed, set `CHROME_BIN` explicitly:

```bash
CHROME_BIN="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" npm run test:ci
```

## License
MIT. See `LICENSE`.

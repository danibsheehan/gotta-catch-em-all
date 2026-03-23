# Gotta Catch Em All
> Angular Pokemon battle game that lets you choose a fighter by type and battle a random opponent.

## Overview
Gotta Catch Em All is a client-side Angular app powered by the [PokeAPI](https://pokeapi.co/).
You pick a Pokemon by opening a type dropdown, then selecting a Pokemon from that type.
The app fetches a random opponent and runs a simple battle based on each Pokemon's `special-attack` stat.
The higher `special-attack` value wins.

## Features
- Loads Pokemon types from PokeAPI.
- Expands type-specific dropdowns and lazily loads Pokemon names for that type.
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

## Quick Start
```bash
npm start
```

Open `http://localhost:4200/` in your browser.

## API Reference
Core app pieces:

- `PokemonListService`
  - `getPokemonTypes()`: Fetches all Pokemon types.
  - `getPokemonByType(name)`: Fetches Pokemon list for a specific type.
  - `getPokemonDetails(name)`: Fetches and publishes full details for one Pokemon.
  - `getPokemonOpponent()`: Fetches a random opponent by numeric ID.
- `PokemonTypeComponent`: Loads Pokemon names for a selected type and triggers selection.
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
- `npm run build` to build production assets

## License
MIT. See `LICENSE`.

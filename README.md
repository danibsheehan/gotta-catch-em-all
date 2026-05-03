<h1 align="center">GOTTA CATCH EM ALL</h1>

<p align="center">
  <samp>
    <b>╔══════════════════════════════════════════════════════════════════╗</b><br>
    <b>║</b>  <code>░░</code> <strong>SPECIAL ATTACK ONLY</strong> <code>░░</code> <strong>POKEAPI</strong> <code>░░</code> <strong>ANGULAR 20</strong> <code>░░</code>  <b>║</b><br>
    <b>║</b>  <code>░░</code> <strong>STICKER SHELL · MAX VOLUME UI</strong> <code>░░</code>                      <b>║</b><br>
    <b>╠══════════════════════════════════════════════════════════════════╣</b><br>
    <b>║</b>  cream canvas · halftone + stripe wash · rim shadows · neon CTAs <b>║</b><br>
    <b>║</b>  Fredoka / Bebas · arcade cabinet SFX bus · battle ribbons       <b>║</b><br>
    <b>╚══════════════════════════════════════════════════════════════════╝</b>
  </samp>
</p>

<p align="center">
  <a href="https://angular.dev/"><img src="https://img.shields.io/badge/ANGULAR-20.3-6f3cff?style=for-the-badge&logo=angular&logoColor=ffee33&labelColor=141414" alt="Angular 20"></a>
  <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TYPESCRIPT-5.8-ffee33?style=for-the-badge&logo=typescript&logoColor=141414&labelColor=6f3cff" alt="TypeScript"></a>
  <a href="https://rxjs.dev/"><img src="https://img.shields.io/badge/RxJS-7.8-b388ff?style=for-the-badge&logo=reactivex&logoColor=141414&labelColor=141414" alt="RxJS"></a>
  <br>
  <a href="https://nodejs.org/"><img src="https://img.shields.io/badge/NODE-%3E%3D20.19-2ad4a8?style=for-the-badge&logo=node.js&logoColor=141414&labelColor=141414" alt="Node.js"></a>
  <a href="https://pokeapi.co/"><img src="https://img.shields.io/badge/POKEAPI-v2-ff4dad?style=for-the-badge&logo=pokemon&logoColor=ffee33&labelColor=141414" alt="PokeAPI"></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/LICENSE-MIT-ffee33?style=for-the-badge&logo=opensourceinitiative&logoColor=141414&labelColor=6f3cff" alt="MIT License"></a>
</p>

<p align="center">
  <strong>PICK BY TYPE → RANDOM RIVAL → ONE STAT DECIDES THE ROOM.</strong><br>
  <em>Winner = higher <code>special-attack</code> base stat. Tie → <strong>opponent wins</strong>. Nothing else is scored.</em><br>
  <sub>Powered by <a href="https://pokeapi.co/">pokeapi.co</a> · loading / errors / retry stay on-screen · no silent dead-ends</sub>
</p>

```
▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
```

## ★ BATTLE BRIEF — WHAT THIS REPO *IS*

> **Angular ~20** playground: **standalone** everything, `bootstrapApplication` + `app.config.ts`, **`@angular/animations`** (respects `prefers-reduced-motion: reduce` → noop). **RxJS 7** + **SCSS** global tokens under `src/styles/` (see `_tokens.scss` for the loud palette).  
>  
> You draft from a **per-type** menu; the app rolls an opponent and runs **`resolveSpecialAttackBattle()`** so the UI never reinvents win/loss rules. **Recent matchups** (session, **last 3**) remember the drama. **HTTP** hits PokeAPI **only** through **`PokeApiClient`**.

```
▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
```

## ★ SOURCE MAP — WHERE EVERYTHING LIVES

| ZONE | PATH |
| :--- | :--- |
| **SHELL** | `src/app/app.component.*`, `app.config.ts` |
| **GLOBAL LOOK** | `src/styles.scss` pulls `_tokens.scss`, `_arena-type-wash.scss`, `_battle-chrome.scss`, `_battle-panel-frames.scss`; type chips → `_pokemon-type-chips.scss` |
| **CORE · HTTP** | `src/app/core/api/` — **PokeAPI only** via `PokeApiClient` |
| **CORE · AUDIO** | `src/app/core/audio/` — `AudioService` (ticks + battle stings, autoplay-safe) |
| **MODELS** | `src/app/shared/models/` (`Pokemon`, types, type list) |
| **BATTLE** | `src/app/features/battle/` — `PokemonBattleService`, player/opponent services, `battle-history.service`, `special-attack-battle.ts`, `type-matchup-flavor.ts`, `pokemon-battle-result/`, `battle-recent-matchups/` |
| **PICKER** | `src/app/features/pokemon-picker/` — `pokemon-catalog.service`, `pokemon-selector/`, `pokemon-type/` |
| **DISPLAY** | `src/app/features/pokemon-display/` — `pokemon-details/`, `pokemon-card/` (`app-pokemon`) |

```
▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
```

## ★ FEATURE ROLL CALL — LOUD CHECKLIST

| TAG | WHAT HAPPENS |
| :---: | :--- |
| **`@DEFER`** | Type-picker region loads with **`@defer`** (viewport + idle prefetch) so the **battle shell paints first**. |
| **MENUS** | Type index from PokeAPI → **one collapsible menu per type**; names hydrate on **first open**. |
| **FULL CARD** | **`pokemon`** record fetch on **confirm**. |
| **RIVAL RNG** | Random opponent id **`1…maxPokemonSpeciesId`** (upper bound from env; often **964**), sprite **preload**, **try again** if opponent fetch fails. |
| **VERDICT** | **`resolveSpecialAttackBattle()`** + `PokemonBattleResultComponent` timing/UI + **`BattleHistoryService.recordMatch`**. Optional **type-pair flavor** (not damage math). |
| **SFX BUS** | **Sound off by default** — arcade tick on pick, sting on result; header toggle; `localStorage` **`gcea-sound-effects`**. |
| **MEMORY LANE** | Up to **three** **Recent matchups** per tab — `sessionStorage`, in-memory fallback if storage is blocked. |
| **`shareReplay(1)`** | Cached **type index** + **per-type lists** — don’t blast duplicate HTTP. |
| **SAFE URLS** | Path segments encoded for PokeAPI (weird names survive). |

```
▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
```

## ★ PREREQS — BRING YOUR OWN NODE

| REQUIREMENT | NOTES |
| :--- | :--- |
| **Node.js `>= 20.19.0`** | Matches `package.json` `engines` + current Angular CLI expectations. |
| **nvm** *(optional)* | `.nvmrc` pins **`22.12.0`** if you like reproducible shells. |

```
▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
```

## ★ INSTALL · RUN · SHIP — COPY. PASTE. WIN.

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

```
▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
```

<details>
<summary><strong>▼ API REFERENCE (APP) — EXPAND FOR THE FULL SYMBOL TABLE ▼</strong></summary>

| SYMBOL / AREA | RESPONSIBILITY |
| :--- | :--- |
| `PokeApiClient` | Thin HTTP client for PokeAPI v2 (`src/app/core/api/`). |
| `AudioService` | Optional Web Audio SFX (`src/app/core/audio/`): `soundEnabled$`, `playUiTick()`, `playBattleResult()`; unlock/resume follows autoplay rules. |
| `PokemonCatalogService` | Cached type index and per-type lists (`shareReplay`) in `features/pokemon-picker/`. |
| `PokemonPlayerService` | Player selection (`features/battle/`): `getPokemonDetails`, `pokemonDetails` / `pokemonDetailsError`. |
| `PokemonOpponentService` | Random opponent id, `getPokemonById`, sprite URL (`features/battle/`). |
| `PokemonBattleService` | Unified battle state: `vm$` (`PokemonBattleVm`), `loadOpponent()`, `selectPlayerPokemon()`, `playAgain()`, split streams (`playerDetails$`, `opponent$`, …). |
| `BattleHistoryService` | `entries$`, `recordMatch()`; newest three in `sessionStorage` (`gcea-battle-history-v1`). |
| `BattleRecentMatchupsComponent` | Reads `entries$`, formats recent lines. |
| `getPokemonTypes()` | `GET /type/` — paginated type list. |
| `getPokemonByType(typeName)` | `GET /type/{typeName}` — Pokémon in that type. |
| `getPokemonDetails(name)` | `GET /pokemon/{name}` — full details or error stream. |
| `getPokemonById(id)` | `GET /pokemon/{id}` — opponent path. |
| `pickRandomOpponentId()` | Random int `1…environment.maxPokemonSpeciesId`. |
| `PokemonSelectorComponent` | Type index after first render (`afterNextRender`); `@defer` in `AppComponent`. |
| `PokemonTypeComponent` | Dropdown; names on first open; `selectPlayerPokemon` on battle service. |
| `resolveSpecialAttackBattle()` | Pure helper — **special-attack** compare, messages, victor; **UI must not reimplement rules**. |
| `PokemonBattleResultComponent` | Presentation + delay; `recordMatch` when winner known. |
| `AppComponent` | Battle shell from `vm$`; sound toggle; deferred selector; recent matchups below fold. |

</details>

```
▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
```

## ★ CONFIGURATION — DIALS ON THE BACK OF THE CABINET

| FIELD | WHERE | DESCRIPTION |
| :--- | :--- | :--- |
| `pokeApi.baseUrl` | `environment*.ts` | PokeAPI v2 root (**no** trailing slash). |
| `pokeApi.frontSpriteBaseUrl` | `environment*.ts` | Base URL for opponent **front** sprites by national dex id. |
| `maxPokemonSpeciesId` | `environment*.ts` | **Inclusive** upper bound when rolling random opponent id. |

`PokeApiClient` assembles HTTP from these values. Point at a mock or mirror, **rebuild**. Production swaps in `environment.prod.ts` via `angular.json` file replacement.

```
▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
```

## ★ SCRIPTS — THE BUTTON LAYOUT

| SCRIPT | WHAT IT DOES |
| :--- | :--- |
| `npm start` | Dev server (`ng serve`). |
| `npm run build` | Production build → `dist/gotta-catch-em-all/browser/`. |
| `npm run build:dev` | Dev build (no prod env replacement). |
| `npm run build:github-pages` | Prod build + GitHub Pages base href **`/gotta-catch-em-all/`**. |
| `npm run serve:dist` | Serves prod output on port **8080** (after `npm run build`). |
| `npm run lint` | ESLint (Angular ESLint). |
| `npm test` | Karma + Chrome (**watch**). |
| `npm run test:ci` | Single run, headless Chrome **`--no-sandbox`** (CI). |

**ChromeHeadless won’t boot?** Run **`npm run test:ci`**. On macOS you can pin Chrome:

```bash
CHROME_BIN="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" npm run test:ci
```

```
▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
```

## ★ CURSOR — OPTIONAL SIDEKICK FILES

| PATH | PURPOSE |
| :--- | :--- |
| `.cursor/rules/gotta-catch-em-all-conventions.mdc` | Project conventions (layout, API boundaries, battle helper, styles). |
| `.cursor/skills/*/` | Skills: definition-of-done, GitHub Pages, PokeAPI/RxJS, Karma/Jasmine tests, doc writer. |

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

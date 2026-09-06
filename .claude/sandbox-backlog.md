# Sandbox backlog

Manufactured, low-stakes work used to pilot agent-led PR creation and merge for this repo
(see the sandbox exception in [`AGENTS.md`](../AGENTS.md)). Nothing here is roadmap-driven —
it exists to exercise the harness (guides, sensors, auto-merge gate) against real changes with
low blast radius before considering any expansion beyond this repo.

Each item lists its tier, target files, and acceptance criteria up front so nothing is
improvised at execution time.

## Tier A — `sandbox-tier-a` (agent opens PR, auto-merges on green checks, no human review)

Criteria for this tier: coverage/docs-only changes with no behavior change, confined to files
listed below.

- [ ] **Coverage: `pokemon-type.component.ts`** (currently 86.7%, threshold 67%/82%)
  - Target: `src/app/features/pokemon-picker/pokemon-type/pokemon-type.component.ts` and its
    `.spec.ts`
  - Acceptance: add Vitest cases for the currently-uncovered branches/error paths only: no
    changes to the component's public behavior; `npm run test:ci` coverage for this file
    increases; `format:check`, `lint`, `build` stay green.
- [ ] **Coverage: `pokemon-battle-result.component.ts`** (currently 94.2%)
  - Target: `src/app/features/battle/pokemon-battle-result/pokemon-battle-result.component.ts`
    and its `.spec.ts`
  - Acceptance: same as above — test-only change, no source behavior change.
- [ ] **Docs drift check: palette table vs. `_tokens.scss`**
  - Target: `README.md` (palette table), `docs/readme-ui-palette.svg`,
    `src/styles/_tokens.scss` (read-only reference, not edited by this task)
  - Acceptance: confirm the README palette table and SVG still match the current `:root`
    token values; if they've drifted, update `README.md` and `docs/readme-ui-palette.svg` to
    match — no token value changes. If nothing has drifted, close the item with no PR.
- [ ] **Coverage: `app.component.ts`** (currently 87.5% branch coverage)
  - Target: `src/app/app.component.ts` and its `.spec.ts`
  - Acceptance: add Vitest cases for the currently-uncovered branches only (e.g. the
    `prefers-reduced-motion` animation-provider branch, `@defer` prefetch conditions); no
    changes to component behavior.
- [ ] **Coverage: `type-matchup-flavor.ts`** (currently 78.6% branch coverage)
  - Target: `src/app/features/battle/type-matchup-flavor.ts` and its `.spec.ts`
  - Acceptance: add Vitest cases for the currently-uncovered branches only; test-only change,
    no changes to flavor-text logic. (Flavor/helper logic, not orchestration or
    `resolveSpecialAttackBattle()` — see the narrowed Tier C boundary below.)

## Tier B — `sandbox-tier-b` (agent opens PR, human merges)

Criteria for this tier: small refactors in presentation-only feature areas (not battle logic).

- [ ] **Reduce template duplication in `pokemon-picker/`**
  - Target: `src/app/features/pokemon-picker/pokemon-selector/`,
    `src/app/features/pokemon-picker/pokemon-type/`
  - Acceptance: no behavior/visual change; existing tests still pass without modification
    (or with only mechanical updates to match refactored structure); `format:check`, `lint`,
    `test:ci`, `build` all green.

## Tier C — no label, human-initiated only

Not eligible for autonomous PR creation under any circumstance. Listed here only so the
boundary is explicit:

- The battle orchestration/resolution core: `special-attack-battle.ts`,
  `pokemon-battle.service.ts`, `pokemon-player.service.ts`, `pokemon-opponent.service.ts`,
  `battle-history.service.ts` (all in `src/app/features/battle/`) — matches the
  `resolveSpecialAttackBattle()` invariant and the orchestration services `AGENTS.md` names
  separately from flavor/helpers and result/recent-matchups UI.
- Any new feature, however small.

Everything else under `src/app/features/battle/` (presentational components, flavor/helper
logic) is eligible for Tier A/B per the criteria above — the boundary is the specific files
listed, not the whole directory.

## How an item is worked

1. Routine picks the next unchecked Tier A or Tier B item (top to bottom).
2. Implements it per the acceptance criteria and `AGENTS.md` conventions.
3. Runs local checks scoped to the change (`format:check`, `lint`, `test:ci`, `build` as
   applicable).
4. Opens a PR labeled `agent-sandbox` plus the item's tier label.
5. Watches required checks; on failure, one fix retry, then demote to
   `sandbox-needs-review` if still failing (see `AGENTS.md`).
6. Appends a row to [`sandbox-log.md`](sandbox-log.md).
7. Checks the item off here in the same PR.

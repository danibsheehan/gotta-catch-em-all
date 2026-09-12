# Sandbox backlog

Manufactured, low-stakes work used to pilot agent-led PR creation and merge for this repo
(see the sandbox exception in [`AGENTS.md`](../AGENTS.md)). Nothing here is roadmap-driven —
it exists to exercise the harness (guides, sensors, auto-merge gate) against real changes with
low blast radius before considering any expansion beyond this repo.

Each item lists its tier, target files, and acceptance criteria up front so nothing is
improvised at execution time.

This directory lives at the repo root, not under `.claude/`, on purpose: `.claude/` is a
Claude Code protected path, so writes to it are never auto-approved (even with a matching
`permissions.allow` rule) except in `bypassPermissions` mode — which cloud/scheduled sessions
can't select. The routine needs unattended writes to `sandbox-log.md` every run, so these
files must stay outside `.claude/`.

## Tier A — `sandbox-tier-a` (agent opens PR, auto-merges on green checks, no human review)

Criteria for this tier: coverage/docs-only changes with no behavior change, confined to files
listed below.

### Recurring audits (checked first, every run, before the list below)

These are never checked off — they're live checks the routine re-runs each day. Try them
in this order; act on the first one with an eligible finding, exactly one file/finding per
run, then stop. If none has an eligible finding, fall through to the checkbox list below.
Tier C files are always off-limits, regardless of what a tool reports.

1. **Stale suppression sweep** — run `npm run lint` with `reportUnusedDisableDirectives`
   enabled (see `eslint.config.js`; no-op until the "enable `reportUnusedDisableDirectives`"
   item below has merged). Eligible finding: any `eslint-disable`/`@ts-expect-error`/
   `@ts-ignore` comment flagged as unused. Unit of work: one file — remove every stale
   suppression comment in that one file only.
2. **Unused-export sweep** — run `npx knip`. Eligible finding: an unused exported
   type/interface/const/function in a non-Tier-C `src/` file (ignore knip's file-level and
   dependency-level findings — see Tooling caveats below). Unit of work: one file,
   alphabetically first eligible file — delete every unused export knip reports in that file
   only, after confirming via grep it truly has zero outside references.
3. **Coverage-threshold sweep** — from `npm run test:ci` coverage output, find non-Tier-C
   `src/` files below 90% branch coverage (a "worth polishing" bar, not the CI-enforced gate
   in `angular.json`'s `coverageThresholds` — 67% branches — which is a hard floor, not a
   sweep target). Unit of work: the single lowest-coverage eligible file (ties broken
   alphabetically) — add Vitest cases for its uncovered branches only; no source behavior
   change.

For any of the three, if resolving the finding would require a real judgment call rather
than a mechanical fix (e.g. a coverage gap only closable by changing what the code does, or
an `==`/`!=` mismatch that isn't the established `== null` idiom), skip that finding and
either move to the next eligible finding within the same sweep or the next sweep in order —
do not force a fix. `format:check`, `lint`, `test:ci`, `build` stay green for whatever was
touched.

**Tooling caveats**: `npx knip` also flags `src/polyfills.ts`/`src/test-setup.ts` as unused
files and `@angular/forms`/`@angular/router` as unused dependencies — false positives
(referenced via `angular.json`/`tsconfig.spec.json`, outside knip's import graph) or out of
scope (dependency removal has a bigger blast radius than a dead-export deletion). Never act
on these.

- [x] **Coverage: `pokemon-type.component.ts`** (currently 86.7%, threshold 67%/82%)
  - Target: `src/app/features/pokemon-picker/pokemon-type/pokemon-type.component.ts` and its
    `.spec.ts`
  - Acceptance: add Vitest cases for the currently-uncovered branches/error paths only: no
    changes to the component's public behavior; `npm run test:ci` coverage for this file
    increases; `format:check`, `lint`, `build` stay green.
- [x] **Coverage: `pokemon-battle-result.component.ts`** (currently 94.2%)
  - Target: `src/app/features/battle/pokemon-battle-result/pokemon-battle-result.component.ts`
    and its `.spec.ts`
  - Acceptance: same as above — test-only change, no source behavior change.
- [x] **Docs drift check: palette table vs. `_tokens.scss`**
  - Target: `README.md` (palette table), `docs/readme-ui-palette.svg`,
    `src/styles/_tokens.scss` (read-only reference, not edited by this task)
  - Acceptance: confirm the README palette table and SVG still match the current `:root`
    token values; if they've drifted, update `README.md` and `docs/readme-ui-palette.svg` to
    match — no token value changes. If nothing has drifted, close the item with no PR.
- [x] **Lint hygiene: enable `prefer-const`, `no-var`, and null-safe `eqeqeq`**
  - Target: `eslint.config.js` only, plus any source file the new rules surface a violation in
  - Acceptance: add `'prefer-const': 'error'`, `'no-var': 'error'`, and
    `'eqeqeq': ['error', 'always', { null: 'ignore' }]` to the `**/*.ts` rule block (the
    `null: 'ignore'` option is required — the codebase deliberately uses `== null` to check
    both `null` and `undefined` in `pokemon-battle-result.component.ts` and
    `pokemon-player.service.ts`, and that idiom must be preserved, not rewritten). Run
    `npm run lint`; if it reports any violation that is not the pre-existing
    `== null`/`!= null` idiom, stop and demote to `sandbox-needs-review` rather than resolving
    it — a real `==`/`!=` mismatch is a judgment call, not mechanical. `format:check`,
    `test:ci`, `build` stay green.
- [ ] **Lint hygiene: enable `reportUnusedDisableDirectives`**
  - Target: `eslint.config.js`, plus any file with a stale `eslint-disable` comment it flags
  - Acceptance: add `linterOptions: { reportUnusedDisableDirectives: 'error' }` to the config.
    Run `npm run lint`; remove any `eslint-disable` comment it flags as unused. If it flags
    nothing (the current single disable comment in `src/test-setup.ts` covers real violations
    — empty stub methods and intentionally-unused constructor params — and is expected to
    still be needed), that's a valid outcome: commit the config change alone. `format:check`,
    `test:ci`, `build` stay green.

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

## Planned future addition — internationalization (not yet backlog-ready)

Offering translations (i18n/l10n) is a real feature under consideration, but it's Tier C for
its initial setup: choosing a library (`@angular/localize` vs. a runtime option like
`ngx-translate`, with real trade-offs around bundle size and the GitHub Pages deploy), locale
config, and wiring the first feature area are architectural decisions that need a human, not
the routine. No repo currently has any i18n set up (`angular.json`'s `extract-i18n` target is
just the unused Angular CLI default).

Once that foundation exists — library chosen, locale config in place, one feature area wired
by hand — the remaining string-extraction work per feature area becomes legitimate Tier A/B
material (narrow scope, no architectural judgment, easy to verify: translation key exists,
template references it, nothing else changed). Write those items here at that point, with
concrete targets and acceptance criteria, once the foundation decisions are actually made.

## How an item is worked

0. Routine checks the Recurring audits section first, in order; only falls through to the
   numbered checkbox list below if none has an eligible finding.
1. Otherwise, picks the next unchecked Tier A or Tier B item (top to bottom).
2. Implements it per the acceptance criteria and `AGENTS.md` conventions.
3. Runs local checks scoped to the change (`format:check`, `lint`, `test:ci`, `build` as
   applicable).
4. Opens a PR labeled `agent-sandbox` plus the item's tier label.
5. Watches required checks; on failure, one fix retry, then demote to
   `sandbox-needs-review` if still failing (see `AGENTS.md`).
6. Appends a row to [`sandbox-log.md`](sandbox-log.md) — for a recurring-audit item, the
   "Backlog item" cell names the specific sweep and finding (e.g. "Recurring: knip
   unused-export sweep — `pokemon.ts`") instead of a fixed item name.
7. Checks the item off here in the same PR — recurring-audit items are never checked off; only
   the log row is appended for those.

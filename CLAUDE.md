# CLAUDE.md

@AGENTS.md

The above is the canonical, tool-agnostic reference (install/run/test, conventions,
constraints, definition of done) — also read by Cursor and any other agent. Everything below
is Claude Code–specific session mechanics.

## Always-apply rule

@.cursor/rules/project-stack.mdc

This is this repo's always-apply context — Angular shell and standalone conventions,
Prettier, and folder layout. Cursor reads it natively; the `@`-import above is how Claude
Code loads the same file.

## Scoped rules — read the file when touching its paths

Cursor applies these automatically via each file's `globs:` frontmatter. Claude Code has no
equivalent auto-attach, so read the file yourself before editing matching paths.

| Rule                              | Applies to                                                  |
| --------------------------------- | ----------------------------------------------------------- |
| `.cursor/rules/http-pokeapi.mdc`  | `src/app/core/api/**`, `src/app/features/pokemon-picker/**` |
| `.cursor/rules/battle-domain.mdc` | `src/app/features/battle/**`                                |
| `.cursor/rules/styles-tokens.mdc` | `src/styles/**`, `**/*.scss`                                |

## Skills

`.claude/skills` is a directory symlink to `.cursor/skills` — same `SKILL.md` files, no
copies. Claude Code auto-discovers and invokes them by task the same way Cursor does:
`definition-of-done`, `github-pages-deploy`, `pokeapi-rxjs`, `test-generator`, `doc-writer`.

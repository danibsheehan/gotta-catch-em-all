# CLAUDE.md

@AGENTS.md

The above is the canonical, tool-agnostic reference (install/run/test, conventions,
constraints, definition of done). Everything below is Claude Code–specific session mechanics.

## Skills

`.claude/skills` is the canonical skills directory — add new skills here. `.cursor/skills` is
a symlink to it, kept only for compatibility with the legacy Cursor setup. Claude Code
auto-discovers and invokes skills by task: `github-pages-deploy`, `pokeapi-rxjs`,
`test-generator`. This repo also installs the `foundations` plugin from the
`dani-foundations` marketplace (see `.claude/settings.json`), providing `doc-writer` and
`definition-of-done` (namespaced `foundations:*`) — no local copies needed.

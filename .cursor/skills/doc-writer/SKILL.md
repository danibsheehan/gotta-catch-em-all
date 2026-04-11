---
name: doc-writer
description: Generates READMEs, JSDoc/GoDoc-style API docs, and inline comments for JavaScript/TypeScript and Go. Use when the user asks to write, update, or improve documentation, READMEs, docstrings, or inline explanations.
---

# Doc Writer

Produces clear, consistent documentation for JS/TS and Go. Covers **README files**, **API/function docs**, and **inline comments**. Markdown (`.md`) for standalone docs; JSDoc/GoDoc/comments in source as appropriate.

---

## Step 1: Classify the request

| Request | Doc type |
| --- | --- |
| "Write a README", "document this repo" | README |
| "Document this function/class", "add JSDoc/GoDoc" | API docs |
| "Add comments", "explain this inline" | Inline comments |
| Mixed / ambiguous | Ask, or default to README + API docs |

---

## Step 2: Gather context

Before writing, read the relevant files (repo layout, `package.json` / `go.mod`, existing README, entry points, symbols to document).

Use the repo search tools as needed (e.g. find exports, locate `*.md` at shallow depth).

---

## Step 3: Write the documentation

Read the appropriate reference **before** drafting:

- **README** → [references/readme.md](references/readme.md)
- **API docs (JS/TS)** → [references/jsdoc.md](references/jsdoc.md)
- **API docs (Go)** → [references/godoc.md](references/godoc.md)
- **Inline comments** → [references/inline-comments.md](references/inline-comments.md)

Follow those guides for structure and tone.

---

## Step 4: Deliver

- **Write files in the workspace** at the paths the user asked for (e.g. repo root `README.md`, or next to the source file). Edit existing files in place when updating docs.
- Do **not** use Claude-specific output paths or external “present file” steps—use normal file create/edit in this project.
- Summarize for the user: what changed, where, and any gaps they should fill in.

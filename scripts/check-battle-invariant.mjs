#!/usr/bin/env node
// Heuristic sensor for the AGENTS.md invariant: "Reimplement battle win/loss rules outside
// resolveSpecialAttackBattle()". This is a best-effort static check, not a semantic
// guarantee — it flags likely reimplementation for human/agent follow-up, it doesn't prove
// correctness.

import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const SRC_ROOT = 'src/app';
const CANONICAL_FILE = 'src/app/features/battle/special-attack-battle.ts';
// Relational comparison, not `=>` (arrow functions) or generic type params like `Partial<T>`.
const COMPARISON_RE = /(?<!=)[<>]=(?!=)|(?<![=<>\w])[<>](?![=\w])/;
const RESOLVE_BATTLE_DEF_RE = /\b(function\s+resolve\w*Battle|const\s+resolve\w*Battle\s*=)/;

function walk(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const s = statSync(full);
    if (s.isDirectory()) {
      out.push(...walk(full));
    } else if (entry.endsWith('.ts') && !entry.endsWith('.spec.ts')) {
      out.push(full);
    }
  }
  return out;
}

function checkFile(path) {
  const violations = [];
  const rel = relative('.', path).split('\\').join('/');
  if (rel === CANONICAL_FILE) return violations;

  const lines = readFileSync(path, 'utf8').split('\n');

  lines.forEach((line, i) => {
    if (RESOLVE_BATTLE_DEF_RE.test(line)) {
      violations.push({
        file: rel,
        line: i + 1,
        message: `defines a resolve*Battle function outside ${CANONICAL_FILE}`,
      });
    }
  });

  lines.forEach((line, i) => {
    if (line.includes('special-attack')) {
      const window = lines.slice(Math.max(0, i - 2), i + 3).join('\n');
      if (COMPARISON_RE.test(window)) {
        violations.push({
          file: rel,
          line: i + 1,
          message:
            "references 'special-attack' near a comparison operator outside " +
            `${CANONICAL_FILE} — possible reimplementation of the win/loss rule`,
        });
      }
    }
  });

  return violations;
}

const files = walk(SRC_ROOT);
const allViolations = files.flatMap(checkFile);

if (allViolations.length > 0) {
  console.error('battle-invariant-check: possible reimplementation of battle win/loss rules:\n');
  for (const v of allViolations) {
    console.error(`  ${v.file}:${v.line} — ${v.message}`);
  }
  console.error(
    `\nPure comparison logic must stay in ${CANONICAL_FILE}. If this is a false positive ` +
      '(e.g. a comment or unrelated string), adjust the pattern in scripts/check-battle-invariant.mjs.',
  );
  process.exit(1);
}

console.log('battle-invariant-check: OK — no reimplementation of battle win/loss rules found.');

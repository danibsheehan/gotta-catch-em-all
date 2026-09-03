"""Shared path analysis and PR guide content for gotta-catch-em-all."""

from __future__ import annotations

import re
from collections import defaultdict
from collections.abc import Iterable

# Area names match .github/labeler.yml's existing labels where one exists.
AREA_RULES: list[tuple[str, tuple[str, ...]]] = [
    (
        "battle",
        ("src/app/features/battle/",),
    ),
    (
        "picker",
        ("src/app/features/pokemon-picker/",),
    ),
    (
        "display",
        ("src/app/features/pokemon-display/",),
    ),
    (
        "core",
        (
            "src/app/core/",
            "src/app/shared/",
        ),
    ),
    (
        "app",
        (
            "src/app/app.component",
            "src/app/app.config",
            "src/main.ts",
        ),
    ),
    ("styles", ("src/styles/", "src/styles.scss")),
    ("tests", (".spec.",)),
    ("ci", (".github/",)),
    ("docs", ("README.md", "docs/", ".claude/skills/")),
    (
        "config",
        (
            "package.json",
            "package-lock.json",
            "angular.json",
            "tsconfig",
            "eslint.config",
            ".prettierrc",
            ".nvmrc",
        ),
    ),
]

AREA_DISPLAY = {
    "battle": "battle simulation",
    "picker": "Pokemon picker",
    "display": "Pokemon display",
    "core": "core services / shared models",
    "app": "app shell",
    "styles": "styles",
    "tests": "tests",
    "ci": "CI / GitHub",
    "docs": "docs / agent guidance",
    "config": "tooling config",
    "other": "other",
}

META_START = "<!-- pr-guide-meta:start -->"
META_END = "<!-- pr-guide-meta:end -->"

SUMMARY_PROMPT = "<!-- What changed and why? -->"
VERIFY_PROMPT = "<!-- Commands run, manual checks, or N/A with rationale. -->"

LEGACY_TEMPLATE_MARKERS = ("## Checklist", "No unintended secrets")


def matches(path: str, prefixes: tuple[str, ...]) -> bool:
    return any(path == prefix or path.startswith(prefix) or prefix in path for prefix in prefixes)


def areas_for(path: str) -> list[str]:
    areas: list[str] = []
    for area, prefixes in AREA_RULES:
        if matches(path, prefixes):
            areas.append(area)
    return areas or ["other"]


def analyze_paths(paths: Iterable[str]) -> tuple[set[str], dict[str, int]]:
    area_counts: dict[str, int] = defaultdict(int)
    for path in paths:
        for area in areas_for(path):
            area_counts[area] += 1
    return set(area_counts), dict(area_counts)


def ordered_areas(areas: set[str]) -> list[str]:
    ordered = [area for area, _ in AREA_RULES if area in areas]
    if "other" in areas:
        ordered.append("other")
    return ordered


def format_touches(areas: set[str]) -> str:
    ordered = ordered_areas(areas)
    if not ordered:
        return "none detected"
    return ", ".join(AREA_DISPLAY[area] for area in ordered)


def verify_commands(areas: set[str]) -> list[str]:
    commands: list[str] = []
    if areas & {"battle", "picker", "display", "core", "app", "styles", "config"}:
        commands.extend(
            [
                "`npm run lint`",
                "`npm run format:check`",
                "`npm run test:ci` or targeted Karma/Vitest specs for the changed area",
                "`npm run build`",
            ]
        )
    elif "tests" in areas:
        commands.append("`npm run test:ci` or targeted specs")

    if "ci" in areas:
        commands.append("Review workflow syntax and required permissions in GitHub Actions")
    if not commands:
        commands.append("N/A - docs/tooling only; confirm locally if anything user-facing changed")
    return commands


def checklist_items(areas: set[str]) -> list[str]:
    items = ["No unintended secrets or local-only config committed"]
    if "battle" in areas:
        items.append("Battle simulation results (damage, type effectiveness, special attacks) still match expected outcomes")
    if "picker" in areas:
        items.append("Pokemon selection and type filtering behave correctly")
    if "display" in areas:
        items.append("Pokemon card/details rendering still matches PokeAPI response shapes")
    if "core" in areas:
        items.append("PokeAPI client and shared models still match the real API response shapes")
    if "app" in areas:
        items.append("App shell renders and routes correctly under the GitHub Pages base href")
    if "tests" not in areas and areas & {"battle", "picker", "display", "core", "app"}:
        items.append("Tests added or updated for changed behavior, or noted why not")
    return items


def reviewer_focus(areas: set[str], paths: list[str]) -> list[str]:
    focus: list[str] = []
    if "battle" in areas:
        focus.append("Battle math (type matchups, special attacks) and turn-order/state handling")
    if "picker" in areas:
        focus.append("Pokemon selection/filtering UX and type-list correctness")
    if "display" in areas:
        focus.append("Card/details rendering and PokeAPI data mapping")
    if "core" in areas:
        focus.append("PokeAPI client error handling and shared model shapes used across features")
    if "app" in areas:
        focus.append("Routing and GitHub Pages base-href handling")
    if "ci" in areas:
        focus.append("Workflow event triggers, token permissions, and required-check names")
    if "config" in areas:
        focus.append("Dependency, Angular, TypeScript, ESLint, and Prettier changes that can affect local and CI runs")
    if any(".spec." in path for path in paths):
        focus.append("Test assertions cover the behavior under review rather than only implementation details")
    if not focus:
        focus.append("Scope looks docs- or tooling-only; confirm there is no hidden runtime impact")
    return focus


def _strip_html_comments(text: str) -> str:
    return re.sub(r"<!--.*?-->", "", text, flags=re.DOTALL).strip()


def is_legacy_template(body: str) -> bool:
    return any(marker in body for marker in LEGACY_TEMPLATE_MARKERS)


def summary_section_is_empty(body: str) -> bool:
    match = re.search(r"## Summary\s*\n+(.*?)\n+## How to verify", body, re.DOTALL | re.IGNORECASE)
    if not match:
        return True
    return not _strip_html_comments(match.group(1))


def should_full_scaffold(body: str) -> bool:
    stripped = body.strip()
    if not stripped:
        return True
    if is_legacy_template(body):
        return True
    if "## Summary" in body and "## How to verify" in body and summary_section_is_empty(body):
        return META_START not in body
    return False


def has_meta_block(body: str) -> bool:
    return META_START in body and META_END in body


def build_meta_block(areas: set[str]) -> str:
    return (
        f"**Touches:** {format_touches(areas)}\n\n"
        "Checklist and reviewer focus: see the **PR guide** comment on this PR "
        "(updated on each push)."
    )


def build_full_body(areas: set[str], verify: list[str]) -> str:
    verify_lines = [VERIFY_PROMPT, ""] + [f"- {command}" for command in verify]
    return "\n".join(
        [
            "## Summary",
            "",
            SUMMARY_PROMPT,
            "",
            "## How to verify",
            "",
            *verify_lines,
            "",
            META_START,
            build_meta_block(areas),
            META_END,
            "",
        ]
    )


def merge_pr_body(current: str, areas: set[str], verify: list[str]) -> str | None:
    if should_full_scaffold(current):
        return build_full_body(areas, verify)
    if has_meta_block(current):
        meta = f"{META_START}\n{build_meta_block(areas)}\n{META_END}"
        return re.sub(
            re.escape(META_START) + r".*?" + re.escape(META_END),
            meta,
            current,
            count=1,
            flags=re.DOTALL,
        )
    return None

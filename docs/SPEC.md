# SPEC

## Goal

Make the AgentOS repository self-host the PRD-defined SpecPilot Engine flow and evolve it with an EvoNexus-inspired operating layer while preserving AgentOS as the platform, SpecPilot as the SPEC-driven engine and adapters as isolated tool mappings.

## Scope

In scope:

- Create canonical `docs/SPEC.md` and `docs/PLAN.md` for the AgentOS fusion rollout.
- Materialize runtime `.harness/` state for this repository.
- Make `npm run validate` cover template, context and secrets verification.
- Add markdown-first skills under `core/skills/`.
- Add goals under `core/goals/`.
- Organize agents by documented layers.
- Add solutioning and retro workflows.
- Add a Claude Code adapter placeholder.
- Add planned extensions and optional packs, including ISP.
- Record objective evidence in `docs/REVIEW.md`.

Out of scope:

- Real Claude Code adapter generation or `.claude/` creation.
- Web UI, dashboard, database, scheduler, daemon, channels, external API, package publication or deployment automation.
- Broad refactors outside the PRD closure needed to make the root repo operational.

## Requirements

### R1 - Canonical Runtime Artifacts

Expected behavior:

- The repository contains real `docs/SPEC.md`, `docs/PLAN.md`, `.harness/project-state.json` and an active sprint JSON aligned with the PRD.

Acceptance criteria:

- `npm run validate:context` exits `0`.
- The sprint JSON references `docs/SPEC.md` and read-only context with valid `start-end` ranges.

### R2 - Active Work Uses `agentGoal`

Expected behavior:

- The active sprint/task uses `agentGoal`, `specRefs`, `context.readOnly`, `files`, `acceptanceCriteria`, `verification.commands` and `evidence`.

Acceptance criteria:

- The active sprint JSON follows the repository sprint contract.
- No active runtime artifact uses the legacy `codexGoal` field.

### R3 - Default Validation Covers Context Integrity

Expected behavior:

- `npm run validate` fails when context validation fails.

Acceptance criteria:

- `package.json` includes `validate:context` in the `validate` script.
- `npm run validate` exits `0` only when template, context and secrets checks all pass.

### R4 - Verification Evidence Is Recorded

Expected behavior:

- `docs/REVIEW.md` captures commands, exit codes and observed evidence for this rollout.

Acceptance criteria:

- `docs/REVIEW.md` includes `npm run doctor`, `npm run validate` and their exit codes.
- The review notes any remaining operational risk.

### R5 - EvoNexus-Inspired Layer

Expected behavior:

- The repository documents EvoNexus as a conceptual reference and adds layers, skills, goals, solutioning, retro, extensions and packs without adding runtime dependencies.

Acceptance criteria:

- `docs/EVONEXUS_ALIGNMENT.md`, `docs/GOALS.md`, `docs/SKILLS.md`, `docs/EXTENSIONS.md` and `docs/PACKS.md` exist.
- `core/skills/` contains at least seven initial markdown skills.
- `core/goals/` contains README, schema and templates.
- `core/workflows/04-solution.md` and `core/workflows/10-retro.md` exist.

### R6 - Adapter and Extension Boundaries

Expected behavior:

- Claude Code is represented only as an experimental future adapter, and extensions/packs remain optional placeholders.

Acceptance criteria:

- `adapters/claude-code/README.md` and `mapping.yaml` exist.
- `extensions/` and `packs/` contain README placeholders with planned status.
- `core/` does not depend on `.claude/`.

## Constraints

- Keep universal behavior in `core/`, `.harness/`, `docs/` and `scripts/`.
- Preserve the current adapter structure and avoid new dependencies.
- Preserve unrelated user changes already present in the worktree.
- Do not declare planned placeholders as ready functionality.

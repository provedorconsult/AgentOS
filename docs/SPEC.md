# SPEC

## Goal

Make the AgentOS repository self-host the PRD-defined SpecPilot Engine flow with real runtime artifacts, active harness state and a complete validation gate.

## Scope

In scope:

- Create canonical `docs/SPEC.md` and `docs/PLAN.md` for the AgentOS fusion rollout.
- Materialize runtime `.harness/` state for this repository.
- Make `npm run validate` cover template, context and secrets verification.
- Record objective evidence in `docs/REVIEW.md`.

Out of scope:

- New adapters beyond the existing Codex, generic IDE and Antigravity scaffold.
- Web UI, database, daemon, external API, package publication or deployment automation.
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

## Constraints

- Keep universal behavior in `core/`, `.harness/`, `docs/` and `scripts/`.
- Preserve the current adapter structure and avoid new dependencies.
- Preserve unrelated user changes already present in the worktree.

# SPEC

## Goal

Establish AgentOS Architecture 2.0 as the canonical source for the repository, publish the full 2.0 architecture contract, eliminate `.codex/` drift from its canonical layer, replace the false deploy path with a fail-closed deployment contract, and expand validation with executable tests.

## Canonical Source

`docs/ARCHITECTURE.md` is the canonical source for AgentOS Architecture 2.0. Other docs, harness tasks, adapters and scripts must route back to that file when they describe platform boundaries, canonical workflow, adapter boundaries, `.codex/` generation, deployment readiness or validation requirements.

## Scope

In scope:

- publish the full Architecture 2.0 contract in `docs/ARCHITECTURE.md`;
- keep `core/` as the neutral platform layer;
- keep SpecPilot explicit through `specpilot/`, `.harness/` and docs templates;
- keep `codex-layer/` as the canonical source for project `.codex/` material;
- require `.codex/` to match the canonical `codex-layer/` output;
- replace the no-op deploy script with a fail-closed script that requires a real configured deployment command;
- add executable tests and include them in `npm run validate`;
- refresh active sprint and review evidence.

Out of scope:

- remote production deployment without `AGENTOS_DEPLOY_COMMAND`;
- medium or long horizon implementation;
- functional Claude Code or Antigravity adapters;
- memory runtime, routines, heartbeats execution, dashboard, database, scheduler, channels or remote runtime;
- external dependencies.

## Requirements

### R1 - Architecture 2.0 Canonical Source

Expected behavior:

- Architecture 2.0 is published completely in one canonical document.
- `docs/SPEC.md`, `docs/PLAN.md`, `docs/INDEX.md` and active sprint state point to the canonical source.

Acceptance criteria:

- `docs/ARCHITECTURE.md` starts with `# AgentOS Architecture 2.0`.
- `docs/ARCHITECTURE.md` contains a `Canonical Source` section.
- `docs/INDEX.md` routes readers to Architecture 2.0.

### R2 - Neutral Core and Explicit SpecPilot Engine

Expected behavior:

- `core/` remains IDE-neutral and independent from `.codex/` and `.claude/`.
- SpecPilot remains the internal SPEC-driven engine.

Acceptance criteria:

- `core/README.md`, `specpilot/README.md`, `specpilot/templates/README.md`, `specpilot/validators/README.md` and `specpilot/harness/README.md` exist.
- Required templates remain under `docs/` and `.harness/templates/`.

### R3 - No `.codex/` Drift

Expected behavior:

- `codex-layer/` is the canonical source for project-local Codex material.
- `.codex/` is an installed copy, not a divergent source of truth.

Acceptance criteria:

- `.codex/config.toml` is byte-for-byte equal to `codex-layer/config.toml`.
- Tests fail if those files drift.

### R4 - Honest Deployment Contract

Expected behavior:

- The repository no longer reports a successful deploy when no real target exists.
- Deployment is approval/configuration-gated through explicit environment variables.

Acceptance criteria:

- `scripts/deploy.ps1` exits non-zero when `AGENTOS_DEPLOY_COMMAND` is not set.
- The failure message explains how to configure a real deployment command.
- The deploy script does not describe itself as a placeholder.

### R5 - Expanded Validation and Tests

Expected behavior:

- Validation covers architecture canonicality, `.codex/` drift and fail-closed deploy behavior.

Acceptance criteria:

- `npm test` runs the contract test suite.
- `npm run validate` includes `npm test`.
- `docs/REVIEW.md` records fresh `npm run doctor`, `npm test`, `npm run validate` and `git diff --check` results with exit codes.

## Constraints

- Do not add dependencies.
- Do not delete existing compatibility files without explicit justification.
- Do not present placeholders as ready features.
- Do not run a real deployment unless a real deploy target is configured and approved.

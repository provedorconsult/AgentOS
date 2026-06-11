# SPEC

## Goal

Align AgentOS with the roadmap short horizon only, keeping AgentOS as the platform, SpecPilot as the internal SPEC-driven engine, Codex as an adapter and Generic IDE as a first-class path without `.codex`.

## Scope

In scope:

- keep `core/` as the neutral platform layer;
- make SpecPilot explicit through `specpilot/`, existing templates and `.harness/`;
- align the canonical workflow surface to the short-horizon sequence;
- keep Codex and Generic IDE adapters operational and isolated from `core/`;
- keep Claude Code, extensions and packs as honest placeholders only;
- refresh active runtime artifacts and review evidence.

Out of scope:

- medium or long horizon implementation;
- functional Claude Code or Antigravity adapters;
- memory runtime, routines, heartbeats execution, GitHub Actions, dashboard, database, scheduler, channels or remote runtime;
- external dependencies.

## Requirements

### R1 - Neutral Core

Expected behavior:

- `core/` exposes its purpose explicitly and stays independent from `.codex/` and `.claude/`.

Acceptance criteria:

- `core/README.md` exists.
- No file in `core/` requires vendor-specific runtime folders.

### R2 - Explicit SpecPilot Engine

Expected behavior:

- SpecPilot is visible as the engine surface without splitting it from AgentOS.

Acceptance criteria:

- `specpilot/README.md`, `specpilot/templates/README.md`, `specpilot/validators/README.md` and `specpilot/harness/README.md` exist.
- Required short-horizon templates remain under `docs/` and `.harness/templates/`.

### R3 - Canonical Short-Horizon Workflows

Expected behavior:

- The repository exposes the short-horizon execution sequence from discover to retro.

Acceptance criteria:

- `core/workflows/01-discover.md`, `02-spec.md`, `03-plan.md`, `04-solution.md`, `05-implement.md`, `06-verify.md`, `07-review.md`, `08-release.md`, `09-deploy.md` and `10-retro.md` exist.
- Documentation does not require `finish` or `improve` as canonical steps.

### R4 - Adapter and Placeholder Boundaries

Expected behavior:

- Codex remains an adapter, Generic IDE remains usable without `.codex`, and Claude Code remains a placeholder.

Acceptance criteria:

- `adapters/codex/` and `adapters/generic-ide/` remain installable surfaces.
- `adapters/generic-ide/` does not require `.codex/`.
- `adapters/claude-code/` remains documentation and mapping only.

### R5 - Honest Review Evidence

Expected behavior:

- The active sprint and review evidence reflect this short-horizon alignment.

Acceptance criteria:

- Active runtime artifacts use `agentGoal` and point to this scope.
- `docs/REVIEW.md` records fresh `npm run doctor` and `npm run validate` results with exit codes.

## Constraints

- Do not implement medium or long horizon behavior.
- Do not add dependencies.
- Do not delete existing files without explicit justification.
- Do not present placeholders as ready features.

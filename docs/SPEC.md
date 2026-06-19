# SPEC

## Goal

Promote AgentOS 2.0 from an alpha-shaped scaffold to a release-candidate-ready local platform by hardening CI, adapter installation, validators, metadata, docs and evidence without adding new product scope or running a real deployment.

## Canonical Source

`docs/ARCHITECTURE.md` remains the canonical source for AgentOS Architecture 2.0. This SPEC narrows the short-horizon hardening slice required for `2.0.0-rc.1`.

## Scope

In scope:

- replace legacy CI gating with canonical Node-based validation on Windows and Linux;
- keep `codex-layer/` as the canonical Codex source and make adapter installation honor it;
- validate active sprint state, project state, context ranges, workflow manifest, docs and license metadata;
- harden secret scanning for `.env.example` and backup artifacts;
- reconcile release-candidate docs, changelog and review evidence;
- keep deploy contract-only and fail closed when no real target exists.

Out of scope:

- real deployment without an approved `AGENTOS_DEPLOY_COMMAND`;
- dashboard, database, scheduler, channels, remote runtime, executable memory, heartbeats, routines or knowledge-db;
- functional Claude Code or Antigravity adapters;
- external npm dependencies.

## Requirements

### R1 - Canonical Validation and CI

Expected behavior:

- CI validates the same contracts that local developers run.
- Validation is portable across Windows and Linux.

Acceptance criteria:

- `.github/workflows/ci.yml` runs `npm run doctor`, `npm run validate` and `git diff --check`.
- CI uses `ubuntu-latest` and `windows-latest`.
- GitHub Actions are pinned by immutable SHA.

### R2 - Canonical Adapter Installation

Expected behavior:

- Codex installation copies `codex-layer/` into `.codex/`.
- Generic IDE installation stays `.codex`-free.
- Existing files are backed up before replacement.

Acceptance criteria:

- Codex E2E tests prove `.codex/config.toml` matches `codex-layer/config.toml` after install.
- Generic IDE E2E tests prove no `.codex/` is created.
- Backup artifacts are ignored by git.

### R3 - Complete Harness and Contract Validation

Expected behavior:

- Sprint, task, context, state, docs, workflows and metadata are mechanically enforced.

Acceptance criteria:

- `validate-sprint-json.mjs` rejects out-of-bounds ranges and invalid task/state rules.
- `validate-state.mjs` validates `.harness/current.txt` against `.harness/project-state.json`.
- `npm run validate` includes `doctor`, `state`, `workflows`, `adapters`, `docs`, `license` and `test`.

### R4 - Hardened Security and Release Metadata

Expected behavior:

- `.env.example` is scanned for unsafe values but accepts safe placeholders.
- Release-candidate metadata is coherent across package, YAML, harness and docs.

Acceptance criteria:

- unsafe secrets in `.env.example` fail validation;
- `package.json` uses `MIT`, `private: true` and `engines.node >=22`;
- `README.md`, `agentos.yaml` and `.harness/project-state.json` reflect `2.0.0-rc.1`.

### R5 - Honest Release-Candidate Documentation

Expected behavior:

- documentation no longer references obsolete publication assumptions;
- review evidence is structured by criterion, command and limitation;
- release and rollback guidance are explicit.

Acceptance criteria:

- `docs/GITHUB_SETUP.md`, `docs/INDEX.md`, `docs/REVIEW.md`, `docs/RELEASE.md`, `docs/MIGRATION.md`, `CHANGELOG.md`, `CONTRIBUTING.md` and root `SECURITY.md` reflect the current release-candidate contract.

## Constraints

- Do not add dependencies.
- Do not remove compatibility files unless they are clearly deprecated.
- Do not perform a real deploy.

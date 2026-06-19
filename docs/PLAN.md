# PLAN

## Summary

Close the immediate Architecture 2.0 hardening slice: make `docs/ARCHITECTURE.md` the canonical source, publish the complete 2.0 boundaries, remove `.codex/` drift, replace the false deploy success path, and make those contracts executable through tests and validation.

## Tasks

### Task 001 - Publish the Canonical Source

- Goal: make Architecture 2.0 the single canonical source for platform boundaries and current readiness.
- Editable files: `docs/SPEC.md`, `docs/PLAN.md`, `docs/ARCHITECTURE.md`, `docs/INDEX.md`, `.harness/current.txt`, `.harness/project-state.json`, `.harness/sprints/2026-06-18-agentos-architecture-2-hardening.json`
- Verification: `npm test`, `npm run validate`

### Task 002 - Eliminate `.codex/` Drift

- Goal: keep the project-local `.codex/` layer byte-for-byte aligned with the canonical `codex-layer/`.
- Editable files: `.codex/config.toml`, `codex-layer/config.toml`, `tests/agentos-2-contracts.test.mjs`
- Verification: `npm test`

### Task 003 - Replace False Deploy

- Goal: remove the no-op deploy success path and fail closed unless a real deployment command is configured.
- Editable files: `scripts/deploy.ps1`, `tests/agentos-2-contracts.test.mjs`
- Verification: `node --test tests/agentos-2-contracts.test.mjs`

### Task 004 - Expand Gates and Record Evidence

- Goal: include tests in the validation path and record objective evidence.
- Editable files: `package.json`, `scripts/doctor.mjs`, `docs/REVIEW.md`
- Verification: `npm run doctor`, `npm test`, `npm run validate`, `git diff --check`

## Risks

- A real deploy remains blocked until `AGENTOS_DEPLOY_COMMAND` points to an approved deployment executable.
- `validate:context` proves path and range integrity, not semantic freshness.
- `.codex/` must be regenerated or copied from `codex-layer/` after future canonical layer edits.
- Claude Code, Antigravity, extensions and packs remain placeholders until future SPECs activate them.

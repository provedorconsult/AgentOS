# PLAN

## Summary

Close the 2026-06-19 audit delta in strict priority order while keeping `docs/ARCHITECTURE.md` as the canonical source: CI first, adapters second, validators/tests/security next, then docs and release-candidate metadata.

## Tasks

### Task 001 - Canonical CI and Deploy Contract

- Goal: replace the legacy PowerShell gate with canonical cross-platform validation and bind the deploy workflow to GitHub Environment without claiming a real target.
- Editable files: `.github/workflows/ci.yml`, `.github/workflows/deploy.yml`, `scripts/deploy.mjs`, `scripts/deploy.ps1`, `tests/*.test.mjs`
- Verification: `npm test`, `npm run validate`

### Task 002 - Adapter Hardening

- Goal: keep `codex-layer/` as the source of truth, support target-aware installs, backups and dry-runs, and keep Generic IDE `.codex`-free.
- Editable files: `scripts/agentos-install-adapter.mjs`, `adapters/codex/*`, `adapters/generic-ide/*`, `.gitignore`, `tests/*.test.mjs`
- Verification: `npm test`, `npm run validate:adapters`

### Task 003 - Validators, Harness and Metadata

- Goal: enforce state, workflow, docs, license, range and evidence contracts through dependency-free validators.
- Editable files: `scripts/*.mjs`, `scripts/lib/*.mjs`, `.harness/*`, `agentos.yaml`, `package.json`, `core/workflows/*`
- Verification: `npm run validate`, `npm test`

### Task 004 - Security and Documentation Reconciliation

- Goal: harden `.env.example` scanning, remove obsolete GitHub bootstrap guidance and publish release-candidate docs.
- Editable files: `.env.example`, `README.md`, `docs/*.md`, `CHANGELOG.md`, `CONTRIBUTING.md`, `SECURITY.md`
- Verification: `npm run validate:secrets`, `npm run validate:docs`, `npm run validate:license`

## Risks

- real deploy remains intentionally blocked without `AGENTOS_DEPLOY_COMMAND`;
- branch protection and formal review requirements still depend on GitHub-side settings;
- Linux validation will be confirmed through CI because this workstation is Windows-only.

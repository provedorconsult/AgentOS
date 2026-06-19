# PLAN

## Summary

Close the 2026-06-19 RC trust-gate delta in strict priority order while preserving `docs/ARCHITECTURE.md` as the canonical source: false-success evidence and secret scanning first, then path containment, state/YAML contracts, doctor/CI integrity, documentation and GitHub governance.

## Tasks

### Task 001 - Canonical CI and Deploy Contract

- Goal: replace the legacy PowerShell gate with canonical cross-platform validation and bind the deploy workflow to GitHub Environment without claiming a real target.
- Editable files: `.github/workflows/ci.yml`, `.github/workflows/deploy.yml`, `scripts/deploy.mjs`, `scripts/deploy.ps1`, `tests/*.test.mjs`
- Verification: `npm test`, `npm run validate`

### Task 002 - Adapter Hardening

- Goal: keep `codex-layer/` as the source of truth, support target-aware installs, backups and dry-runs, and keep Generic IDE `.codex`-free.
- Editable files: `scripts/agentos-install-adapter.mjs`, `adapters/codex/*`, `adapters/generic-ide/*`, `.gitignore`, `tests/*.test.mjs`
- Verification: `npm test`, `npm run validate:adapters`

### Task 003 - Evidence, Paths and Agent Goals

- Goal: reject false-success evidence, external paths, context overlap and incomplete `agentGoal` contracts.
- Editable files: `scripts/*.mjs`, `scripts/lib/*.mjs`, `.harness/*`, `agentos.yaml`, `package.json`, `core/workflows/*`
- Verification: `npm run validate`, `npm test`

### Task 004 - YAML, State and Schemas

- Goal: parse YAML safely, reject duplicate/invalid values and align sprint/project state semantics with complete schemas.
- Editable files: `agentos.yaml`, `package.json`, `package-lock.json`, `core/schemas/*`, `scripts/lib/*`, `scripts/validate-state.mjs`
- Verification: `npm audit --audit-level=moderate`, `npm run validate:state`, `npm test`

### Task 005 - Security, CI and Documentation Reconciliation

- Goal: harden `.env.example` scanning, remove obsolete GitHub bootstrap guidance and publish release-candidate docs.
- Editable files: `.env.example`, `.github/workflows/ci.yml`, `README.md`, `docs/*.md`, `CHANGELOG.md`, `CONTRIBUTING.md`, `SECURITY.md`
- Verification: `npm run validate:secrets`, `npm run validate:docs`, `npm run validate:license`

### Task 006 - Post-Audit Executable Enforcement

- Goal: execute JSON Schemas, complete YAML semantics, close path/secret bypasses and reconcile governance/release evidence.
- Editable files: `core/schemas/*`, `scripts/lib/*`, `scripts/validate-no-secrets.mjs`, `.github/*`, `.harness/*`, `README.md`, `CHANGELOG.md`, `docs/*`
- Verification: `npm audit --audit-level=moderate`, `npm run validate`, `npm test`, `git diff --check`

## Risks

- real deploy remains intentionally blocked without `AGENTOS_DEPLOY_COMMAND`;
- branch protection and formal review requirements still depend on GitHub-side settings;
- tag and prerelease publication remain blocked until the PR has formal review and required Windows/Linux checks.

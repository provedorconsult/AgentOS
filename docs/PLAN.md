# PLAN

## Summary

Close the 2026-06-19 RC trust-gate delta in strict priority order while preserving `docs/ARCHITECTURE.md` as the canonical source: false-success evidence and secret scanning first, then path containment, state/YAML contracts, doctor/CI integrity, documentation and GitHub governance.

Final RC hardening adds the missing traceability chain: `SPEC -> PLAN -> task.files -> Git diff -> evidence -> review -> tag -> prerelease`.

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

### Task 007 - Final RC Traceability Gates

- Goal: enforce real Git diff scope, discover every harness JSON file, extend structured secret assignment scanning and block release publication without formal review.
- Editable files: `scripts/validate-edit-scope.mjs`, `scripts/validate-sprint-json.mjs`, `scripts/validate-no-secrets.mjs`, `scripts/doctor.mjs`, `core/schemas/sprint.schema.json`, `tests/*.test.mjs`, `.harness/*`, `.github/workflows/ci.yml`, `package.json`, `README.md`, `CHANGELOG.md`, `docs/*.md`
- Verification: `npm ci`, `npm audit --audit-level=moderate`, `npm run doctor`, `npm run validate`, `npm test`, `git diff --check`, `git status --porcelain`

### Task 008 - Claude Code VSCode Coexistence

- Goal: install a `CLAUDE.md` instructions surface through the `claude-code` adapter so Claude Code and Codex coexist in VSCode, without coupling `core/` to `.claude/`.
- Editable files: `adapters/claude-code/*`, `scripts/agentos-install-adapter.mjs`, `scripts/validate-adapters.mjs`, `scripts/doctor.mjs`, `CLAUDE.md`, `tests/agentos-claude-code-adapter.test.mjs`, `docs/*.md`, `README.md`, `CHANGELOG.md`, `.harness/*`
- Verification: `npm run doctor`, `npm run validate:adapters`, `npm test`, `npm run validate`

### Task 009 - Audit Correction Phases 1-3

- Goal: implement the decided audit corrections (trust reconciliation, legacy hygiene and refinements) per `docs/AUDIT_RESPONSES.md`, keeping the deprecated workflow removal gated on the prerelease.
- Editable files: `.github/workflows/*`, `scripts/*`, `codex-layer/*`, `docs/*`, `core/rules/security.md`, `core/skills/*`, `specpilot/validators/README.md`, `tests/*`, `CONTRIBUTING.md`, `CHANGELOG.md`, `.harness/*`
- Verification: `npm run doctor`, `npm run validate:adapters`, `npm test`, `npm run validate`, `git diff --check`

### Task 010 - Workflow Action Refresh and Review Reconciliation

- Goal: absorb the pending GitHub Actions SHA refreshes through declared sprint scope, keep every workflow pinned by immutable SHA, and reconcile `docs/REVIEW.md` with the post-PR-14 repository state.
- Editable files: `.github/workflows/*`, `docs/REVIEW.md`, `CHANGELOG.md`, `docs/PLAN.md`, `.harness/*`
- Verification: `npm run doctor`, `npm run validate:templates`, `npm run validate:context`, `npm run validate:state`, `npm run validate:secrets`, `npm run validate:scope`, `npm run validate:workflows`, `npm run validate:adapters`, `npm run validate:docs`, `npm run validate:license`, `git diff --check`, `gh pr checks`

### Task 011 - Residual Documentation Reconciliation

- Goal: remove stale governance, PR-state and prerelease wording from canonical docs after PR #15, without touching historical audit artifacts.
- Editable files: `README.md`, `docs/SPEC.md`, `docs/PLAN.md`, `docs/GITHUB_SETUP.md`, `docs/REVIEW.md`, `CHANGELOG.md`, `.harness/*`
- Verification: `npm run doctor`, `npm run validate:templates`, `npm run validate:context`, `npm run validate:state`, `npm run validate:secrets`, `npm run validate:scope`, `npm run validate:docs`, `npm run validate:license`, `git diff --check`

## Risks

- real deploy remains intentionally blocked without `AGENTOS_DEPLOY_COMMAND`;
- branch protection remains a GitHub-side dependency and can still drift from the documented governance contract;
- tag and prerelease publication remain blocked until required checks are green and the owner completes the explicit release action;
- if branch protection re-enables required review before a second eligible maintainer exists, release publication can become operationally blocked again.

## Separate audit slice — F0-AUD-003 (2026-11-11)

Remediate the vulnerable transitive fast-uri lockfile entry and document current governance drift under SPEC R4/R7. Scope is declared in `.harness/sprints/2026-11-11-f0-aud-003.json`. Keep the slice blocked until administrative protection readback and independent review; do not add Hermes runtime scope or modify closed sprints. Verification: lockfile-only npm audit, complete existing Windows/Linux CI, diff hygiene and external protection readback.

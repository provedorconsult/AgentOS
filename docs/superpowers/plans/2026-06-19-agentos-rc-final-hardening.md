# AgentOS RC Final Hardening Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Enforce the remaining RC gates that connect SpecPilot task scope, discovered harness files, security scanning, review evidence and release governance.

**Architecture:** Add one Git-diff scope validator and extend existing harness/security validators rather than creating a runtime service. The sprint remains the source of authorized edits, `docs/REVIEW.md` is the release evidence ledger, and tag/prerelease remain blocked unless formal GitHub review is available.

**Tech Stack:** Node.js ESM, built-in `node:test`, Git CLI via `spawnSync`, Ajv 2020-12, YAML parser already pinned in `package-lock.json`.

---

## File Structure

- `scripts/validate-edit-scope.mjs`: CLI gate comparing real Git changes against the active or last verified sprint.
- `scripts/validate-sprint-json.mjs`: discovery mode for templates, sprints and archive JSON files.
- `scripts/validate-no-secrets.mjs`: assignment parser for special-character secrets and optional history scan command.
- `scripts/doctor.mjs`: required-file coverage for the new validators and tests.
- `tests/agentos-edit-scope.test.mjs`: RED/GREEN coverage for out-of-scope edits, action mismatches, evidence exceptions and path safety.
- `tests/agentos-harness-discovery.test.mjs`: RED/GREEN coverage for automatic harness discovery and state pointer rules.
- `tests/agentos-secret-scan-extended.test.mjs`: RED/GREEN coverage for special characters, structured files, placeholders and redaction.
- `.harness/sprints/2026-06-19-agentos-rc-final-hardening.json`: declared sprint scope and verification evidence.
- `.harness/project-state.json` and `.harness/current.txt`: active pointer during work, verified pointer at completion.
- `.github/workflows/ci.yml` and `package.json`: run the new scope/discovery gates in CI and local validation.
- `README.md`, `CHANGELOG.md`, `docs/SPEC.md`, `docs/PLAN.md`, `docs/RELEASE.md`, `docs/REVIEW.md`: current RC documentation and release decision.

## Tasks

### Task 1: Edit-Scope Gate

**Files:**
- Create: `scripts/validate-edit-scope.mjs`
- Create: `tests/agentos-edit-scope.test.mjs`
- Modify: `package.json`
- Modify: `scripts/doctor.mjs`
- Modify: `.harness/sprints/2026-06-19-agentos-rc-final-hardening.json`

- [ ] **Step 1: Write failing edit-scope tests**

Create tests that initialize a temporary Git repo, declare a sprint with `task.files[]`, then prove extra files, undeclared renames, wrong create/delete actions, traversal paths and absolute paths fail, while declared files, evidence files, spaces in filenames, empty diffs and multiple tasks pass.

- [ ] **Step 2: Verify RED**

Run: `npm test -- tests/agentos-edit-scope.test.mjs`

Expected: FAIL because `scripts/validate-edit-scope.mjs` does not exist.

- [ ] **Step 3: Implement the validator**

Use `git diff --name-status -z`, `git merge-base`, `resolveInsideRoot`, active sprint discovery from project state, strict action matching and scope-policy exceptions.

- [ ] **Step 4: Verify GREEN**

Run: `npm test -- tests/agentos-edit-scope.test.mjs`

Expected: PASS.

### Task 2: Harness Discovery

**Files:**
- Modify: `scripts/validate-sprint-json.mjs`
- Create: `tests/agentos-harness-discovery.test.mjs`
- Modify: `.harness/templates/project-state.json`
- Modify: `package.json`

- [ ] **Step 1: Write failing discovery tests**

Create tests proving `--discover` automatically validates a new sprint without package edits, rejects invalid JSON, duplicate sprint ids, invalid archive files, current pointers to archive, unknown JSON files and invalid templates.

- [ ] **Step 2: Verify RED**

Run: `npm test -- tests/agentos-harness-discovery.test.mjs`

Expected: FAIL because `--discover` is not implemented.

- [ ] **Step 3: Implement discovery**

Classify `.harness/templates/*.json`, `.harness/sprints/*.json` and `.harness/archive/*.json`; ignore hidden/backup files; validate state pointers and duplicate ids.

- [ ] **Step 4: Verify GREEN**

Run: `npm test -- tests/agentos-harness-discovery.test.mjs`

Expected: PASS.

### Task 3: Secret Scanner Extension

**Files:**
- Modify: `scripts/validate-no-secrets.mjs`
- Create: `tests/agentos-secret-scan-extended.test.mjs`
- Modify: `package.json`

- [ ] **Step 1: Write failing security tests**

Create tests for assignments with `!`, `@`, `#`, `=`, quoted values, base64, YAML, JSON, Markdown and comments; confirm placeholders pass and full secret values are redacted.

- [ ] **Step 2: Verify RED**

Run: `npm test -- tests/agentos-secret-scan-extended.test.mjs`

Expected: FAIL because the current assignment regex misses special characters.

- [ ] **Step 3: Implement parser**

Parse line-by-line for `NAME=VALUE`, `NAME: VALUE` and JSON-style `"NAME": "VALUE"` with sensitive-name detection, placeholder allowlist and redacted diagnostics.

- [ ] **Step 4: Verify GREEN**

Run: `npm test -- tests/agentos-secret-scan-extended.test.mjs`

Expected: PASS.

### Task 4: Docs, CI and Release Governance

**Files:**
- Modify: `.github/workflows/ci.yml`
- Modify: `README.md`
- Modify: `CHANGELOG.md`
- Modify: `docs/SPEC.md`
- Modify: `docs/PLAN.md`
- Modify: `docs/RELEASE.md`
- Modify: `docs/REVIEW.md`
- Modify: `.harness/project-state.json`
- Modify: `.harness/current.txt`

- [ ] **Step 1: Consolidate evidence docs**

Restructure `docs/REVIEW.md` with the required current-RC headings and move historical PR details under a non-confusing historical section.

- [ ] **Step 2: Align CI and docs**

Ensure CI runs `npm ci`, `npm audit`, `npm run doctor`, `npm run validate`, `git diff --check` and `git status --porcelain`, with scope validation included once via `npm run validate`.

- [ ] **Step 3: Final verification**

Run: `npm ci`, `npm audit --audit-level=moderate`, `npm run doctor`, `npm run validate`, `npm test`, `git diff --check`, `git status --porcelain`.

Expected: all exit `0`.

- [ ] **Step 4: Publish PR**

Commit in small slices, push `fix/agentos-rc-final-hardening`, open PR, wait for CI, request formal reviewer, merge only if GitHub records `APPROVE` without bypass. If no eligible reviewer exists, leave the PR unmerged, document `BLOCKED`, and do not tag or prerelease.

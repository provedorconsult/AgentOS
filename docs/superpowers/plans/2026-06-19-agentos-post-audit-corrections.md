# AgentOS Post-Audit Corrections Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Close the post-merge P0/P1 findings so AgentOS contracts, configuration, paths, security gates, CI, and release documentation fail closed.

**Architecture:** Execute JSON Schema Draft 2020-12 with Ajv before existing semantic checks. Keep cross-field rules in `agentos-contracts.mjs`, validate `agentos.yaml` through a dedicated schema, canonicalize paths before forbidden-directory checks, and retain Node as the single secret scanner.

**Tech Stack:** Node.js 22+, node:test, Ajv Draft 2020-12, YAML 2.9, GitHub Actions.

---

### Task 1: Executable JSON Schema enforcement

**Files:**
- Create: `scripts/lib/json-schema.mjs`
- Modify: `scripts/lib/agentos-contracts.mjs`
- Modify: `core/schemas/task.schema.json`
- Modify: `core/schemas/sprint.schema.json`
- Modify: `core/schemas/project-state.schema.json`
- Test: `tests/agentos-post-audit-corrections.test.mjs`

- [ ] Add negative tests for numeric task IDs, empty titles, null goals, string contexts, nested unknown fields, extra evidence fields, and invalid project-state fields.
- [ ] Run the focused test and confirm those invalid structures are accepted by the baseline.
- [ ] Compile and execute the schemas with Ajv before semantic validation.
- [ ] Preserve existing semantic rules for evidence coverage, lifecycle, filesystem state, and pointers.
- [ ] Run focused and full tests.

### Task 2: Complete YAML semantics

**Files:**
- Create: `core/schemas/agentos-config.schema.json`
- Modify: `scripts/lib/agentos-config.mjs`
- Test: `tests/agentos-post-audit-corrections.test.mjs`

- [ ] Add negative tests for string verification flags, invalid project status, malformed adapter arrays, invalid pack flags, missing workflow, and invalid semantic version.
- [ ] Run the focused test and confirm the baseline accepts or silently converts the invalid values.
- [ ] Validate parsed YAML through Ajv and remove silent boolean coercion.
- [ ] Run focused and full tests.

### Task 3: Closed-path and secret refinements

**Files:**
- Modify: `scripts/lib/agentos-config.mjs`
- Modify: `scripts/lib/agentos-contracts.mjs`
- Modify: `scripts/validate-no-secrets.mjs`
- Test: `tests/agentos-post-audit-corrections.test.mjs`

- [ ] Add tests for symlink aliases into forbidden directories, root-as-editable, Windows/UNC/POSIX absolute syntax, and prefixed secret assignments.
- [ ] Confirm the baseline failures.
- [ ] Check forbidden directories after realpath normalization, reject cross-platform absolute syntax, reject editable `"."`, and strengthen assignment matching.
- [ ] Run focused and full tests.

### Task 4: CI, doctor, and dependency policy

**Files:**
- Modify: `.github/workflows/ci.yml`
- Create: `.github/dependabot.yml`
- Modify: `scripts/doctor.mjs`
- Modify: `package.json`
- Modify: `package-lock.json`
- Test: `tests/agentos-post-audit-corrections.test.mjs`

- [ ] Add contract tests for `npm audit`, minimal permissions, timeout, concurrency, Dependabot, and required post-audit test presence.
- [ ] Confirm the baseline workflow fails those assertions.
- [ ] Add the CI and doctor gates.
- [ ] Run dependency audit, focused tests, and full validation.

### Task 5: Harness and release documentation

**Files:**
- Create: `.harness/sprints/2026-06-19-agentos-post-audit-corrections.json`
- Modify: `.harness/current.txt`
- Modify: `.harness/project-state.json`
- Modify: `README.md`
- Modify: `CHANGELOG.md`
- Modify: `docs/SPEC.md`
- Modify: `docs/PLAN.md`
- Modify: `docs/REVIEW.md`
- Modify: `docs/RELEASE.md`

- [ ] Record the new sprint and keep it active until local and remote gates are green.
- [ ] Put `npm ci` first in Quick Start and remove dependency contradictions.
- [ ] Document executable schemas, YAML semantics, security refinements, CI changes, and the explicit administrative merge policy.
- [ ] Run documentation and complete validation gates.

### Task 6: Publication and governance verification

- [ ] Commit the scoped changes in small logical commits.
- [ ] Push `fix/agentos-post-audit-corrections` and open a ready-for-review PR.
- [ ] Confirm the PR is blocked by required review after all checks pass.
- [ ] Record that governance evidence, then use the user-authorized administrative merge because no external collaborator exists.
- [ ] Restore and verify branch-protection review requirements.
- [ ] Verify post-merge CI on `main`.

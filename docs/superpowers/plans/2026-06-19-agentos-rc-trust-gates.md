# AgentOS RC Trust Gates Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Eliminate the P0/P1 false-success risks in AgentOS 2.0 RC and publish the changes through reviewed, cross-platform CI.

**Architecture:** Keep validators local and file-first, but use the maintained `yaml` parser for configuration syntax and duplicate-key safety. Centralize repository path containment and semantic contract checks in `scripts/lib`, with Node as the single secret-scanner implementation.

**Tech Stack:** Node.js 22+, node:test, YAML, JSON schemas, GitHub Actions.

---

## Revised scope

The supplied plan correctly prioritizes trust gates, but mixes three delivery boundaries. This execution keeps P0/P1 code, tests, CI and documentation in the implementation branch. Installer/deploy P2 improvements remain follow-up work. Branch protection, formal external review, tag and GitHub prerelease occur only after the implementation PR is green and the required GitHub governance is available.

### Task 1: Evidence and lifecycle semantics

- [ ] Add failing tests for false-success evidence, undeclared commands, missing criteria, invalid lifecycle states and missing final review.
- [ ] Enforce evidence status, exit code, declared commands, exact criterion coverage, `agentGoal`, blocker and review semantics.
- [ ] Align task and sprint templates and schemas.

### Task 2: Secret scanning

- [ ] Add a failing mixed placeholder/live-token regression test.
- [ ] Scan global regex matches per occurrence and redact values in diagnostics.
- [ ] Replace the PowerShell regex implementation with a wrapper around the Node scanner.

### Task 3: Closed repository paths

- [ ] Add traversal, external absolute path, symlink escape and read-only/editable overlap tests.
- [ ] Implement `resolveInsideRoot` and apply it to task, sprint and state references.

### Task 4: Schemas, state and YAML

- [ ] Add invalid sprint/state/config tests.
- [ ] Replace regex YAML parsing with the `yaml` package and validate required values.
- [ ] Define complete local schemas and document that semantic cross-field rules are enforced by JavaScript.

### Task 5: Doctor, CI and documentation

- [ ] Remove the DOCX from runtime-required doctor surfaces and enforce Node 22+.
- [ ] Run `npm ci`, canonical gates and clean-worktree checks on Windows and Linux.
- [ ] Reconcile SPEC, PLAN, REVIEW, SECURITY and release-candidate wording.

### Task 6: Publication and governance

- [ ] Run all local gates and commit in scoped increments.
- [ ] Push the branch and open a PR.
- [ ] Require green Windows/Linux checks and formal review before merge.
- [ ] Configure branch protection if repository permissions allow.
- [ ] Create the RC tag/release only after governance gates are proven.

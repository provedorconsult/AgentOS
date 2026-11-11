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
- harden evidence semantics, secret scanning and closed repository paths;
- parse and validate `agentos.yaml` with the pinned `yaml` package;
- execute Draft 2020-12 schemas with Ajv before semantic validation;
- reject forbidden-directory symlink aliases and foreign absolute path syntax;
- run dependency auditing and least-privilege CI policy remotely;
- compare real Git diff paths and actions with sprint-declared editable scope;
- discover harness templates, sprints and archive files automatically instead of relying on hardcoded package lists;
- scan structured secret assignments with quoted values, special characters and base64-like values;
- require explicit GitHub governance before merge, tag or prerelease, with formal review whenever branch protection requires it;
- reconcile release-candidate docs, changelog and review evidence;
- keep deploy contract-only and fail closed when no real target exists.

Out of scope:

- real deployment without an approved `AGENTOS_DEPLOY_COMMAND`;
- dashboard, database, scheduler, channels, remote runtime, executable memory, heartbeats, routines or knowledge-db;
- functional Antigravity adapters;
- Claude Code `.claude/` agents, skills or runtime generation (the `CLAUDE.md` instructions surface is in scope through R9);
- product/runtime dependencies unrelated to validation.

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

### R6 - Trust Gates Fail Closed

Acceptance criteria:

- verified/done evidence requires declared commands, exit code `0`, status `passed` and exact criterion coverage;
- placeholders cannot suppress another secret occurrence in the same file;
- operational paths cannot resolve outside the repository, including through symlinks;
- `agentGoal`, sprint state, project state and YAML values are validated before completion.

### R7 - Executable Contracts and Post-Audit Integrity

Acceptance criteria:

- task, sprint, project-state and AgentOS configuration schemas execute through Ajv;
- nested additional properties and invalid scalar types are rejected;
- verification flags must be literal booleans and cannot silently disable policy;
- prefixed secret assignments such as `DB_PASSWORD` are detected;
- CI runs dependency audit with read-only permissions, timeout and concurrency controls.

### R8 - Final RC Traceability

Acceptance criteria:

- `validate-edit-scope.mjs` rejects undeclared changed files, wrong create/modify/delete actions, unsafe paths and undeclared renames;
- `validate-sprint-json.mjs --discover` validates templates, sprints and archive JSON files without package hardcoding;
- `validate-no-secrets.mjs` detects structured assignments such as `DB_PASSWORD`, `SERVICE_SECRET`, `CUSTOM_TOKEN`, `API_KEY`, `PRIVATE_KEY`, `ACCESS_TOKEN` and `CLIENT_SECRET`;
- `docs/REVIEW.md` records current commit, PR, governance, CI, local verification, negative tests, scope validation, dependency audit, security and release decision;
- no tag or GitHub prerelease is created until CI is green and the release governance documented in `docs/RELEASE.md` and `docs/REVIEW.md` is satisfied; when branch protection requires review, that approval must be a non-bypass `APPROVE`.

### R9 - Claude Code VSCode Coexistence

Authorized by the 2026-07-04 user request to add Claude Code compatibility in VSCode coexisting with Codex.

Expected behavior:

- the `claude-code` adapter installs a `CLAUDE.md` instructions surface;
- Claude Code and Codex can drive the same repository without conflicting files;
- AgentOS core stays independent from `.claude/` and `CLAUDE.md`.

Acceptance criteria:

- `npm run agentos:install-adapter -- claude-code` installs only `CLAUDE.md`, with backup of an existing destination;
- installing `codex` and `claude-code` into the same target keeps `.codex/` and `AGENTS.md` byte-identical to the Codex install;
- the repository root `CLAUDE.md` mirrors the `AGENTS.md` source order;
- adapter, IDE compatibility and architecture docs reflect the new supported status without stale placeholder claims.

### R10 - Audit Correction Phases 1-3

Authorized by the 2026-07-04 decisions recorded in `docs/AUDIT_RESPONSES.md` over `docs/AUDIT_CORRECTION_PLAN.md`.

Expected behavior:

- the environment-health workflow runs the canonical Node doctor with SHA-pinned actions;
- doctor fails with an actionable `npm ci` hint when pinned dependencies are missing;
- control-plane era documents and duplicated PowerShell helpers are fenced as legacy;
- the operational security guardrails document no longer collides with the root security policy;
- codex-layer hooks have POSIX shims delegating to the canonical validators;
- `AGENTS.md` and `CLAUDE.md` source order cannot drift silently.

Acceptance criteria:

- no workflow references `scripts/doctor.ps1` and every workflow `uses:` is pinned by immutable SHA;
- `npm run validate:adapters` fails when `CLAUDE.md` source order drifts from `AGENTS.md`;
- archived documents carry a legacy banner and are indexed under `docs/legacy/`;
- the deprecated numbered workflows remain in place; their removal is announced and gated on one release cycle after the `2.0.0-rc.1` prerelease.

## Constraints

- Keep dependencies minimal, pinned and audit-clean.
- Do not remove compatibility files unless they are clearly deprecated.
- Do not perform a real deploy.

## R11 - Auditoria pública e hardening (ordem 2026-11-11)

Executar auditoria de exposição pública, histórico alcançável, documentação, Actions, dependências e governança. Corrigir scanner, workflows e dependência vulnerável com regressões e evidências. Os sete entregáveis em docs/security-audit são obrigatórios. Não alterar Ruleset 27031355, visibilidade, permissões/secrets GitHub, credenciais, histórico, produção ou outros repositórios; sem merge, deploy ou release. Distinguir configuração de enforcement e ausência de alertas de ausência comprovada de segredos.

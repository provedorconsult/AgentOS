# REVIEW

## Rodada atual — coordenação e governança PR #21

HEAD inicial a89440920fe8382ceff21807df6a9e06f67173cd; PR #20 fixada em 9b30bec1ec72d861c984dda1e24e5e80adafa4e6. Consolidação documental/evidencial, sem merge; dependências byte a byte idênticas. [Relatório corrente](security-audit/COORDINATION_GOVERNANCE.md) e [comandos/exit codes](security-audit/COORDINATION_EVIDENCE.json) superam as afirmações antigas de estado/CI abaixo. Validação local concluída: 66/66 testes completos e 17/17 de segurança pública, zero falhas/skip; CI do SHA final será conferido no handoff externo. Bypass global UNKNOWN; mínimo humano zero no ruleset visível; Draft e Hermes F1 bloqueada.


### Comandos da combinação final — rodada atual

| Comando | Exit code | Resultado |
|---|---:|---|
| `npm ci --ignore-scripts` | 0 | PASS |
| `npm run doctor` | 0 | PASS |
| `npm run validate` | 0 | PASS |
| `node --test tests/agentos-public-security.test.mjs` | 0 | PASS |
| `npm run validate:secrets:history` | 0 | PASS |
| `npm audit --audit-level=moderate --json` | 0 | PASS |
| `bash scripts/run-gitleaks.sh` | 0 | PASS |
| `git diff --check` | 0 | PASS |

Limites: Linux local; sem lifecycle scripts; histórico somente refs locais (58/536 antes da publicação); CI novo ainda a conferir no handoff externo. Administração não alterada.

## Auditoria pública 2026-11-11 — estado da entrega inicial

Os registros abaixo deste bloco são históricos e não provam estado atual. Base main: e2eedcc6249e08c389aef6282bcb13ae40d2f76a. Branch security/public-exposure-hardening. Evidências completas, riscos e comandos em [handoff de segurança](security-audit/CHECKER_HANDOFF.md). main agora retorna protected=true e Ruleset 27031355 active, sem comprovação global de ausência de bypass actors. A antiga observação de main desprotegida foi superada pela consulta atual, sem reescrever a evidência histórica.

| Command | Environment | Exit Code | Result | Evidence | Criterion | Limitations | Residual Risk |
|---|---|---|---|---|---|---|---|
| Checks locais de segurança | workspace isolado | ver EVIDENCE.json | ver evidências | docs/security-audit/EVIDENCE.json | Auditoria pública | Sem comprovação de produção | Scanners não provam ausência |

## Registros históricos preservados


## Current Release Candidate

- Package metadata: `2.0.0-rc.1`.
- Formal prerelease: not published.
- Release decision: merge work is complete on `main`; prerelease publication remains a separate explicit owner action after release-gate review.

## Current Commit

- Current `main`: `34dfce1e279c7045ce8e02cc57d7e58bccfb8ef4`.
- Current main source: merge commit for PR [#15](https://github.com/provedorconsult/AgentOS/pull/15), `chore: refresh workflow pins and review state`.
- Working branch: none required for the current mainline baseline.
- Previous merged baseline: `96927ff14798bc98442a3acf5fe014d1cac4700b` from PR #14.

## Current Pull Request

- PR: none active for the current mainline baseline.
- Latest merged PR: [#15](https://github.com/provedorconsult/AgentOS/pull/15).
- Latest PR author: `provedorconsult`.
- Latest merge decision: owner-approved merge after required checks passed.
- Latest merge commit: `34dfce1e279c7045ce8e02cc57d7e58bccfb8ef4`.
- Tag: not created.
- GitHub prerelease: not created.

## Governance

- `main` branch protection must require Ubuntu and Windows validation checks plus checklist status.
- Required review is currently disabled; the 2026-07-04 branch protection readback shows required status checks plus conversation resolution, with no active required-review rule.
- Owner-approved merge is allowed after required checks pass and conversation resolution is clean.
- Administrative bypass remains unnecessary for normal development flow.
- Issue [#12](https://github.com/provedorconsult/AgentOS/issues/12) is superseded by this governance policy change.
- PR #7, PR #8 and PR #11 remain historical evidence only.
- Dependabot PRs #9 and #10 were closed as superseded by PR #15 because they failed `validate:scope` outside an active sprint.

## CI Evidence

- Current mainline baseline:
  - PR [#15](https://github.com/provedorconsult/AgentOS/pull/15): merged at `2026-07-04T12:14:22Z`.
  - Merge commit: `34dfce1e279c7045ce8e02cc57d7e58bccfb8ef4`.
  - Ubuntu, Windows and checklist checks passed before merge.
  - PR [#14](https://github.com/provedorconsult/AgentOS/pull/14) remains the previous merged baseline.

The verification sections below are cumulative evidence across merged hardening slices. Only the `Current ...` sections above describe the live repository baseline.

## Local Verification

| Command | Environment | Exit Code | Result | Evidence | Criterion | Limitations | Residual Risk |
|---|---|---:|---|---|---|---|---|
| `node --version` | Windows local | 0 | `v24.15.0` | Node runtime available. | Runtime prerequisite. | Local host only. | None. |
| `npm --version` | Windows local | 0 | `11.12.1` | npm runtime available. | Package manager prerequisite. | Local host only. | None. |
| `npm ci` with repo-local npm cache | Windows local | 0 | Dependencies installed. | Default npm cache returned EPERM; repo-local cache succeeded. | Reproducible install. | Local cache workaround. | None after workaround. |
| `npm audit --audit-level=moderate` | Windows local | 0 | `found 0 vulnerabilities`. | Moderate-or-higher audit clean. | Dependency audit. | Current dependency graph only. | None known. |
| `npm run doctor` | Windows local | 0 | AgentOS doctor passed. | Required files and prerequisites present. | Doctor gate. | Local host only. | None known. |
| `npm run validate` | Windows local | 0 | Final validation passed. | Doctor, discovery, context, state, secrets, scope, workflows, adapters, docs, license and tests passed. | Complete local validation. | Local host only. | None known. |
| `npm test` | Windows local | 0 | `38` tests passed. | Edit-scope, harness discovery and extended secret scanner regressions passed. | Test suite. | Node test suite only. | None known. |
| `git diff --check` | Windows local | 0 | Final whitespace check passed. | No whitespace errors. | Diff hygiene. | Local diff only. | None known. |
| `gh pr checks 11 --repo provedorconsult/AgentOS` | GitHub Actions | 0 | Checklist, Ubuntu and Windows passed before governance policy update. | Cross-platform CI green for PR #11 head `13f188e`. | A docs-only governance policy commit requires a refreshed check run after push. | None if checks remain green. |
| `gh api repos/provedorconsult/AgentOS/branches/main/protection` | GitHub API | 0 | Strict checks, one approval, last-push approval, admin enforcement, force-push/deletion disabled before policy update. | Branch protection readback. | Must remove required review to align with owner-merge policy. | None after readback confirms review rule removed. |

## Negative Tests

- Edit-scope test coverage rejects undeclared extra files, undeclared renames, wrong create/delete/modify actions, traversal paths and absolute paths.
- Harness discovery test coverage rejects invalid JSON, duplicate sprint ids, invalid archive files, current pointers to archive files, unknown template JSON and invalid templates.
- Secret scanner test coverage rejects special-character assignments, base64-like values, YAML assignments, JSON assignments, Markdown assignments and comment assignments.
- Existing negative coverage still rejects false-success evidence, path escapes, invalid schema values, YAML type bypasses and secret occurrence masking.

## Scope Validation

- Validator: `scripts/validate-edit-scope.mjs`.
- Default base: merge-base of `HEAD` and `origin/main`; fallback is `HEAD` when `origin/main` is unavailable.
- Scope source: `.harness/project-state.json` current sprint, then last verified sprint, then `.harness/current.txt`.
- Required contract: every changed file must match `task.files[]` action unless explicitly allowed by `scopePolicy`.
- Current sprint exceptions: `docs/REVIEW.md`, `.harness/current.txt`, `.harness/project-state.json`.
- Latest verified scope result: passed with `10` changed path records for sprint `2026-07-04-workflow-action-refresh`.

## Dependency Audit

- `npm audit --audit-level=moderate` is required locally and in CI.
- Current baseline result: zero moderate-or-higher vulnerabilities.

## Security

- Secret scanner now parses `NAME=VALUE`, `NAME: VALUE` and JSON-style `"NAME": "VALUE"` assignments.
- Sensitive names include password, secret, token, API key, private key, access token and client secret variants.
- Diagnostics redact values and preserve placeholder allowlists such as `REPLACE_ME`, `${VAR}`, `<token>` and `YOUR_TOKEN_HERE`.
- Optional history command: `npm run validate:secrets:history`. It is intentionally documented as a conservative local scan and does not claim unreachable-object coverage.

## Residual Risks

- Independent formal review is optional until an eligible reviewer exists; owner-approved merge is the active governance path.
- Tag and GitHub prerelease remain blocked until formal review and CI complete.
- Real deploy remains intentionally fail-closed without `AGENTOS_DEPLOY_COMMAND`.

## Release Decision

`MERGE WORK COMPLETE; OWNER RELEASE ACTION PENDING.` Required checks are green on the latest merged baseline, and prerelease publication remains an explicit owner decision.

## 2026-07-04 Claude Code VSCode Coexistence

Sprint: `.harness/sprints/2026-07-04-claude-code-vscode-compat.json`. Authorized by the 2026-07-04 user request; SPEC R9 records the slice.

| Command | Environment | Exit Code | Result | Evidence | Criterion | Limitations | Residual Risk |
|---|---|---:|---|---|---|---|---|
| `npm test` | Linux local | 0 | `40` tests passed. | New claude-code regression proves `.codex/config.toml` and `AGENTS.md` stay byte-identical after installing `codex` then `claude-code` into the same target. | Coexistence with Codex. | Node test suite only. | None known. |
| `npm run doctor` | Linux local | 0 | AgentOS doctor passed. | `CLAUDE.md` and `adapters/claude-code/templates/CLAUDE.md` added to the required surfaces. | Root CLAUDE.md present. | Local host only. | None known. |
| `npm run validate:adapters` | Linux local | 0 | Adapter validation passed. | claude-code README, mapping and template checks enforce CLAUDE.md mapping, coexistence and backup guidance. | Adapter documentation contract. | Regex-based checks only. | None known. |
| `npm run validate` | Linux local | 0 | Full validation passed. | Templates, context, state, secrets, edit scope, workflows, adapters, docs, license and tests green after the documentation updates. | Docs reflect the slice. | Local host only; Windows and Ubuntu CI reruns happen at PR time. | CI must confirm on Windows and Ubuntu. |

## 2026-07-04 Audit Correction Phases 1-3

Sprint: `.harness/sprints/2026-07-04-audit-corrections.json`. Decisions: `docs/AUDIT_RESPONSES.md`. SPEC R10 records the slice.

Governance note (Q9): owner-approved merge remains a temporary exception; required review must be re-enabled for `main` when a second eligible maintainer exists. Automated agent review complements but never replaces human review for merges to `main` or release publication.

Errata (Q11 policy applied): audit finding 12.8 in `docs/AUDIT_CLAUDE.md` claimed `docs/superpowers/plans/2026-06-19-agentos-rc-final-hardening.md` was missing; the file exists and the finding was annulled in place. The historical sprint record was not modified. Closed sprints are immutable; later discrepancies become errata like this one.

| Command | Environment | Exit Code | Result | Evidence | Criterion | Limitations | Residual Risk |
|---|---|---:|---|---|---|---|---|
| `npm run doctor` | Linux local | 0 | AgentOS doctor passed. | New surfaces (guardrails doc, legacy index, POSIX shims, new tests) required and present. | Doctor gate. | Local host only. | None known. |
| `npm run validate:adapters` | Linux local | 0 | Adapter validation passed. | Source Order drift gate between `AGENTS.md` and `CLAUDE.md` active and green. | Instruction surface alignment. | Regex/structure comparison only. | None known. |
| `npm test` | Linux local | 0 | `45` tests passed. | Doctor bootstrap hint, pinned-action workflows, POSIX shim delegation and legacy fencing regressions green. | Correction regressions. | Node test suite only. | None known. |
| `npm run validate` | Linux local | 0 | Full validation passed. | Doctor, discovery, context, state, secrets, edit scope, workflows, adapters, docs, license and tests green after the corrections. | Complete local validation. | Local host only; Windows and Ubuntu CI reruns happen at PR time. | CI must confirm on Windows and Ubuntu. |
| `git diff --check` | Linux local | 0 | No whitespace errors. | Diff hygiene clean after archive moves. | Diff hygiene. | Local diff only. | None known. |

Gated items intentionally not executed: deprecated numbered workflow removal (Q5, waits one release cycle after the `2.0.0-rc.1` prerelease); tag and prerelease publication (Q1, owner action after this reconciliation merges).

## 2026-07-04 Workflow Action Refresh and Review Reconciliation

Sprint: `.harness/sprints/2026-07-04-workflow-action-refresh.json`. Scope: absorb the pending GitHub Actions SHA refreshes through declared sprint scope and reconcile `docs/REVIEW.md` with the post-PR-14 baseline.

| Command | Environment | Exit Code | Result | Evidence | Criterion | Limitations | Residual Risk |
|---|---|---:|---|---|---|---|---|
| `npm run doctor` | Linux local | 0 | AgentOS doctor passed. | Workflow refresh edits preserved required surfaces and prerequisites. | Doctor gate. | Local host only. | None known. |
| `npm run validate:templates` | Linux local | 0 | Validated `14` harness JSON files. | New sprint declaration parsed and passed the sprint contract. | Sprint discovery. | Local host only. | None known. |
| `npm run validate:context` | Linux local | 0 | Validated context ranges in `7` JSON files. | New sprint references resolve inside the declared files. | Context contract. | Local host only. | None known. |
| `npm run validate:state` | Linux local | 0 | AgentOS state validation passed. | Active sprint pointer closed cleanly back to `lastVerifiedSprint`. | State contract. | Local host only. | None known. |
| `npm run validate:secrets` | Linux local | 0 | No secrets detected. | Workflow and docs edits introduced no secret-like assignments. | Secret scan. | Local host only. | None known. |
| `npm run validate:scope` | Linux local | 0 | Edit scope validation passed with `10` changed path records. | The SHA refreshes and review-state updates are now declared in sprint scope, unlike the failing Dependabot PRs. | Edit scope gate. | Local host only. | None known. |
| `npm run validate:workflows` | Linux local | 0 | AgentOS workflow validation passed. | Workflow manifest stayed canonical after the SHA refresh. | Workflow contract. | Does not execute GitHub Actions locally. | GitHub CI still required. |
| `npm run validate:adapters` | Linux local | 0 | Adapter validation passed. | Workflow updates did not regress adapter contracts. | Adapter contract. | Local host only. | None known. |
| `npm run validate:docs` | Linux local | 0 | AgentOS documentation validation passed. | `docs/REVIEW.md` and `CHANGELOG.md` stayed link-clean after the reconciliation. | Documentation contract. | Local host only. | None known. |
| `npm run validate:license` | Linux local | 0 | AgentOS license and metadata validation passed. | Workflow refresh left metadata coherent. | Metadata contract. | Local host only. | None known. |
| `git diff --check` | Linux local | 0 | No whitespace errors. | Diff hygiene clean for the workflow-refresh slice. | Diff hygiene. | Local diff only. | None known. |
| `gh pr checks` | GitHub Actions | 0 | PR #15 passed checklist, Ubuntu and Windows validations. | Required remote checks are green for the workflow-refresh branch. | Remote CI gate. | Depends on GitHub-hosted runners. | None known. |

## 2026-07-04 Residual Documentation Reconciliation

Sprint: `.harness/sprints/2026-07-04-doc-residual-reconciliation.json`. Scope: remove stale canonical governance, prerelease and current-state wording after PR #15 without rewriting historical audit artifacts.

| Command | Environment | Exit Code | Result | Evidence | Criterion | Limitations | Residual Risk |
|---|---|---:|---|---|---|---|---|
| `npm run doctor` | Linux local | 0 | AgentOS doctor passed. | Canonical docs and harness updates preserved required repository surfaces. | Doctor gate. | Local host only. | None known. |
| `npm run validate:templates` | Linux local | 0 | Validated `15` harness JSON files. | New sprint declaration parsed and passed the sprint contract. | Sprint discovery. | Local host only. | None known. |
| `npm run validate:context` | Linux local | 0 | Validated context ranges in `8` JSON files. | New sprint references resolve inside the declared files. | Context contract. | Local host only. | None known. |
| `npm run validate:state` | Linux local | 0 | AgentOS state validation passed. | The slice was closed cleanly back to `lastVerifiedSprint`. | State contract. | Local host only. | None known. |
| `npm run validate:secrets` | Linux local | 0 | No secrets detected. | Documentation edits introduced no secret-like assignments. | Secret scan. | Local host only. | None known. |
| `npm run validate:scope` | Linux local | 0 | Edit scope validation passed with `9` changed path records. | The residual-doc updates stayed inside the declared sprint scope. | Edit scope gate. | Local host only. | None known. |
| `npm run validate:docs` | Linux local | 0 | AgentOS documentation validation passed. | Canonical docs now align with the current owner-approved governance contract and the post-PR-15 baseline. | Documentation contract. | Local host only. | None known. |
| `npm run validate:license` | Linux local | 0 | AgentOS license and metadata validation passed. | Documentation reconciliation left metadata coherent. | Metadata contract. | Local host only. | None known. |
| `git diff --check` | Linux local | 0 | No whitespace errors. | Diff hygiene clean for the residual-doc slice. | Diff hygiene. | Local diff only. | None known. |

## Registro histórico preservado da PR #20

O texto abaixo descreve o momento da PR #20; a leitura atual está no relatório de coordenação/governança, que o supera como estado corrente.

## Current audit override — 2026-11-11 F0-AUD-003

This section supersedes previous current-state and zero-vulnerability claims below, which are retained as historical evidence. Base main: `e2eedcc6249e08c389aef6282bcb13ae40d2f76a`. Working branch: `fix/f0-aud-003-governance-dependency`. New commit/PR and CI identifiers are reported in the PR handoff after publication.

- main currently reports `protected=false`; detailed protection read/write is unavailable to this integration (403).
- The current lockfile audit identifies transitive `fast-uri@3.1.2` as high severity. A lockfile-only update selects 3.1.9; the post-update audit reports zero vulnerabilities at this time.
- Only fast-uri metadata changes in the dependency graph; direct dependency pins remain unchanged. No local dependency installation or lifecycle scripts executed.
- CI at the new HEAD is pending publication. Full local doctor/validate/tests are NOT_RUN; dependencies were not installed. CI must prove Windows/Linux behavior.
- Status: BLOCKED pending administrative enforcement and independent review. No merge, release, SSH or Hermes integration authorized.

| Command | Environment | Exit Code | Result | Evidence | Criterion | Limitations | Residual Risk |
|---|---|---:|---|---|---|---|---|
| npm audit --package-lock-only --ignore-scripts --json (baseline) | managed workspace, npm registry | 1 | fast-uri high severity | docs/F0-AUD-003-audit-before.json | Identify dependency | Current advisory database; not proof of runtime exploitation | High until fixed |
| npm update fast-uri --package-lock-only --ignore-scripts | isolated workspace | 0 | 3.1.2 to 3.1.9; no node_modules | lockfile diff | Minimal repair | No local runtime tests | CI pending |
| npm audit --package-lock-only --ignore-scripts --json (updated) | managed workspace, npm registry | 0 | zero vulnerabilities | docs/F0-AUD-003-audit-after.json | Audit clean | Time-dependent database | Future advisories possible |
| branch main metadata / detailed protection API | GitHub read-only | — | protected=false / HTTP 403 | docs/F0-AUD-003.md | Governance observed | Cannot apply protection | Administrative gate BLOCKED |

[Detailed audit record and administrative proposal](F0-AUD-003.md).

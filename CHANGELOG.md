# Changelog

## Unreleased

- bloquear o workflow manual de deploy sem selecionar/criar GitHub Environment até readback administrativo, autorização humana e revisão; validar referências/seletores de ambiente e preservar os gates pendentes.

- remediate F0-AUD-003: update transitive fast-uri in the lockfile from 3.1.2 to 3.1.9; record actual branch-protection drift and keep merge/release blocked pending administrative enforcement and independent review;

- auditoria pública autorizada em 2026-11-11: histórico real e redaction total no scanner, regras de leitura/checkout/input nos workflows, Gitleaks independente pinado, regressões e documentação de postura/incidentes; correção mínima de fast-uri sem alterar pins diretos; nenhuma alteração administrativa ou implantação.

- added the supported `claude-code` adapter instructions surface: `npm run agentos:install-adapter -- claude-code` installs `CLAUDE.md` with backup support and coexists with the Codex adapter in the same repository;
- added a root `CLAUDE.md` so Claude Code in VSCode follows the same AgentOS source order as Codex;
- extended doctor, adapter validation and regression tests to cover the Claude Code surfaces;
- implemented the audit correction plan phases 1-3 per `docs/AUDIT_RESPONSES.md`: canonical Node doctor in the environment-health workflow, SHA-pinned actions in all workflows, accurate SpecPilot validators index, refreshed `codex-layer/README.md`;
- doctor now fails with an `npm ci` hint instead of a raw module-not-found stack when pinned dependencies are missing;
- archived control-plane era documents under `docs/legacy/`, removed the binary EvoNexus PRD `.docx`, and marked ADR 0001 as superseded;
- removed the duplicated PowerShell doctor/validate/review/install helpers and moved the remaining control-plane helpers to `scripts/legacy/` as deprecated;
- renamed `docs/SECURITY.md` to `docs/SECURITY_GUARDRAILS.md` and promoted the short normative rules to `core/rules/security.md`;
- added POSIX hook shims for the codex-layer secret and exec-plan hooks;
- added a Source Order drift gate between `AGENTS.md` and `CLAUDE.md` to `npm run validate:adapters`;
- documented the Codex configuration policy, the self-declared evidence limitation, the closed-sprint immutability rule, the temporary owner-merge governance exception and the English-first language policy;
- removed the empty `data` skills domain until a real skill exists;
- refreshed the SHA-pinned `actions/checkout` and `actions/setup-node` references across the workflow set through a declared sprint so the Dependabot updates no longer fail `validate:scope`;
- reconciled residual canonical docs after PR #15 so release, review and prerelease wording matches the current owner-approved governance contract;
- deprecation notice: the numbered compatibility workflows (`core/workflows/04-implement.md`, `05-verify.md`, `06-finish.md`, `07-release.md`, `08-deploy.md`, `09-improve.md`) will be removed one release cycle after the `2.0.0-rc.1` prerelease is published.

## 2.0.0-rc.1 - 2026-06-19

- added edit-scope enforcement that compares Git diff paths and actions against sprint `task.files[]`;
- added automatic harness JSON discovery for templates, active sprints and archive files;
- consolidated the review evidence structure for the current release candidate;
- extended secret assignment parsing for quoted, special-character, base64, YAML, JSON, Markdown and comment cases;
- documented that formal `APPROVE` review is required before merge, tag or prerelease and that administrative bypass is not acceptable for final RC hardening;
- added executable JSON Schema Draft 2020-12 enforcement with Ajv for tasks, sprints, project state and AgentOS configuration;
- rejected malformed nested contracts, policy-flag type bypasses, cross-platform absolute paths and forbidden-directory symlink aliases;
- expanded secret assignment scanning for prefixed variables such as `DB_PASSWORD` and `SERVICE_SECRET`;
- added remote dependency audit, minimal workflow permissions, CI timeout/concurrency and Dependabot configuration;
- corrected Quick Start, release evidence and governance documentation after the trust-gate merge;
- replaced the legacy CI gate with canonical Node-based validation on Windows and Linux;
- aligned Codex adapter installation with `codex-layer/` as the canonical source;
- added state, workflow, adapter, docs and license validators;
- hardened secret scanning for `.env.example` and backup handling;
- reconciled release-candidate docs and metadata.

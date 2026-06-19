# Changelog

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
- consolidated required PR checks into `quality-gate`, split PR and release audit surfaces, removed the legacy checklist workflow and documented owner-approved squash-only merge governance;
- corrected Quick Start, release evidence and governance documentation after the trust-gate merge;
- replaced the legacy CI gate with canonical Node-based validation on Windows and Linux;
- aligned Codex adapter installation with `codex-layer/` as the canonical source;
- added state, workflow, adapter, docs and license validators;
- hardened secret scanning for `.env.example` and backup handling;
- reconciled release-candidate docs and metadata.

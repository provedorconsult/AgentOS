# Changelog

## 2.0.0-rc.1 - 2026-06-19

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

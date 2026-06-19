# AgentOS SpecPilot Fusion Migration Map

## Current Inventory

| Path | Classification | Destination | Notes |
| --- | --- | --- | --- |
| `AGENTS.md` | adapt | `AGENTS.md` | Make neutral for any agent while remaining Codex-compatible. |
| `README.md` | adapt | `README.md` | Reframe AgentOS as a generic platform with SpecPilot Engine and adapters. |
| `codex-layer/` | preserve and adapt | `adapters/codex/templates/.codex/` | Existing Codex layer becomes adapter material; source folder is preserved for compatibility in this phase. |
| `docs/AGENT_ROSTER.md` | keep and mirror | `docs/AGENT_ROSTER.md`, `core/agents/` | Existing roster remains documentation; core gains per-agent operating notes. |
| `docs/OPERATING_MODEL.md` | keep | `docs/OPERATING_MODEL.md` | Still valid as platform-level operating model. |
| `docs/QUALITY.md` | keep and reference | `docs/QUALITY.md`, `core/rules/quality-gates.md` | Quality policy becomes a universal rule source. |
| `docs/SECURITY.md` | keep and reference | `docs/SECURITY.md`, `core/rules/security.md` | Security policy becomes a universal rule source. |
| `docs/OBSERVABILITY.md` | keep and reference | `core/workflows/09-improve.md` | Improvement loop references observability evidence. |
| `templates/PROJECT_BRIEF.md` | keep | `templates/PROJECT_BRIEF.md` | Existing project intake template remains useful. |
| `templates/EXEC_PLAN.md` | keep | `templates/EXEC_PLAN.md` | Existing execution template remains alongside `docs/PLAN.template.md`. |
| `templates/QUALITY_REPORT.md` | keep | `templates/QUALITY_REPORT.md` | Review artifact template remains useful. |
| `scripts/*.ps1` | preserve | `scripts/*.ps1` | Existing PowerShell entrypoints remain as compatibility helpers. |
| `.env.example` | keep | `.env.example` | Allowed example environment file. |

## Risks

- Hidden Codex coupling can remain in root docs if only files are copied. Mitigation: keep universal concepts in `core/` and isolate Codex-specific installation under `adapters/codex/`.
- Existing `codex-layer/` users can break if the folder is removed immediately. Mitigation: preserve it during this phase and document the adapter path as the new source.
- Windows compatibility can regress if validators use shell-specific commands. Mitigation: implement validators in Node.js with no external dependencies.

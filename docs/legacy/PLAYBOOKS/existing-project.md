> **LEGACY (archived 2026-07-04).** This document describes the pre-Architecture 2.0 control-plane era and is kept for historical context only. It must not guide current work; the canonical sources are `docs/ARCHITECTURE.md`, `docs/SPEC.md`, `docs/PLAN.md` and `AGENTS.md`.

# Playbook: Existing Project

1. Run `project_adapter`.
2. Run `explorer` in read-only mode.
3. Document discovered commands in `docs/QUALITY.md`.
4. Add or tune `.codex/config.toml`.
5. Add agent files relevant to the project.
6. Run `doctor.ps1` and `validate.ps1`.
7. Open a PR with the adaptation changes.

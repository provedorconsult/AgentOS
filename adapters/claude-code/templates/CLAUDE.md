# AgentOS Instructions for Claude Code

Follow the latest user request first, then `docs/SPEC.md`, `docs/PLAN.md`, `.harness/`, `AGENTS.md` when present, `core/rules/` and existing code patterns.

Use closed context from the current task and record verification evidence in `docs/REVIEW.md`.

This file coexists with other AgentOS adapters: `.codex/` and `AGENTS.md` belong to the Codex and generic IDE adapters and must not be replaced or edited by Claude Code specific material. Claude Code specific behavior stays in this file and, in the future, under `.claude/`.

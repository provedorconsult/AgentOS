# Skills

AgentOS skills are markdown-first procedures stored under `core/skills/`. They are reusable operating instructions for agents and workflows, not executable plugins.

## Current Domains

- `dev`: specification, context and review practices.
- `security`: safety checks and secret handling.
- `product`: PRD and product-to-SPEC translation.
- `ops`: retro, handoff and operational loops.
- `data`: reserved for future data workflows.
- `docs`: documentation and handoff procedures.

## Required Format

Every skill should include:

- `Purpose`
- `When to Use`
- `Inputs`
- `Procedure`
- `Output`
- `Quality Gates`
- `Anti-Patterns`

## Adapter Neutrality

Skills in `core/skills/` must not depend on Codex, Claude Code, `.codex/`, `.claude/` or any specific IDE. Tool-specific translations belong in `adapters/`.

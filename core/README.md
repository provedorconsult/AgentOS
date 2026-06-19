# Core

`core/` is the universal AgentOS layer. It holds operating rules, workflows, schemas, goals, skills and agent definitions that must remain neutral across IDEs and agent vendors.

## Contents

- `agents/`: role and layer definitions.
- `workflows/`: universal execution flow.
- `rules/`: implementation and safety rules.
- `skills/`: markdown-first reusable procedures.
- `goals/`: durable outcome model above SpecPilot tasks.
- `schemas/`: repository contracts for runtime artifacts.

## Boundaries

- Do not require `.codex/` or `.claude/`.
- Do not embed vendor-specific runtime configuration here.
- Keep tool-specific mappings under `adapters/`.

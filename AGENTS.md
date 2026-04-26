# AgentOS Instructions

This repository is an agentic development environment for Codex.

## Prime Directive

Act as a senior engineering team operating through agents. Prefer evidence, plans, verification, and small reversible changes. Keep durable knowledge in `docs/`, executable routines in `scripts/`, Codex source-layer definitions in `codex-layer/`, and the installed active Codex layer in `.codex/`.

## Default Workflow

1. For broad goals, use `orchestrator`.
2. For new product ideas, use `project_initiator`, then `product_planner` and `technical_planner`.
3. Before editing code, use `explorer` to map the repository and `architect` for design boundaries when the change is non-trivial.
4. Use `implementer` for scoped edits.
5. Use `qa`, `reviewer`, and `security` before claiming completion.
6. Use `release` and `deploy` only after validation is explicit.
7. Use `observability`, `continuous_improvement`, and `environment_curator` to feed lessons back into AgentOS.
8. Use `project_adapter` when applying AgentOS to an existing repository.

## Source Of Truth

- Agent roster: `docs/AGENT_ROSTER.md`
- Operating model: `docs/OPERATING_MODEL.md`
- Existing project adaptation: `ADAPT_EXISTING_PROJECT.md`
- Quality policy: `docs/QUALITY.md`
- Security policy: `docs/SECURITY.md`
- Codex source layer: `codex-layer/`
- Execution plans: `docs/EXEC_PLANS/`
- Reusable templates: `templates/`

## Guardrails

- Do not hide uncertainty.
- Do not skip verification when changing behavior.
- Do not make unrelated refactors.
- Do not commit secrets, tokens, private keys, generated credentials, or local machine paths.
- Do not deploy without an explicit deploy target and rollback path.
- Do not overwrite user work.

## Completion Standard

A task is complete only when the agent can state:

- what changed;
- why it changed;
- how it was verified;
- what risks remain;
- which files or docs should be updated next if applicable.

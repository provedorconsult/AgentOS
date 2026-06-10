# AgentOS Instructions

AgentOS is a generic agentic development operating system. It uses SpecPilot Engine for SPEC-driven work and adapters for Codex, generic IDEs and future agents.

## Source Order

1. Latest user request.
2. `docs/SPEC.md`.
3. `docs/PLAN.md`.
4. `.harness/sprints/*.json` or the current task.
5. `AGENTS.md` and `core/rules/*.md`.
6. Existing code and repository conventions.

## Default Workflow

Use `core/workflows/`:

1. Discover current state and constraints.
2. Write or update SPEC.
3. Plan small tasks with `agentGoal` and context capsules.
4. Implement only declared scope.
5. Verify with commands, exit codes and evidence.
6. Finish with diff review and `docs/REVIEW.md`.

## Context Rules

- Prefer declared ranges over broad repository reads.
- Do not read generated directories unless required.
- Split work when the task needs too much context.
- Preserve unrelated user changes.

## Implementation Rules

- Keep universal behavior in `core/`, `.harness/`, `docs/` and `scripts/`.
- Keep Codex-specific behavior in `adapters/codex/`.
- Do not add dependencies without a clear need.
- Do not perform unrelated refactors.

## Verification Rules

- Run the commands declared by the task.
- Record command, exit code and result in `docs/REVIEW.md`.
- Do not mark work done without objective evidence.

## Security

- Do not commit secrets, tokens, private keys or real `.env` files.
- Use `.env.example` for documented variables.
- Treat destructive commands and deploys as approval-gated unless explicitly requested.

## Completion

After green verification, summarize changed files, commands, exit codes, remaining risks and next steps. Commit, push and deploy only when the active task and repository policy require it.

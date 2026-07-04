# AgentOS Instructions for Claude Code

This is the Claude Code entry point for this repository. The universal contract lives in `AGENTS.md` and `core/`; this file mirrors that contract so Claude Code and Codex can coexist on the same repository in VSCode without conflicting files.

## Source Order

1. Latest user request.
2. `docs/SPEC.md`.
3. `docs/PLAN.md`.
4. `.harness/sprints/*.json` or the current task.
5. `AGENTS.md` and `core/rules/*.md`.
6. Existing code and repository conventions.

## Coexistence with Codex

- `.codex/` and `codex-layer/` belong to the Codex adapter. Do not edit them unless the active task declares them.
- `AGENTS.md` remains the vendor-neutral instruction file; keep this file consistent with it.
- Claude Code specific material stays in `adapters/claude-code/`; `core/` must not depend on `.claude/` or `CLAUDE.md`.

## Default Workflow

Use `core/workflows/` (01-discover through 10-retro):

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

## Verification Rules

- Run the commands declared by the task, at minimum `npm run doctor` and `npm run validate`.
- Record command, exit code and result in `docs/REVIEW.md`.
- Do not mark work done without objective evidence.

## Security

- Do not commit secrets, tokens, private keys or real `.env` files.
- Use `.env.example` for documented variables.
- Treat destructive commands and deploys as approval-gated unless explicitly requested.

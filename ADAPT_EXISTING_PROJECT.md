# Adapting An Existing Project

Use this guide when AgentOS is copied into a repository that already has application code.

## Goals

- Preserve existing project behavior.
- Discover conventions before changing anything.
- Add AgentOS in layers.
- Avoid noisy refactors.
- Make the repository easier for agents and humans to operate.

## Adaptation Flow

1. Run `project_adapter`.
2. Run `explorer` to map:
   - package manager;
   - build commands;
   - test commands;
   - deploy targets;
   - architectural boundaries;
   - sensitive files;
   - current CI status.
3. Run `technical_planner` to produce an adaptation plan.
4. Add or update:
   - `AGENTS.md`;
   - `codex-layer/config.toml`;
   - `codex-layer/agents/`;
   - `codex-layer/rules/`;
   - `codex-layer/hooks.json`;
   - `docs/`;
   - `.github/workflows/`.
5. Run `qa`, `security`, and `reviewer`.
6. Capture gaps in `docs/EXEC_PLANS/active/`.

## Minimum Adaptation

For a small existing repository, add only:

- `AGENTS.md`
- `codex-layer/config.toml`
- `codex-layer/agents/explorer.toml`
- `codex-layer/agents/implementer.toml`
- `codex-layer/agents/reviewer.toml`
- `codex-layer/agents/qa.toml`
- `docs/QUALITY.md`

Then expand when the project is stable.

# Claude Code Adapter

Status: supported (instructions surface only)

This adapter installs `CLAUDE.md` so Claude Code (VSCode extension or CLI) can drive an AgentOS repository. It is designed to coexist with the Codex adapter: both can be installed in the same repository because each tool reads its own instruction file.

## Install

```powershell
npm run agentos:install-adapter -- claude-code
```

## Supported Modes

- standard install: `npm run agentos:install-adapter -- claude-code`
- dry-run: `npm run agentos:install-adapter -- claude-code --dry-run`
- explicit target: `npm run agentos:install-adapter -- claude-code --target /path/to/repo`

## Coexistence with Codex

- The installer copies only `adapters/claude-code/templates/CLAUDE.md` to `CLAUDE.md`; it never creates, modifies or removes `.codex/` or `AGENTS.md`.
- Install `codex` and `claude-code` into the same target to use Codex and Claude Code side by side in VSCode.
- AgentOS core does not depend on Claude Code; universal rules stay in `core/`.

## Rollback

If the target already contained `CLAUDE.md`, the installer creates a timestamped backup such as `CLAUDE.md.bak-<timestamp>`. Roll back by renaming the backup to the original path.

## Boundaries

- AgentOS core does not depend on Claude Code, `.claude/` or `CLAUDE.md`.
- This adapter does not create `.claude/` in this phase.
- `.claude/agents` and `.claude/skills` generation remains planned in `mapping.yaml` and requires a future SPEC.

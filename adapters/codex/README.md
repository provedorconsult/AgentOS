# Codex Adapter

This adapter preserves native Codex usage while keeping AgentOS core universal.

## Install

```powershell
npm run agentos:install-adapter -- codex
```

The installer copies the canonical `codex-layer/` into `.codex/` and installs `templates/AGENTS.md` into the target repository. Existing destinations are backed up before replacement.

## Supported Modes

- standard install: `npm run agentos:install-adapter -- codex`
- dry-run: `npm run agentos:install-adapter -- codex --dry-run`
- explicit target: `npm run agentos:install-adapter -- codex --target C:\path\to\repo`

## Rollback

If the target already contained `AGENTS.md` or `.codex/`, the installer creates timestamped backups such as `AGENTS.md.bak-<timestamp>` and `.codex.bak-<timestamp>`. Roll back by renaming the backup to the original path.

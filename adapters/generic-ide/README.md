# Generic IDE Adapter

Use this adapter when the project is driven by an IDE or agent without native AgentOS integration.

## Install

```powershell
npm run agentos:install-adapter -- generic-ide
```

This adapter does not create `.codex/` and only installs the generic instructions surface.

## Supported Modes

- standard install: `npm run agentos:install-adapter -- generic-ide`
- dry-run: `npm run agentos:install-adapter -- generic-ide --dry-run`
- explicit target: `npm run agentos:install-adapter -- generic-ide --target C:\path\to\repo`

Existing destinations receive a timestamped backup before replacement.

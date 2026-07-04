# Codex Layer

This directory is the canonical source for the project-local Codex layer installed as `.codex/`. The contract test in `tests/agentos-2-contracts.test.mjs` keeps `.codex/config.toml` byte-identical to `codex-layer/config.toml`.

## Install

Use the canonical Node installer:

```powershell
npm run agentos:install-adapter -- codex
```

It copies this directory into `.codex/` and installs the Codex `AGENTS.md` template, backing up existing destinations. The legacy `scripts/legacy/` PowerShell helpers are deprecated and must not be used for installation.

Expected installed layout:

```txt
.codex/
  config.toml
  agents/
  rules/
  hooks.json
  hooks/
```

## Hooks

`hooks.json` ships PowerShell hook commands for Windows. POSIX shims with the same behavior live in `hooks/check-no-secrets.sh` and `hooks/check-exec-plan.sh`; on Linux or macOS, point the `command`/`args` entries of `hooks.json` at those shims per machine. Both paths delegate to the same canonical Node validators.

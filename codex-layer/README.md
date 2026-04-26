# Codex Layer

This directory contains the project-local Codex layer that should be published as `.codex/`.

The local sandbox for this session blocks writing a root `.codex/` directory directly. Keep this directory as the source layer, then install it with:

```powershell
./scripts/install-codex-layer.ps1
```

Expected installed layout:

```txt
.codex/
  config.toml
  agents/
  rules/
  hooks.json
  hooks/
```

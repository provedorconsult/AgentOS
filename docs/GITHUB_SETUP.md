# GitHub Setup

Target repository:

```txt
provedorconsult/AgentOS
```

## Current Connector Requirement

The Codex GitHub connector must be authorized for the `provedorconsult` account before Codex can create or populate files there.

At the time this repository was scaffolded, the connector exposed:

- `Haisemberg2008`
- `You-Telecom-Provedor-de-internet`

It did not expose:

- `provedorconsult`

## Publication Options

Option A: authorize the Codex GitHub app for `provedorconsult`, then ask Codex to publish this workspace.

Option B: create an empty public GitHub repository named `AgentOS` under `provedorconsult`, then ask Codex to populate `provedorconsult/AgentOS`.

Option C: run:

```powershell
./scripts/create-github-repo.ps1 -Owner "provedorconsult" -Repo "AgentOS" -Visibility public
```

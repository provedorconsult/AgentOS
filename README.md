# AgentOS

AgentOS is a baseline repository for building productive Codex development environments before a product repository exists, and for adapting existing repositories into an agentic workflow.

It standardizes:

- project instructions for Codex;
- custom agents and subagents;
- orchestration playbooks;
- MCP configuration placeholders;
- skills and reusable workflows;
- hooks, rules, and guardrails;
- repository management, review, CI, deploy, and continuous improvement routines.

The goal is maximum practical autonomy: humans define intent, constraints, and approvals; agents plan, explore, implement, test, review, release, deploy, observe, and improve the environment.

## Repository Status

This workspace is prepared for publication as:

```txt
provedorconsult/AgentOS
```

The current Codex GitHub connector must be authorized for the `provedorconsult` account before Codex can create or populate that public repository remotely.

## Operating Model

AgentOS treats the repository as a development control plane:

1. A human provides a product or technical goal.
2. The orchestrator selects the correct agent workflow.
3. Planner agents produce a bounded execution plan.
4. Explorer agents gather evidence without editing.
5. Architect agents define interfaces, risks, and constraints.
6. Implementer agents make scoped changes.
7. QA, security, and review agents verify the result.
8. Release and deploy agents publish the work.
9. Observability and continuous-improvement agents capture lessons back into the environment.

## Core Agents

AgentOS starts with these agents:

- `orchestrator`
- `project_initiator`
- `product_planner`
- `technical_planner`
- `explorer`
- `architect`
- `implementer`
- `reviewer`
- `qa`
- `security`
- `release`
- `deploy`
- `observability`
- `continuous_improvement`
- `project_adapter`
- `environment_curator`

See [docs/AGENT_ROSTER.md](docs/AGENT_ROSTER.md).

## Codex Layer

The Codex project layer is stored in `codex-layer/` so it can be reviewed and installed intentionally. To activate it locally, run:

```powershell
./scripts/install-codex-layer.ps1
```

That installs it as `.codex/`, with `config.toml`, agents, rules, and hooks.

## Quick Start

For a new project:

```powershell
./scripts/bootstrap-project.ps1 -ProjectName "MyApp"
```

For an existing project:

```powershell
./scripts/adapt-existing-project.ps1 -ProjectPath "C:\path\to\repo"
```

Run a local environment check:

```powershell
./scripts/doctor.ps1
./scripts/validate.ps1
```

## GitHub Publication

After the `provedorconsult` account is authorized in the Codex GitHub connector, Codex can populate `provedorconsult/AgentOS`.

As a fallback, use:

```powershell
./scripts/create-github-repo.ps1 -Owner "provedorconsult" -Repo "AgentOS" -Visibility public
```

## References

- OpenAI Codex subagents: https://developers.openai.com/codex/subagents
- OpenAI harness engineering: https://openai.com/pt-BR/index/harness-engineering/
- IBM AI agent orchestration: https://www.ibm.com/br-pt/think/topics/ai-agent-orchestration
- BMAD Method: https://github.com/bmad-code-org/BMAD-METHOD

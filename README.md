# AgentOS

AgentOS is a generic agentic development operating system for repositories. It combines a universal operating model, SpecPilot Engine, mechanical verification and adapters for Codex or other IDEs/agents.

## What It Provides

- `core/`: universal agents, workflows, rules, schemas, goals and markdown-first skills.
- SpecPilot Engine: SPEC, PLAN, TASK, REVIEW templates, context capsules and `.harness/`.
- `adapters/`: tool-specific installation layers.
- `extensions/`: planned optional capabilities such as memory, heartbeats, routines, channels and knowledge DB.
- `packs/`: optional domain packs, including ISP.
- `scripts/`: local validation and setup commands in portable Node.js.
- Documentation for architecture, quality, security, operation and migration.

## SpecPilot Engine

SpecPilot Engine is the internal SPEC-driven execution layer. It turns goals into:

- `docs/SPEC.md`
- `docs/PLAN.md`
- `.harness/sprints/*.json`
- `docs/REVIEW.md`

Tasks use `agentGoal`, closed context, objective acceptance criteria and verification commands.

## EvoNexus-Inspired Operating Layer

EvoNexus inspired AgentOS to add agent layers, markdown-first skills, goals, solutioning, retro, planned extensions and optional packs. EvoNexus is only a conceptual reference; AgentOS does not depend on EvoNexus or Claude Code.

The new operating layer includes:

- `core/agents/`: layer mapping for engineering, business, operations and knowledge.
- `core/skills/`: reusable markdown procedures for dev, security, product, ops, data and docs.
- `core/goals/`: Mission -> Project -> Goal -> Task templates and schema.
- `core/workflows/04-solution.md`: technical solutioning before implementation.
- `core/workflows/10-retro.md`: learning capture after verified delivery.
- `extensions/`: roadmap placeholders only, with no dashboard, scheduler, database or real integrations.
- `packs/`: optional domain bundles, including `packs/isp/`.

## Adapters

Codex is supported as an adapter, not as the foundation of the project.

- `adapters/codex/`: installs `.codex/` and Codex-compatible instructions.
- `adapters/generic-ide/`: installs generic agent instructions without `.codex/`.
- `adapters/antigravity/`: experimental placeholder.
- `adapters/claude-code/`: experimental future placeholder for Claude Code mappings; it does not create `.claude/` in this phase.

## Quick Start

Validate AgentOS:

```powershell
npm run doctor
npm run validate
```

Initialize working artifacts in a project:

```powershell
npm run agentos:init
```

Install the Codex adapter:

```powershell
npm run agentos:install-adapter -- codex
```

Install the generic IDE adapter:

```powershell
npm run agentos:install-adapter -- generic-ide
```

Prepare an adaptation plan for an existing project:

```powershell
npm run agentos:adapt -- C:\path\to\repo
```

## Directory Map

```txt
core/                 universal AgentOS engine
.harness/             SpecPilot templates and sprint state
adapters/             Codex, generic IDE and future adapters
extensions/           planned optional capabilities
packs/                optional domain bundles
docs/                 architecture, PRD, templates and review evidence
scripts/              portable local CLI and validators
templates/            reusable business/project templates
codex-layer/          legacy Codex source layer preserved for compatibility
```

## Documentation

- [Architecture](docs/ARCHITECTURE.md)
- [EvoNexus alignment](docs/EVONEXUS_ALIGNMENT.md)
- [Goals](docs/GOALS.md)
- [Skills](docs/SKILLS.md)
- [Extensions](docs/EXTENSIONS.md)
- [Packs](docs/PACKS.md)
- [SpecPilot Engine](docs/SPECPILOT_ENGINE.md)
- [Adapters](docs/ADAPTERS.md)
- [IDE compatibility](docs/IDE_COMPATIBILITY.md)
- [Agent roster](docs/AGENT_ROSTER.md)
- [Operating model](docs/OPERATING_MODEL.md)
- [Quality](docs/QUALITY.md)
- [Security](docs/SECURITY.md)

## Status

AgentOS 2.0.0 is structured as a repository-template and local script toolkit. It intentionally does not include a web UI, database, daemon, scheduler, channel integration or external API integration in this phase.

## Roadmap

- Go CLI named `agentos`.
- GitHub template publication.
- Complete Antigravity adapter.
- VS Code/Cursor adapter.
- Optional MCP integration.
- Stack-specific workflows for Go, Python, Node, Laravel, Angular and Docker/Debian.

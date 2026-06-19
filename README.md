# AgentOS

AgentOS is the platform. SpecPilot is the internal SPEC-driven engine. Adapters translate that contract to tools such as Codex or a generic IDE without turning any adapter into the core.

Current release candidate package metadata: AgentOS 2.0.0-rc.1.

Formal GitHub prerelease status: not published until edit-scope validation, sprint discovery, CI, formal `APPROVE` review, tag and prerelease gates are complete.

## Short-Horizon Surface

- `core/`: neutral rules, workflows, skills, goals, schemas and agent layers.
- `specpilot/`: explicit engine index for templates, validators and harness boundaries.
- `.harness/`: runtime templates and active sprint state.
- `adapters/codex/`: optional Codex installer that generates `.codex/` only when requested.
- `adapters/generic-ide/`: optional IDE-neutral instructions that work without `.codex/`.
- `adapters/claude-code/`: future placeholder only.
- `extensions/` and `packs/`: honest placeholders only.
- `scripts/`: local validation and setup commands backed by pinned, audited dependencies.

## What Is Not Implemented In This Phase

- No database.
- No dashboard.
- No scheduler.
- No channels.
- No remote runtime.
- No functional Claude Code adapter.
- No functional Antigravity adapter.

## Quick Start

```powershell
npm ci
npm run doctor
npm run validate
npm run agentos:init
npm run agentos:install-adapter -- codex
npm run agentos:install-adapter -- generic-ide
```

## Execution Model

SpecPilot turns work into:

- `docs/SPEC.md`
- `docs/PLAN.md`
- `.harness/sprints/*.json`
- `docs/REVIEW.md`

Tasks use `agentGoal`, closed context, declared editable files, acceptance criteria and verification commands.

Validation is mechanical:

- `npm run validate:templates` discovers `.harness/templates/*.json`, `.harness/sprints/*.json` and `.harness/archive/*.json`.
- `npm run validate:scope` compares the real Git diff with `task.files[]` and `scopePolicy`.
- `npm run validate:secrets` scans structured assignments in env, YAML, JSON, Markdown and comments.
- `npm run validate:secrets:history` is optional and documents the cost/limits of history review.

## Directory Map

```text
core/                 universal AgentOS layer
specpilot/            explicit SpecPilot engine index
.harness/             runtime state and templates
adapters/             Codex, Generic IDE and future adapters
extensions/           planned optional capabilities only
packs/                planned optional domain bundles only
docs/                 architecture, templates and review evidence
scripts/              local validators and setup commands
templates/            reusable business and project templates
codex-layer/          canonical source for installed Codex material
```

## Documentation

- [Architecture](docs/ARCHITECTURE.md)
- [SpecPilot Engine](docs/SPECPILOT_ENGINE.md)
- [Adapters](docs/ADAPTERS.md)
- [IDE compatibility](docs/IDE_COMPATIBILITY.md)
- [Goals](docs/GOALS.md)
- [Skills](docs/SKILLS.md)
- [Extensions](docs/EXTENSIONS.md)
- [Packs](docs/PACKS.md)
- [EvoNexus alignment](docs/EVONEXUS_ALIGNMENT.md)

## Status

AgentOS 2.0.0-rc.1 is a file-first, markdown-first, git-friendly and IDE-neutral operating system for agentic development. The short horizon keeps the platform local and mechanical, with pinned YAML, Ajv JSON Schema validation and Git scope-validation dependencies.

# AgentOS Architecture 2.0

## Canonical Source

This file is the canonical source for AgentOS Architecture 2.0. When another repository artifact describes platform boundaries, workflow order, adapter ownership, `.codex/` generation, deployment readiness or validation gates, it must be consistent with this document.

`docs/SPEC.md` defines the active scope, `docs/PLAN.md` defines the execution plan, `.harness/sprints/*.json` defines agent-ready tasks, and `docs/REVIEW.md` records evidence. Those files are operational projections of this architecture, not competing sources of truth.

## Architecture Principles

- AgentOS is the platform.
- SpecPilot is the internal SPEC-driven engine.
- `core/` is IDE-neutral and must not require `.codex/`, `.claude/` or another vendor runtime.
- Adapters translate the core contract into tool-specific files.
- Generated or installed adapter layers are not canonical sources.
- Placeholders must be documented as placeholders until a SPEC activates them.
- Validation must be mechanical and reproducible without external dependencies.
- Deploy must fail closed when no real target is configured.

## Layer Model

```text
docs/                 canonical architecture, SPEC, PLAN, templates and evidence
core/                 neutral AgentOS rules, workflows, skills, goals, schemas and agents
specpilot/            explicit SpecPilot engine index and harness boundary docs
.harness/             active sprint state, project state and task templates
adapters/             tool-specific translation surfaces
codex-layer/          canonical source for installable project .codex material
.codex/               installed Codex layer copy; must not drift from codex-layer/
extensions/           planned optional capabilities only
packs/                planned optional domain bundles only
scripts/              dependency-free local validation, setup and deploy entrypoints
templates/            reusable project and business templates
tests/                executable contract tests for Architecture 2.0 invariants
```

## Core

`core/` contains the universal AgentOS layer: agents, workflows, rules, skills, goals and schemas. It is written as markdown-first operational material so a human, Codex, a generic IDE agent or a future adapter can consume the same instructions.

Core files may reference AgentOS and SpecPilot contracts. They must not depend on `.codex/`, `.claude/`, Codex MCP configuration or any IDE-specific runtime.

## SpecPilot Engine

SpecPilot is the internal engine that turns intent into bounded work:

1. `docs/SPEC.md` states the active behavior contract.
2. `docs/PLAN.md` breaks that contract into implementation tasks.
3. `.harness/sprints/*.json` packages tasks with `agentGoal`, context ranges, editable files, acceptance criteria and verification commands.
4. `docs/REVIEW.md` records command evidence and residual risk.

The engine stays local and file-first. It does not require a database, scheduler, dashboard or remote runtime in Architecture 2.0.

## Canonical Workflow

The canonical workflow sequence is:

1. `core/workflows/01-discover.md`
2. `core/workflows/02-spec.md`
3. `core/workflows/03-plan.md`
4. `core/workflows/04-solution.md`
5. `core/workflows/05-implement.md`
6. `core/workflows/06-verify.md`
7. `core/workflows/07-review.md`
8. `core/workflows/08-release.md`
9. `core/workflows/09-deploy.md`
10. `core/workflows/10-retro.md`

Legacy workflow files may remain for compatibility, but the numbered sequence above is canonical for new work.

## Agents

`core/agents/` preserves the platform agent roster and layer mapping:

- Engineering: planning, implementation, QA, review, release and observability.
- Business: product planning and project initiation.
- Operations: project adaptation, deploy and continuity.
- Knowledge: continuous improvement, environment curation and future memory.

Agent definitions are operating contracts, not daemon processes.

## Skills

`core/skills/` contains reusable markdown-first procedures. Skills are platform material and must remain independent from any adapter. Adapter-specific skill wrappers can be introduced later only through a scoped SPEC.

## Goals

`core/goals/` defines the Mission -> Project -> Goal -> Task hierarchy. Goals describe durable outcomes. SpecPilot tasks describe bounded execution surfaces and verification evidence.

## Adapters

`adapters/` translates AgentOS into specific environments:

- `adapters/codex/` installs or documents the Codex path.
- `adapters/generic-ide/` provides IDE-neutral instructions that work without `.codex/`.
- `adapters/claude-code/` is an experimental placeholder.
- `adapters/antigravity/` is an experimental placeholder.

Adapters may consume `core/`, `docs/`, `specpilot/` and `.harness/`. The core must not consume adapters.

## Codex Layer

`codex-layer/` is the canonical source for installable project `.codex/` material. `.codex/` is an installed project-local copy and must be byte-for-byte aligned with `codex-layer/` unless a future SPEC explicitly defines generated local overrides.

The current validation contract tests `.codex/config.toml` against `codex-layer/config.toml` to prevent silent drift.

## Extensions

`extensions/` documents optional planned capabilities such as memory, heartbeats, routines, channels and knowledge-db. Architecture 2.0 does not load or execute those capabilities by default.

## Packs

`packs/` documents optional domain bundles. Packs are not activated automatically and do not modify the core contract unless a future SPEC declares pack activation semantics.

## Deployment

AgentOS does not claim a deploy when no real target exists. `scripts/deploy.ps1` is the deployment entrypoint, but it must fail closed unless `AGENTOS_DEPLOY_COMMAND` is configured. Optional arguments can be passed through `AGENTOS_DEPLOY_ARGS`.

This keeps validation green without pretending that a remote deployment happened.

## Validation and Tests

Architecture 2.0 uses these local gates:

- `npm run doctor`: verifies required repository surfaces and local command prerequisites.
- `npm test`: runs executable Architecture 2.0 contract tests.
- `npm run validate`: runs templates, context ranges, secret scan and tests.
- `git diff --check`: verifies whitespace hygiene before publication.

## Explicit Non-Goals

Architecture 2.0 does not include:

- database-backed runtime;
- dashboard;
- scheduler;
- remote control plane;
- channels;
- functional Claude Code adapter;
- functional Antigravity adapter;
- automatic pack activation;
- real deploy without explicit configuration.

## EvoNexus Reference

EvoNexus remains a conceptual reference for layers, skills, goals, memory, routines, heartbeats and packs. It is not a dependency of AgentOS.

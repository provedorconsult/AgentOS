# EvoNexus Alignment

## Objective

AgentOS adopts selected operating patterns inspired by EvoNexus while remaining a generic agentic development platform. EvoNexus is a conceptual reference, not a runtime dependency, source dependency or compatibility requirement.

## Concepts Adopted Now

- Agent layers for engineering, business, operations and knowledge work.
- Markdown-first skills under `core/skills/`.
- Goals above SPEC, PLAN, sprint and task execution.
- A solutioning workflow before implementation.
- A retro workflow after verified delivery.
- Placeholder boundaries for future memory, heartbeats, routines, channels and knowledge database work.
- Optional domain packs, including an ISP pack.

## Concepts Deferred

- Dashboard UI.
- Scheduler or daemon.
- Database, embeddings, pgvector or ChromaDB.
- Real Telegram, Discord, email, GitHub Issues or webhook channels.
- Business layer automation.
- Full EvoNexus agent or skill catalog.

## Resulting Architecture

AgentOS remains the platform. SpecPilot remains the SPEC-driven engine for SPEC, PLAN, sprint, task, context capsule, acceptance criteria, verification and evidence. The EvoNexus-inspired layer organizes the work around goals, skills, layers, extensions and packs.

## Boundaries

- `core/` contains IDE-neutral agents, workflows, rules, skills and goals.
- `adapters/` maps AgentOS to a specific tool.
- `extensions/` documents planned advanced capabilities without making them core.
- `packs/` contains optional domain material that is not loaded automatically.
- `specpilot/` is reserved for future separation of templates, validators and harness material if the engine is split from the root `.harness/` layout.

## Claude Code Coupling Risk

Claude Code is represented only by `adapters/claude-code/` as an experimental future adapter. Core files must not require `.claude/`, Claude-specific commands or Claude-specific skill formats. The current official initial adapter remains Codex.

## Incremental Plan

1. Establish docs, goals, skills, layers, solutioning and retro.
2. Keep extensions as documented placeholders until a future task defines executable behavior.
3. Keep packs optional and manually selected.
4. Promote Claude Code only after an adapter task proves generated files and validation without coupling `core/`.
5. Add real integrations only through explicit PRDs, tests and security review.

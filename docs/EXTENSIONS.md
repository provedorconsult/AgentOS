# Extensions

Extensions are planned optional capabilities outside the AgentOS core. They document future shapes without adding services, databases, schedulers or integrations in this phase.

## Planned Extensions

- `extensions/memory/`: markdown-first memory model.
- `extensions/heartbeats/`: proactive checks such as stale tasks or missing evidence.
- `extensions/routines/`: future scheduled routines.
- `extensions/channels/`: future communication channels.
- `extensions/knowledge-db/`: future database-backed knowledge layer.

## Rules

- Extensions are not loaded by default.
- Extensions must not make `core/` depend on a database, scheduler or external service.
- Any executable extension requires a future SPEC, PLAN, tests and security review.

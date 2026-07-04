# ADR 0001: AgentOS As A Development Control Plane

## Status

Superseded by AgentOS Architecture 2.0 (`docs/ARCHITECTURE.md`) on 2026-07-04. Kept as an immutable historical record.

## Context

AgentOS should work before an application exists and should also adapt existing repositories. A normal app template is too narrow for this goal.

## Decision

AgentOS is structured as a development control plane with instructions, agents, guardrails, templates, scripts, and documentation.

## Consequences

- The repository is useful as a standalone starting point.
- Existing projects can copy selected layers.
- Agents have clear roles and handoffs.
- The environment can improve itself over time.

> **LEGACY (archived 2026-07-04).** This document describes the pre-Architecture 2.0 control-plane era and is kept for historical context only. It must not guide current work; the canonical sources are `docs/ARCHITECTURE.md`, `docs/SPEC.md`, `docs/PLAN.md` and `AGENTS.md`.

# Observability

AgentOS expects shipped software to expose enough signal for agents and humans to operate it.

## Minimum Signals

- application logs;
- error rate;
- latency;
- build and deploy status;
- uptime or health checks;
- critical business events;
- user-impacting failures.

## Agent Responsibilities

The `observability` agent should:

- identify missing signals;
- propose dashboards and alerts;
- define post-deploy checks;
- capture incidents as improvement tasks;
- feed repeated issues to `continuous_improvement`.

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

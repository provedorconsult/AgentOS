# Orchestration

The `orchestrator` agent is the default entry point for non-trivial work.

## Routing Matrix

| Situation | Primary Agent | Supporting Agents |
| --- | --- | --- |
| New app idea | `project_initiator` | `product_planner`, `technical_planner` |
| Existing app adaptation | `project_adapter` | `explorer`, `security`, `qa` |
| Feature build | `technical_planner` | `explorer`, `architect`, `implementer`, `qa` |
| Bug fix | `explorer` | `implementer`, `qa`, `reviewer` |
| PR readiness | `reviewer` | `qa`, `security`, `release` |
| Deployment | `deploy` | `security`, `observability`, `release` |
| Repeated failures | `continuous_improvement` | `environment_curator` |

## Spawn Policy

Spawn agents only when the work benefits from parallelism, specialization, or context isolation.

Use read-only agents for discovery and review. Use workspace-write agents only for scoped implementation or environment updates.

## Output Contract

Every agent should return:

- findings or changes;
- evidence;
- assumptions;
- risks;
- recommended next action.

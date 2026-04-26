# Operating Model

AgentOS is based on a simple loop:

```txt
Intent
-> Orchestration
-> Planning
-> Exploration
-> Architecture
-> Implementation
-> Verification
-> Review
-> Release
-> Deploy
-> Observe
-> Improve the environment
```

## Principles

- Agents are specialized and bounded.
- The orchestrator owns routing and synthesis.
- Explorers gather evidence before edits.
- Implementers own scoped changes.
- Reviewers prioritize bugs, risks, and missing tests.
- QA owns proof, not optimism.
- Security is involved before deployment.
- Improvement work is part of the system, not an afterthought.

## Parallelization

Parallelize when tasks are independent:

- frontend and backend impact mapping;
- security review and test review;
- docs verification and code exploration;
- release note preparation and final CI observation.

Do not parallelize when the next step depends on one answer.

## Human Control Points

Require human confirmation for:

- destructive repository operations;
- production deploy;
- credentials or secret rotation;
- data migrations;
- public API changes;
- license changes;
- major architecture changes.

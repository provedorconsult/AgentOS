# TASK

## Metadata

- id: task-001
- status: pending
- title: Short title

## Agent Goal

```json
{
  "agentGoal": {
    "needed": true,
    "draft": "/goal Deliver <outcome> verified by <commands/artifacts>, preserving <constraints>.",
    "outcome": "<what must be true at the end>",
    "verificationSurface": "<test/build/smoke/artifact/review evidence>",
    "constraints": ["<constraint>"],
    "boundaries": ["<file or directory scope>"],
    "iterationPolicy": "<how to choose next attempt>",
    "blockedStopCondition": "<when to stop and report blocked>"
  }
}
```

## Context Capsule

- specRefs: `docs/SPEC.md:1-80`
- readOnly: `path/to/file:1-120`
- contracts: `contract.example.v1`
- files: `path/to/file` modify

## Acceptance Criteria

- Objective criterion.

## Verification

- `npm run validate`

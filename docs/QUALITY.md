# Quality Policy

AgentOS treats verification as part of the work.

## Required Evidence

Before completion, collect at least one of:

- passing automated tests;
- successful build;
- lint or static analysis result;
- manual reproduction steps;
- screenshot or browser evidence for UI work;
- deployment health check.

## Test Strategy

Prefer focused tests for narrow changes and broader tests for shared behavior.

Add or update tests when:

- a bug is fixed;
- behavior changes;
- a contract changes;
- a critical workflow is touched;
- future regressions would be hard to see manually.

## Review Standard

Reviews should lead with concrete risks:

- correctness bugs;
- behavior regressions;
- security issues;
- missing tests;
- deployment hazards;
- maintainability risks that create real failure modes.

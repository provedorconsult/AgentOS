# PLAN

## Summary

Materialize the missing runtime SpecPilot artifacts in the root repository, activate a real sprint against the new SPEC, and make the default validation command enforce context integrity from the same flow.

## Tasks

### Task 001 - Materialize Runtime SPEC and PLAN

- Goal: add the canonical runtime documents that the PRD and AGENTS source order expect.
- Agent Goal: `/goal Deliver runtime SPEC and PLAN artifacts verified by npm run validate:context, preserving the current PRD scope and no-new-dependencies constraint.`
- Editable files: `docs/SPEC.md`, `docs/PLAN.md`
- Read-only context: `docs/PRD_AGENTOS_SPECPILOT_FUSION.md:1-83`, `AGENTS.md:1-44`, `scripts/agentos-init.mjs:1-21`
- Verification: `npm run validate:context`

### Task 002 - Activate Root Harness State

- Goal: register a real project state and sprint so the repository self-hosts the SpecPilot workflow.
- Agent Goal: `/goal Deliver active harness state verified by npm run validate:context, preserving agentGoal-based task structure and exact file scope.`
- Editable files: `.harness/project-state.json`, `.harness/current.txt`, `.harness/sprints/2026-06-10-agentos-prd-execution.json`
- Read-only context: `.harness/templates/project-state.json:1-17`, `.harness/templates/sprint.json:1-59`, `docs/SPEC.md:1-67`
- Verification: `npm run validate:context`

### Task 003 - Enforce the Full Validation Gate

- Goal: ensure the standard validation command includes context checks and leaves objective evidence.
- Agent Goal: `/goal Deliver a full validation gate verified by npm run doctor and npm run validate, preserving the existing script surface and review discipline.`
- Editable files: `package.json`, `scripts/doctor.mjs`, `docs/REVIEW.md`
- Read-only context: `scripts/validate-context-ranges.mjs:1-59`, `docs/SPEC.md:1-67`, `docs/PLAN.md:1-24`
- Verification: `npm run doctor`, `npm run validate`

## Risks

- Future work can stale declared ranges if `docs/SPEC.md`, `docs/PLAN.md` and sprint JSON are edited independently.
- `validate:context` checks file presence and range format, not semantic freshness of the referenced content.

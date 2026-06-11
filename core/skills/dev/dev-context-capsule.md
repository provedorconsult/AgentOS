# Skill: dev-context-capsule

Status: active
Domain: dev
Used by: technical-planner, implementer, workflows/03-plan

## Purpose

Create tight context capsules for task execution.

## When to Use

- A task needs enough context to execute without broad repository reads.
- A sprint JSON needs `specRefs` and `context.readOnly`.

## Inputs

- SPEC ranges.
- PLAN ranges.
- Existing code and docs.

## Procedure

1. Identify the smallest authoritative SPEC range.
2. Add up to three read-only context files.
3. Use `start-end` ranges capped by repository policy.
4. List editable files separately.
5. Add verification commands.

## Output

- Context capsule in sprint or task JSON.

## Quality Gates

- Ranges exist and are below the configured maximum.
- Editable and read-only files are not mixed.

## Anti-Patterns

- Referencing whole directories as context.
- Expanding context to compensate for unclear scope.

# Skill: prod-prd-to-spec

Status: active
Domain: product
Used by: product-planner, workflows/02-spec

## Purpose

Translate a PRD into AgentOS SPEC, PLAN and sprint-ready requirements.

## When to Use

- A PRD is the source of truth for implementation.
- The backlog needs to be converted into executable tasks.

## Inputs

- PRD text.
- Existing docs and architecture.
- Current sprint state.

## Procedure

1. Extract objectives, non-goals and constraints.
2. Group requirements into sprints.
3. Preserve explicit exclusions.
4. Convert acceptance criteria into verification commands.
5. Update SPEC, PLAN or sprint JSON as needed.

## Output

- SPEC/PLAN updates and task-ready backlog.

## Quality Gates

- Non-goals from the PRD remain visible.
- Each sprint has verifiable acceptance criteria.

## Anti-Patterns

- Implementing roadmap items that the PRD excludes.
- Treating a conceptual reference as a dependency.

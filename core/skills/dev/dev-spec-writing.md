# Skill: dev-spec-writing

Status: active
Domain: dev
Used by: product-planner, technical-planner, workflows/02-spec

## Purpose

Turn a request or PRD into a SPEC that defines scope, requirements, acceptance criteria and constraints.

## When to Use

- A new feature or platform evolution needs an implementation contract.
- Existing requirements are ambiguous or spread across multiple documents.

## Inputs

- User request or PRD.
- Existing `docs/SPEC.md`.
- Relevant architecture and rules.

## Procedure

1. Extract user-visible outcomes.
2. Separate scope from non-goals.
3. Write requirements as verifiable behavior.
4. Add constraints for security, compatibility and dependencies.
5. Keep ranges small enough for context capsules.

## Output

- Updated SPEC content.

## Quality Gates

- Requirements are objectively verifiable.
- Non-goals are explicit.
- No tool-specific assumptions are introduced.

## Anti-Patterns

- Turning implementation ideas into requirements without evidence.
- Leaving acceptance criteria vague.

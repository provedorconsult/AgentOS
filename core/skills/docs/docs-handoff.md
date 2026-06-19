# Skill: docs-handoff

Status: active
Domain: docs
Used by: release, project-adapter, workflows/06-finish

## Purpose

Prepare concise handoff documentation with changed files, commands, evidence, risks and next steps.

## When to Use

- At the end of a task, sprint, PR or project handoff.
- When a future worker needs enough context to continue safely.

## Inputs

- REVIEW evidence.
- Git status and diff summary.
- Verification commands and exit codes.

## Procedure

1. Summarize the outcome.
2. List created and changed files.
3. Record commands and exit codes.
4. State remaining risks.
5. Add concrete next steps.

## Output

- Handoff-ready summary or review section.

## Quality Gates

- Evidence is fresh.
- Risks are explicit.

## Anti-Patterns

- Claiming completion without command output.
- Hiding skipped validation.

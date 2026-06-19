# Skill: ops-retro-capture

Status: active
Domain: ops
Used by: continuous-improvement, workflows/10-retro

## Purpose

Capture lessons after a verified delivery and decide whether to update skills, rules, workflows, templates or docs.

## When to Use

- After a sprint or task is verified.
- After a repeated failure or blocker appears.

## Inputs

- `docs/REVIEW.md`.
- Git diff.
- Validation output.
- User feedback.

## Procedure

1. Identify what worked.
2. Identify what failed or slowed execution.
3. Decide whether the issue is recurring.
4. Propose a small improvement task when needed.
5. Record the lesson without masking failures.

## Output

- Retro notes or a follow-up task.

## Quality Gates

- Lessons are based on evidence.
- Global policy changes are justified by recurrence.

## Anti-Patterns

- Broad refactors during retro.
- Rewriting policy for one isolated incident.

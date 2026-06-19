# Skill: dev-code-review

Status: active
Domain: dev
Used by: reviewer, qa, workflows/07-release

## Purpose

Review changes for regressions, missing verification and scope drift.

## When to Use

- Before commit, release or handoff.
- After a task changes shared behavior.

## Inputs

- Git diff.
- SPEC, PLAN and task acceptance criteria.
- Test output.

## Procedure

1. Compare the diff with declared scope.
2. Look for behavior regressions and missing tests.
3. Check docs and REVIEW evidence.
4. Confirm no unrelated refactor was introduced.
5. Record findings or state that no findings were found.

## Output

- Review notes or updated evidence.

## Quality Gates

- Findings include file and line references when possible.
- Verification output is fresh.

## Anti-Patterns

- Summarizing before checking risks.
- Treating green validation as proof of complete requirement coverage.

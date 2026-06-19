# Goals

Goals describe durable outcomes above tasks. They do not replace SPEC, PLAN, sprint tasks or context capsules; they link those artifacts to a broader mission and project objective.

## Hierarchy

Mission -> Project -> Goal -> SPEC -> PLAN -> Sprint -> Task -> Evidence

## Goal vs Task

- A goal states the outcome, success signals, constraints and linked evidence.
- A task states a bounded implementation unit with editable files, read-only context, acceptance criteria and verification commands.
- A context capsule stays task-level and keeps the worker from reading too broadly.

## Files

- `core/goals/README.md`: operating model.
- `core/goals/goal.schema.json`: minimal JSON schema.
- `core/goals/mission.template.md`: mission template.
- `core/goals/project-goal.template.md`: project goal template.
- `core/goals/goal.template.md`: reusable goal template.

## Use

Create a goal when the work spans multiple tasks or sprints, when the outcome must survive across sessions, or when evidence must be tied to a higher-level objective.

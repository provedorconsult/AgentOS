# SpecPilot Engine

`specpilot/` makes the internal SPEC-driven engine explicit without turning it into a separate product. AgentOS remains the platform; SpecPilot remains the execution engine.

## Structure

- `templates/`: index of authoring and runtime templates.
- `validators/`: index of local mechanical validators.
- `harness/`: index of runtime harness state.

## Canonical Artifacts

- Authoring templates live in `docs/`.
- Runtime templates live in `.harness/templates/`.
- Local validators live in `scripts/`.
- Active runtime state lives in `.harness/`.

# PLAN

## Summary

Close only the remaining short-horizon gaps from the roadmap, keep existing placeholders honest, and refresh the active runtime evidence without adding medium or long horizon behavior.

## Tasks

### Task 001 - Align Core and SpecPilot Surfaces

- Goal: make the neutral core and explicit SpecPilot engine visible in the repository surface.
- Editable files: `README.md`, `agentos.yaml`, `core/`, `specpilot/`, `docs/SPECPILOT_ENGINE.md`
- Verification: `npm run doctor`

### Task 002 - Align Active Runtime Artifacts

- Goal: point the active SPEC, PLAN and sprint state at the roadmap short horizon.
- Editable files: `docs/SPEC.md`, `docs/PLAN.md`, `.harness/current.txt`, `.harness/project-state.json`, `.harness/sprints/2026-06-10-agentos-short-horizon.json`
- Verification: `npm run validate`

### Task 003 - Refresh Review Evidence

- Goal: record objective evidence for the short-horizon alignment.
- Editable files: `docs/REVIEW.md`
- Verification: `npm run doctor`, `npm run validate`

## Risks

- Existing legacy workflow files remain in the repository for compatibility and may confuse future work if the canonical numbered sequence is ignored.
- `validate:context` proves path and range integrity, not semantic freshness.
- Extensions, packs, Claude Code and Antigravity stay as placeholders until a future medium-horizon SPEC activates them.

# Contributing

## Language Policy

English is the canonical language for new architecture, contract and operational documents (`docs/`, `core/`, `specpilot/`, `adapters/`). Portuguese is acceptable only in transitory artifacts, audits or explicitly local material. Existing Portuguese documents may be converted gradually.

## Local Gates

Run before opening a pull request:

- `npm run doctor`
- `npm run validate`
- `npm test`
- `git diff --check`

## Branching

- do not commit directly to `main`;
- open a pull request with verification evidence and rollback notes;
- keep changes small and reversible.

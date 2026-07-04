# SpecPilot Validators

SpecPilot validation is implemented with local Node.js scripts backed by two pinned, audited dependencies declared in `package.json`: `yaml` (safe YAML parsing) and `ajv` (JSON Schema Draft 2020-12 execution).

## Validators

- `scripts/doctor.mjs`: required repository surfaces and local prerequisites.
- `scripts/validate-sprint-json.mjs`: harness JSON discovery plus schema and semantic validation.
- `scripts/validate-context-ranges.mjs`: spec and read-only range containment.
- `scripts/validate-state.mjs`: harness pointer and project-state consistency.
- `scripts/validate-no-secrets.mjs`: structured secret scanning with redaction.
- `scripts/validate-edit-scope.mjs`: real Git diff against declared sprint scope.
- `scripts/validate-workflows.mjs`: canonical and deprecated workflow manifest.
- `scripts/validate-adapters.mjs`: adapter documentation and instruction-surface contracts.
- `scripts/validate-docs.mjs`: required docs and relative link integrity.
- `scripts/validate-license.mjs`: license and version metadata coherence.

## Shared Libraries

- `scripts/lib/agentos-config.mjs`: configuration loading and path containment.
- `scripts/lib/agentos-contracts.mjs`: task, sprint and project-state semantics.
- `scripts/lib/json-schema.mjs`: Ajv schema execution.

Run everything through `npm run validate`.

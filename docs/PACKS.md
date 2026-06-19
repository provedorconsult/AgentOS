# Packs

Packs are optional domain bundles. They can collect planned agents, skills and rules for a domain, but they are not part of the core runtime unless a project explicitly chooses them.

## Available Placeholders

- `packs/engineering/`
- `packs/business/`
- `packs/isp/`
- `packs/devops/`
- `packs/security/`

## Activation Model

This phase only documents packs. Future activation should copy or reference selected pack material through a declared adapter or project setup task, then verify the selected files through `doctor` or a pack-specific validator.

## Non-Goals

- Packs do not auto-load into `core/`.
- Packs do not add dependencies.
- Packs do not create integrations or services.

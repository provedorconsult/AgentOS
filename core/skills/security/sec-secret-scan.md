# Skill: sec-secret-scan

Status: active
Domain: security
Used by: security, workflows/06-verify

## Purpose

Check changes for secrets, credential-like placeholders and unsafe environment files.

## When to Use

- Before commit or release.
- When adding adapters, configs, extensions or examples.

## Inputs

- Git diff.
- `scripts/validate-no-secrets.mjs` output.
- Config and example files.

## Procedure

1. Run the repository secret validator.
2. Inspect new configuration files.
3. Ensure real `.env` files are not added.
4. Replace credential-like examples with safe placeholders.
5. Record the result in review evidence.

## Output

- Secret-scan evidence.

## Quality Gates

- `npm run validate:secrets` passes.
- No real tokens, private keys or credentials are committed.

## Anti-Patterns

- Using realistic tokens as examples.
- Treating `.env.example` as safe without inspection.

# Security Guardrails

Operational security guardrails for agents and humans working on AgentOS repositories. The vulnerability reporting policy lives in the repository root `SECURITY.md`; the short normative rules for agents live in `core/rules/security.md`.

## Secrets

Never commit:

- API keys;
- OAuth tokens;
- private keys;
- `.env` files with real values;
- production credentials;
- database dumps;
- customer data.

Use `.env.example` for placeholders only. The secret scanner validates `.env.example` and rejects live-looking keys there as well.

## Command Safety

Agents must avoid destructive commands unless the user explicitly asks and the target path is verified.

Production operations require:

- target environment;
- command;
- rollback plan;
- expected health check;
- human confirmation.

## Reporting

Report vulnerabilities through the private GitHub Security Advisory channel linked in the repository root `SECURITY.md`.

## Dependency Safety

Before adding dependencies, record:

- why the dependency is needed;
- license or policy concerns;
- maintenance status;
- security risks;
- fallback option.

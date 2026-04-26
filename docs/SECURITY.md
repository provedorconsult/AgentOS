# Security Policy

AgentOS favors explicit, auditable automation.

## Secrets

Never commit:

- API keys;
- OAuth tokens;
- private keys;
- `.env` files with real values;
- production credentials;
- database dumps;
- customer data.

Use `.env.example` for placeholders.

## Command Safety

Agents must avoid destructive commands unless the user explicitly asks and the target path is verified.

Production operations require:

- target environment;
- command;
- rollback plan;
- expected health check;
- human confirmation.

## Dependency Safety

Before adding dependencies, record:

- why the dependency is needed;
- license or policy concerns;
- maintenance status;
- security risks;
- fallback option.

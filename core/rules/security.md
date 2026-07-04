# Security Rules

- Do not commit secrets, tokens, private keys or real `.env` files.
- Use `.env.example` for documented variables.
- Treat destructive commands as approval-gated.
- Deploy only with a rollback path.
- Production operations require an explicit target, command, rollback plan, health check and human confirmation.
- Record the reason, license, maintenance status and fallback before adding any dependency.

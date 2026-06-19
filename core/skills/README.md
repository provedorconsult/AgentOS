# Skills

AgentOS skills are markdown-first operating procedures. They are reusable by agents and workflows, but they are not executable plugins and must stay IDE-neutral.

## Domains

- `dev`: engineering execution skills.
- `security`: security review and safeguards.
- `product`: product discovery and PRD translation.
- `ops`: retro and operational continuity.
- `data`: reserved for future data workflows.
- `docs`: documentation and handoff.

## Skill Format

Each skill must include:

- Purpose
- When to Use
- Inputs
- Procedure
- Output
- Quality Gates
- Anti-Patterns

## Creating a Skill

Create the markdown file under the closest domain folder. Keep it procedural, evidence-oriented and independent of Codex, Claude Code or any other adapter.

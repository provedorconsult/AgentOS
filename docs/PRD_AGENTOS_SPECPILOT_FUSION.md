# PRD - Fusao do specpilot-codex dentro do AgentOS

Status: draft  
Owner: Provedor Consult  
Target repository: `provedorconsult/AgentOS`  
Source repository: `provedorconsult/specpilot-codex`

## Objetivo

Transformar o AgentOS em um sistema generico de desenvolvimento agentic, compativel com Codex e outras IDEs/agentes, incorporando o motor SPEC-driven do `specpilot-codex` como camada interna reutilizavel chamada SpecPilot Engine.

## Escopo

Dentro do escopo:

- Reestruturar AgentOS para separar nucleo universal e adaptadores.
- Incorporar templates e validadores do SpecPilot.
- Migrar workflows e regras universais para `core/`.
- Criar `agentos.yaml`.
- Criar scripts Node.js multiplataforma.
- Criar adaptadores Codex, Generic IDE e Antigravity.
- Atualizar README, AGENTS.md e documentacao.
- Substituir `codexGoal` por `agentGoal` nos arquivos centrais.

Fora do escopo:

- Interface web, banco, servidor, API externa, publicacao npm/Homebrew, deploy automatizado em producao e suporte completo a todos os agentes.

## Arquitetura Alvo

AgentOS e a plataforma principal. SpecPilot Engine e o motor interno de SPEC, PLAN, tasks, context capsules, validacao mecanica e evidencia. Codex e o primeiro adaptador oficial.

Estrutura principal:

- `core/agents/`
- `core/workflows/`
- `core/rules/`
- `core/schemas/`
- `.harness/templates/`
- `.harness/sprints/`
- `adapters/codex/`
- `adapters/generic-ide/`
- `adapters/antigravity/`
- `scripts/*.mjs`

## Contratos

`agentos.yaml` declara projeto, modo generico, `spec_engine: specpilot`, limites de contexto, verificacao obrigatoria e adaptadores disponiveis.

Tasks executaveis usam `agentGoal`, `specRefs`, `context.readOnly`, `context.contracts`, `files`, `acceptanceCriteria`, `verification.commands` e `evidence`.

O lifecycle esperado e:

`pending -> in-progress -> blocked | verified -> done`

## Backlog

1. Criar inventario e mapa de migracao.
2. Salvar este PRD no repositorio.
3. Criar `agentos.yaml`.
4. Criar estrutura `core/`.
5. Migrar templates SPEC, PLAN, TASK e REVIEW.
6. Criar `.harness/`.
7. Documentar SpecPilot Engine.
8. Migrar workflows.
9. Migrar rules.
10. Migrar validadores.
11. Criar `validate-no-secrets.mjs` e `doctor.mjs`.
12. Atualizar `package.json`.
13. Criar adaptadores.
14. Criar CLI local simples.
15. Atualizar README e docs de arquitetura.

## Definition of Done

- `npm run doctor` passa.
- `npm run validate` passa.
- `npm run validate:templates` passa.
- `npm run validate:secrets` passa.
- `core/` nao depende de `.codex/`.
- `adapters/codex/` preserva compatibilidade Codex.
- `adapters/generic-ide/` permite uso manual sem Codex.
- `agentGoal` substitui `codexGoal` nos arquivos centrais.

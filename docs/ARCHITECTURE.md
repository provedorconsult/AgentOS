# AgentOS Architecture

AgentOS e uma plataforma generica para desenvolvimento agentic. A arquitetura separa nucleo universal, motor SpecPilot, adaptadores de IDE/agente, scripts locais e documentacao operacional.

## Core

`core/` contem agentes, workflows, regras e schemas independentes de IDE. Nada em `core/` deve exigir `.codex/` ou comandos exclusivos de uma ferramenta.

## SpecPilot Engine

`.harness/` e `docs/*.template.md` formam a camada SpecPilot: SPEC, PLAN, TASK, REVIEW, context capsules, validadores e evidencia.

## Adapters

`adapters/` contem tradutores para ambientes especificos:

- `codex`: gera `.codex/` e `AGENTS.md` compativeis com Codex.
- `generic-ide`: gera instrucoes portaveis para qualquer IDE/agente.
- `antigravity`: placeholder experimental estruturado.

## Scripts

Scripts principais ficam em Node.js sem dependencias externas para funcionar em Windows, Linux e macOS. PowerShell permanece como compatibilidade.

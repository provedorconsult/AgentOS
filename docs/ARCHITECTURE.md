# AgentOS Architecture

AgentOS e uma plataforma generica para desenvolvimento agentic. A arquitetura separa nucleo universal, motor SpecPilot, adaptadores de IDE/agente, scripts locais e documentacao operacional.

## Core

`core/` contem agentes, workflows, regras, skills, goals e schemas independentes de IDE. Nada em `core/` deve exigir `.codex/`, `.claude/` ou comandos exclusivos de uma ferramenta.

## Agent Layers

`core/agents/` preserva os agentes existentes e adiciona uma organizacao por camadas documentais:

- Engineering: planejamento tecnico, implementacao, QA, review, release e observabilidade.
- Business: planejamento de produto e iniciacao de projetos.
- Operations: adaptacao de projetos, deploy e continuidade operacional.
- Knowledge: melhoria continua, curadoria de ambiente e memoria futura.

As camadas documentam ownership e expansao futura sem duplicar ou mover agentes nesta fase.

## Skills

`core/skills/` contem skills markdown-first. Elas sao procedimentos reutilizaveis, nao plugins executaveis, e devem permanecer independentes de Codex, Claude Code ou qualquer IDE especifica.

## Goals

`core/goals/` define a hierarquia Mission -> Project -> Goal -> Task. Goals complementam o SpecPilot: orientam outcomes duraveis, enquanto SPEC, PLAN, Sprint, Task, context capsule, verification e evidence continuam sob responsabilidade do motor SpecPilot.

## SpecPilot Engine

`.harness/` e `docs/*.template.md` formam a camada SpecPilot: SPEC, PLAN, TASK, REVIEW, context capsules, validadores e evidencia.

## Adapters

`adapters/` contem tradutores para ambientes especificos:

- `codex`: gera `.codex/` e `AGENTS.md` compativeis com Codex.
- `generic-ide`: gera instrucoes portaveis para qualquer IDE/agente.
- `antigravity`: placeholder experimental estruturado.
- `claude-code`: placeholder experimental futuro para mapear core em `.claude/` e `CLAUDE.md`; nao e dependencia do core.

## Extensions

`extensions/` documenta capacidades opcionais planejadas como memory, heartbeats, routines, channels e knowledge-db. Nenhuma extensao e carregada por padrao, e esta fase nao adiciona banco, scheduler, dashboard ou integracoes reais.

## Packs

`packs/` contem bundles opcionais por dominio. O pack ISP existe para projetos recorrentes de provedores, mas packs nao sao ativados automaticamente no core.

## EvoNexus Reference

EvoNexus inspira camadas, skills, goals, retro, memory, routines, heartbeats e packs. Ele nao e dependencia do AgentOS, e funcionalidades como dashboard, scheduler, banco, channels e knowledge database permanecem fora do escopo desta fase.

## Scripts

Scripts principais ficam em Node.js sem dependencias externas para funcionar em Windows, Linux e macOS. PowerShell permanece como compatibilidade.

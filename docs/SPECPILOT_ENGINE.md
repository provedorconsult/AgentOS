# SpecPilot Engine

SpecPilot Engine e o motor interno do AgentOS para desenvolvimento orientado por SPEC. Ele transforma objetivos em especificacoes, planos, tasks pequenas, context capsules, verificacao mecanica e evidencia auditavel.

## Fluxo

1. Discover: entender objetivo, limites e evidencias disponiveis.
2. Spec: registrar comportamento esperado em `docs/SPEC.md`.
3. Plan: dividir trabalho em tasks verificaveis em `docs/PLAN.md`.
4. Implement: executar apenas dentro dos arquivos e ranges declarados.
5. Verify: registrar comando, exit code e evidencia por criterio.
6. Finish: atualizar `docs/REVIEW.md`, revisar diff e concluir.

## Estrutura

- `.harness/templates/project-state.json`: estado do projeto.
- `.harness/templates/sprint.json`: pacote de tasks executaveis.
- `.harness/templates/task.json`: contrato de uma task.
- `.harness/sprints/`: sprints reais do projeto.

## Context Capsule

Cada task declara `specRefs`, arquivos somente leitura com ranges, contratos relevantes, arquivos editaveis e comandos de verificacao. O agente deve evitar leitura ampla quando a task ja tem contexto fechado.

## Lifecycle

`pending -> in-progress -> blocked | verified -> done`

Uma task so pode ir para `done` depois de evidencia objetiva em `docs/REVIEW.md`.

## Relacao com AgentOS e Adaptadores

AgentOS e a plataforma. SpecPilot Engine e o motor de execucao SPEC-driven. Adaptadores, como Codex ou Generic IDE, traduzem esse contrato para ferramentas especificas sem alterar o nucleo.

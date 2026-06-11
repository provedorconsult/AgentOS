# SpecPilot Engine

SpecPilot Engine e o motor interno do AgentOS para desenvolvimento orientado por SPEC. Ele transforma objetivos em especificacoes, planos, tasks pequenas, context capsules, verificacao mecanica e evidencia auditavel.

## Fluxo Canonico

1. Discover: entender objetivo, limites e evidencias disponiveis.
2. Spec: registrar comportamento esperado em `docs/SPEC.md`.
3. Plan: dividir trabalho em tasks verificaveis em `docs/PLAN.md`.
4. Solution: definir a solucao antes de implementar.
5. Implement: executar apenas dentro dos arquivos e ranges declarados.
6. Verify: registrar comando, exit code e evidencia por criterio.
7. Review: revisar diff, escopo e riscos restantes.
8. Release: publicar apenas depois de verificacao verde.
9. Deploy: executar deploy somente com alvo e prova de saude.
10. Retro: capturar melhoria continua.

## Estrutura

- `specpilot/`: indice explicito do motor.
- `docs/*.template.md`: templates de authoring.
- `.harness/templates/`: contratos de runtime.
- `.harness/sprints/`: sprints reais do projeto.
- `scripts/validate-*.mjs`: validadores locais.

## Context Capsule

Cada task declara `specRefs`, arquivos somente leitura com ranges, contratos relevantes, arquivos editaveis e comandos de verificacao. O agente deve evitar leitura ampla quando a task ja tem contexto fechado.

## Lifecycle

`pending -> in-progress -> blocked | verified -> done`

Uma task so pode ir para `done` depois de evidencia objetiva em `docs/REVIEW.md`.

## Relacao com AgentOS e Adaptadores

AgentOS e a plataforma. SpecPilot Engine e o motor de execucao SPEC-driven. Adaptadores, como Codex ou Generic IDE, traduzem esse contrato para ferramentas especificas sem alterar o nucleo.

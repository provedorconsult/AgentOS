# Questões e Decisões para Discussão com a Equipe

Data: 2026-07-04. Origem: auditoria em `docs/AUDIT_CLAUDE.md`. Estas decisões condicionam as fases descritas em `docs/AUDIT_CORRECTION_PLAN.md`. Cada questão traz contexto, opções, recomendação do auditor e o que fica bloqueado enquanto não houver decisão.

Formato de registro sugerido: ao decidir, preencher o bloco "Decisão" de cada item (data, decisor, escolha, justificativa) e, quando a decisão alterar arquitetura, criar um ADR em `docs/DECISIONS/`.

---

## Q1 — Governança de release: quando e como publicar o 2.0.0-rc.1

Contexto: `docs/REVIEW.md` registra `READY FOR OWNER MERGE` com required review desabilitado por falta de segundo revisor elegível. Tag e prerelease continuam bloqueados de propósito (SPEC R8).

Opções:
1. Publicar a prerelease agora com owner-approved merge e CI verde (política já documentada).
2. Aguardar a Fase 1 (reconciliação de confiança) e publicar em seguida.
3. Aguardar um segundo mantenedor elegível e reativar required review antes de qualquer release.

Recomendação: opção 2 — a Fase 1 é pequena e elimina inconsistências que constariam permanentemente do snapshot taggeado.

Bloqueia: Fase 0.

Decisão: _pendente_.

## Q2 — Destino da pilha PowerShell legada

Contexto: `scripts/doctor.ps1` valida um contrato obsoleto (era "control plane") e é o que `environment-health.yml` executa semanalmente; `validate.ps1`, `review-local.ps1`, `install-codex-layer.ps1`, `bootstrap-project.ps1`, `create-github-repo.ps1` e `adapt-existing-project.ps1` duplicam ou antecedem o caminho canônico Node. `deploy.ps1` é wrapper fino legítimo.

Opções:
1. Remover os duplicados (o histórico Git preserva).
2. Mover para `scripts/legacy/` com banner de deprecação.
3. Manter no lugar com banner e prazo de remoção.

Recomendação: opção 1 para `doctor.ps1`, `validate.ps1`, `review-local.ps1` e `install-codex-layer.ps1` (têm substituto canônico direto); opção 2 para `bootstrap-project.ps1`, `create-github-repo.ps1` e `adapt-existing-project.ps1` (fluxos sem equivalente Node ainda).

Perguntas associadas: alguém usa esses scripts hoje em máquinas Windows? Existe automação externa que os invoca?

Bloqueia: Tarefa 2.3.

Decisão: _pendente_.

## Q3 — Destino dos documentos da era "control plane" e do `.docx`

Contexto: `docs/OPERATING_MODEL.md`, `docs/ORCHESTRATION.md`, `docs/AGENT_ROSTER.md`, `docs/OBSERVABILITY.md`, `docs/QUALITY.md`, `docs/MIGRATION_MAP.md`, `docs/DECISIONS/0001`, `docs/EXEC_PLANS/`, `docs/PLAYBOOKS/` descrevem um modelo anterior à Arquitetura 2.0 e competem pela atenção de agentes. `docs/PRD_AGENTOS_EVONEXUS_ALIGNMENT.docx` é binário num repositório markdown-first.

Opções:
1. Arquivar tudo em `docs/legacy/` com banner (preserva contexto histórico navegável).
2. Deletar (histórico Git preserva) e manter só um ponteiro no `docs/INDEX.md`.
3. Reescrever os que ainda têm valor (ex.: `AGENT_ROSTER.md` descreve os agentes de `core/agents/`, que continuam existindo) e arquivar o resto.

Recomendação: opção 3 — triagem documento a documento; para o `.docx`, converter para Markdown se a fonte ainda importa, senão remover.

Perguntas associadas: quem tem a fonte editável do `.docx`? `AGENT_ROSTER.md` e `QUALITY.md` são exigidos por `agent-review.yml` — o gate deve passar a exigir quais documentos?

Bloqueia: Tarefas 2.2 e 2.4.

Decisão: _pendente_.

## Q4 — Nome do documento de guardrails de segurança

Contexto: `SECURITY.md` (raiz, política de vulnerabilidade — padrão GitHub) e `docs/SECURITY.md` (guardrails operacionais para agentes) compartilham o nome.

Opções: `docs/SECURITY_GUARDRAILS.md`, `docs/AGENT_SAFETY.md`, ou fundir o conteúdo operacional em `core/rules/security.md` e remover o doc.

Recomendação: fundir em `core/rules/security.md` o que for regra de agente e mover o restante para o documento renomeado `docs/SECURITY_GUARDRAILS.md`.

Bloqueia: Tarefa 2.4.

Decisão: _pendente_.

## Q5 — Janela de remoção dos workflows deprecados

Contexto: `core/workflows/` mantém 6 arquivos deprecados com numeração colidente com os canônicos (ex.: `04-implement.md` vs `04-solution.md`). `validate-workflows.mjs` hoje **exige** a presença deles.

Perguntas: existe consumidor externo (outro repositório adaptado) lendo os nomes antigos? Qual ciclo de compatibilidade é aceitável (imediato, 1 release, 1 trimestre)?

Recomendação: remover na Fase 3, após a prerelease, com nota no `CHANGELOG.md`.

Bloqueia: Tarefa 3.1.

Decisão: _pendente_.

## Q6 — Estratégia do adaptador Claude Code além da fatia CLAUDE.md

Contexto: a fatia de 2026-07-04 instalou a superfície de instruções (`CLAUDE.md`) coexistindo com Codex. O roadmap (MP-04) prevê geração de `.claude/agents` e `.claude/skills` a partir de `core/`.

Decisões necessárias:
1. `CLAUDE.md` continua espelho manual de `AGENTS.md` ou passa a ser gerado a partir dele (com validador de drift análogo ao do `.codex/`)?
2. Formato-alvo dos agentes: converter `core/agents/*.md` para subagentes Claude Code (frontmatter + prompt) ou manter só instruções?
3. Skills: mapear `core/skills/**` para `.claude/skills` exige adequação ao formato de skills do Claude Code (frontmatter `name`/`description`) — quem mantém a conversão?
4. O adaptador deve também gerar `.claude/settings.json` (permissões/hooks) ou isso fica fora por decisão de segurança?

Recomendação: começar por (1) com um validador de espelhamento barato; (2)–(4) só via SPEC MP-04 dedicada.

Bloqueia: Fase 4, itens 1 e 2.

Decisão: _pendente_.

## Q7 — Política de configuração do Codex (`codex-layer/config.toml`)

Contexto: o arquivo pina `model = "gpt-5.4"` e traz três servidores MCP desabilitados (github, browser, docs). O teste de drift trava `.codex/` ao `codex-layer/`.

Perguntas: quem decide upgrades de modelo e com que cadência? Os MCP placeholders devem permanecer no template ou sair para documentação? Habilitar MCP por máquina exigiria override local — o contrato de drift byte-a-byte comporta isso (o ARCHITECTURE prevê "generated local overrides" apenas via SPEC futura)?

Recomendação: manter como está no curto prazo; registrar a política de upgrade de modelo em `docs/ADAPTERS.md` quando decidida.

Bloqueia: nada no curto prazo; condiciona Fase 4 item 5 (MCP).

Decisão: _pendente_.

## Q8 — Evidência auto-declarada vs evidência executada

Contexto: os gates garantem consistência interna da evidência (comando declarado, exit 0, critério coberto), mas não que o comando foi de fato executado com aquele resultado (auditoria, seção 13). O CI mitiga ao reexecutar tudo.

Opções:
1. Aceitar o limite atual (CI como fonte de verdade) e documentá-lo.
2. Runner local que executa `verification.commands`, grava stdout/exit code com hash e preenche a evidência automaticamente.

Recomendação: opção 1 agora (documentar em `docs/SPECPILOT_ENGINE.md`), opção 2 como SPEC de médio prazo (Fase 4, item 3).

Bloqueia: Fase 4, item 3.

Decisão: _pendente_.

## Q9 — Segundo mantenedor e required review

Contexto: a governança atual (owner-approved merge) existe porque não há segundo revisor elegível. Issue #12 foi superada por essa política.

Perguntas: há previsão de um segundo mantenedor? Ao existir, required review volta a ser obrigatório para `main`? Revisão por agente (ex.: workflow de review automatizado) conta como mitigação intermediária aceitável?

Bloqueia: evolução da Fase 0; não bloqueia Fases 1–3.

Decisão: _pendente_.

## Q10 — Hooks do codex-layer em ambientes POSIX

Contexto: `codex-layer/hooks.json` invoca PowerShell; em Linux/macOS os hooks de pre-command/pre-completion são inertes, então o scanner de segredos não roda nesses eventos fora do Windows.

Perguntas: existem usuários de Codex em Linux/macOS no time? O gate de CI (que roda o scanner em ambos os SOs) é considerado suficiente?

Recomendação: se houver qualquer uso POSIX do Codex, criar shims `sh` (Tarefa 3.2); caso contrário, registrar a decisão e fechar sem código.

Bloqueia: Tarefa 3.2.

Decisão: _pendente_.

## Q11 — Política de correção de registros históricos do harness

Contexto: a Tarefa 1.4 precisava tratar uma suposta entrada fantasma num sprint já `verified` (`docs/superpowers/plans/...`). **Errata 2026-07-04: o arquivo existe e o achado foi anulado (ver `docs/AUDIT_CLAUDE.md`, seção 12.8).** A questão de política permanece válida: editar um sprint verificado altera um registro histórico de evidência.

Opções:
1. Editar o sprint verificado removendo a entrada (com nota no `CHANGELOG.md`).
2. Não tocar o histórico; registrar a discrepância em `docs/REVIEW.md` como errata permanente.
3. Definir uma regra geral: sprints `verified`/arquivados são imutáveis e discrepâncias viram errata.

Recomendação: opção 3 (regra geral) aplicando a errata da opção 2 a este caso.

Bloqueia: Tarefa 1.4.

Decisão: _pendente_.

## Q12 — Domínio `data` de skills e idioma da documentação

Contexto A: `docs/SKILLS.md` lista o domínio `data`, mas `core/skills/data/` contém apenas `.gitkeep`.

Contexto B: a documentação mistura inglês (`ARCHITECTURE.md`, `SPEC.md`, `PLAN.md`, `README.md`) e português (`SPECPILOT_ENGINE.md`, `ADAPTERS.md`, `IDE_COMPATIBILITY.md`), sem regra declarada.

Perguntas: criar uma skill `data` mínima real ou remover o domínio até existir demanda? Qual é o idioma canônico da documentação — e vale registrar isso em `CONTRIBUTING.md`?

Recomendação: remover o domínio `data` do doc até haver skill real; padronizar novos documentos em um idioma único (decisão do time) e converter gradualmente os demais.

Bloqueia: Tarefa 3.3 (contexto A); contexto B não bloqueia nada, mas evita retrabalho futuro de documentação.

Decisão: _pendente_.

---

## Resumo de dependências

| Decisão | Bloqueia |
|---|---|
| Q1 | Fase 0 |
| Q2 | Tarefa 2.3 |
| Q3 | Tarefas 2.2, 2.4 |
| Q4 | Tarefa 2.4 |
| Q5 | Tarefa 3.1 |
| Q6 | Fase 4 (itens 1–2) |
| Q7 | Fase 4 (item 5) |
| Q8 | Fase 4 (item 3) |
| Q9 | Evolução da Fase 0 |
| Q10 | Tarefa 3.2 |
| Q11 | Tarefa 1.4 |
| Q12 | Tarefa 3.3 |

Fases 1 (exceto 1.4) e a Tarefa 2.1 não dependem de nenhuma decisão e podem iniciar imediatamente.

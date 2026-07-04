# Plano de Implementação das Correções da Auditoria

Data: 2026-07-04. Origem: `docs/AUDIT_CLAUDE.md` (seções 12–17). Decisões em aberto que condicionam este plano estão em `docs/AUDIT_OPEN_QUESTIONS.md`.

## Modelo de execução

- Cada fase vira **um sprint SpecPilot** (`.harness/sprints/*.json`) com `agentGoal`, contexto fechado, arquivos editáveis declarados, critérios de aceite e comandos de verificação, seguindo `.harness/templates/sprint.json`.
- Uma fase só inicia quando a anterior estiver `verified` com evidência em `docs/REVIEW.md` e CI verde em Ubuntu e Windows.
- Gate universal de saída de toda fase: `npm run doctor`, `npm run validate`, `npm test` e `git diff --check`, todos com exit code 0, local e no CI.
- Nenhuma fase adiciona dependências de produto. Qualquer item marcado como "requer decisão" fica bloqueado até resolução da questão correspondente (Q1–Q12).

## Visão geral das fases

```text
Fase 0  Fechamento do RC (governança, sem código)        — desbloqueia release
Fase 1  Reconciliação de confiança (P1)                  — 1 sprint pequeno
Fase 2  Higiene de legado (P2)                           — 1 sprint médio
Fase 3  Refinamentos (P3)                                — 1 sprint pequeno
Fase 4  Evolução de médio prazo (requer SPEC nova)       — fora do horizonte curto
```

Dependências: Fase 1 não depende de Fase 0 (podem correr em paralelo). Fase 2 depende das decisões Q2, Q3 e Q4. Fase 3 depende da Fase 2 (remoção de deprecados só após a higiene). Fase 4 depende de SPEC ativa e das decisões Q6–Q10.

---

## Fase 0 — Fechamento do RC (governança)

Objetivo: concluir o ciclo de release do `2.0.0-rc.1` que a SPEC R8 deixou travado de propósito.

Pré-condições: decisão Q1 (política de merge e momento da prerelease).

Ações (owner, sem alteração de código):

1. Confirmar branch protection em `main` conforme `docs/REVIEW.md` (checks Ubuntu/Windows + checklist obrigatórios).
2. Merge das mudanças pendentes por PR com checks verdes.
3. Criar tag e prerelease GitHub `2.0.0-rc.1` somente após CI verde, registrando em `docs/REVIEW.md`.

Critérios de aceite: tag e prerelease existem; `docs/REVIEW.md` registra run ids do CI e decisão de release; nenhuma publicação com check vermelho.

Verificação: `gh pr checks`, `gh release view`, `npm run validate` no commit taggeado.

---

## Fase 1 — Reconciliação de confiança (P1)

Objetivo: eliminar as inconsistências que corrompem a confiança nos gates (documentação de validadores, doctor errado no CI de saúde, actions não pinadas, referência fantasma).

Pré-condições: nenhuma. Sprint sugerido: `.harness/sprints/2026-07-XX-audit-p1-trust-reconciliation.json`.

### Tarefa 1.1 — Corrigir `specpilot/validators/README.md`

- Arquivos editáveis: `specpilot/validators/README.md`.
- Critérios de aceite: lista os 10 validadores existentes em `scripts/`; nenhuma menção a "no external dependencies"; declara `ajv` e `yaml` pinados como dependências de validação.
- Verificação: `npm run validate:docs`, `npm run validate`.

### Tarefa 1.2 — Canonizar o doctor no workflow de saúde e pinar actions

- Arquivos editáveis: `.github/workflows/environment-health.yml`, `.github/workflows/agent-review.yml`.
- Critérios de aceite: `environment-health.yml` executa `npm ci` + `npm run doctor` (Node canônico) em vez de `scripts/doctor.ps1`; nenhum `uses:` com tag mutável nos dois workflows (SHA imutável, como em `ci.yml`); Dependabot (`.github/dependabot.yml`, ecossistema `github-actions`) continua responsável por propor atualizações dos SHAs.
- Verificação: `npm run validate`, `git diff --check`, execução manual do workflow de saúde via `workflow_dispatch`.

### Tarefa 1.3 — Atualizar `codex-layer/README.md`

- Arquivos editáveis: `codex-layer/README.md`.
- Critérios de aceite: sem nota de sandbox de sessão obsoleta; instalação documentada aponta para `npm run agentos:install-adapter -- codex`; `install-codex-layer.ps1` citado apenas como legado, se citado.
- Verificação: `npm run validate:docs`, `npm test` (o teste de não-drift `.codex/` vs `codex-layer/` continua verde).

### Tarefa 1.4 — Resolver a referência fantasma do sprint RC final

**CANCELADA POR ERRATA (2026-07-04):** o arquivo `docs/superpowers/plans/2026-06-19-agentos-rc-final-hardening.md` existe; o achado 12.8 da auditoria foi anulado (a varredura inicial não alcançou a profundidade do diretório). Nenhuma mudança no sprint histórico é necessária. A política de imutabilidade de sprints verificados (Q11) foi adotada como regra geral e documentada em `docs/SPECPILOT_ENGINE.md`.

### Tarefa 1.5 — Indexar os artefatos de auditoria

- Arquivos editáveis: `docs/INDEX.md`.
- Critérios de aceite: `AUDIT_CLAUDE.md`, `AUDIT_CORRECTION_PLAN.md` e `AUDIT_OPEN_QUESTIONS.md` listados no índice com uma linha de descrição cada.
- Verificação: `npm run validate:docs`.

Gate de saída da fase: gate universal + inspeção manual de que nenhum workflow referencia `scripts/doctor.ps1`.

Esforço estimado: baixo (arquivos pequenos, sem lógica nova). Risco: baixo; o único ponto de atenção é 1.4, que toca registro histórico (ver Q11).

---

## Fase 2 — Higiene de legado (P2)

Objetivo: remover a ambiguidade entre o caminho canônico Node e o material da era "control plane", que hoje compete pela atenção de agentes e adotantes.

Pré-condições: decisões Q2 (destino dos scripts PowerShell), Q3 (destino dos docs legados e do `.docx`) e Q4 (novo nome de `docs/SECURITY.md`). Sprint sugerido: `.harness/sprints/2026-07-XX-audit-p2-legacy-hygiene.json`.

### Tarefa 2.1 — Doctor com diagnóstico de bootstrap

- Arquivos editáveis: `scripts/doctor.mjs`, `tests/agentos-doctor-bootstrap.test.mjs` (novo).
- Critérios de aceite: sem `node_modules/`, o doctor sai com exit 1 e mensagem clara contendo `npm ci` (sem stack trace bruto); com dependências instaladas, comportamento inalterado; teste de regressão cobre os dois caminhos.
- Verificação: `npm test`, `npm run validate`.
- Nota de implementação: verificar a resolubilidade de `yaml`/`ajv` (ex.: `import.meta.resolve` ou `fs.existsSync` de `node_modules`) antes do `import` de `scripts/lib/agentos-config.mjs`, ou capturar `ERR_MODULE_NOT_FOUND` num wrapper.

### Tarefa 2.2 — Arquivar docs da era control plane

- Arquivos editáveis: `docs/OPERATING_MODEL.md`, `docs/ORCHESTRATION.md`, `docs/AGENT_ROSTER.md`, `docs/OBSERVABILITY.md`, `docs/QUALITY.md`, `docs/MIGRATION_MAP.md`, `docs/DECISIONS/*`, `docs/EXEC_PLANS/*`, `docs/PLAYBOOKS/*`, `docs/PRD_AGENTOS_EVONEXUS_ALIGNMENT.docx`, `docs/INDEX.md`, `.github/workflows/agent-review.yml`, `scripts/doctor.ps1` (referências), `tests/*` se algum gate citar os paths antigos.
- Critérios de aceite: material movido para `docs/legacy/` com banner de obsolescência no topo de cada arquivo; `docs/INDEX.md` atualizado; `.docx` convertido para Markdown ou removido (conforme Q3); nenhum link relativo quebrado; `agent-review.yml` não exige mais paths antigos.
- Verificação: `npm run doctor`, `npm run validate:docs`, `npm run validate`.
- Atenção: `scripts/validate-docs.mjs` varre `docs/` recursivamente — os banners e movimentações não podem quebrar o verificador de links.

### Tarefa 2.3 — Deprecar a pilha PowerShell duplicada

- Arquivos editáveis: `scripts/doctor.ps1`, `scripts/validate.ps1`, `scripts/review-local.ps1`, `scripts/install-codex-layer.ps1`, `scripts/bootstrap-project.ps1`, `scripts/create-github-repo.ps1`, `scripts/adapt-existing-project.ps1` (destino conforme Q2: remoção, `scripts/legacy/` ou banner de deprecação); `docs/TROUBLESHOOTING.md` se citar os scripts.
- Critérios de aceite: nenhum script duplicado sem marcação de deprecado; `scripts/deploy.ps1` permanece (wrapper fino legítimo usado por `deploy.yml`); nenhuma referência ativa de CI/docs aos removidos.
- Verificação: `npm run validate`, `grep` negativo por referências aos scripts deprecados em `.github/` e `docs/` (fora de `docs/legacy/`).

### Tarefa 2.4 — Resolver a colisão de nomes de SECURITY

- Arquivos editáveis: `docs/SECURITY.md` (rename conforme Q4), `docs/INDEX.md`, arquivos que o referenciam (`.github/workflows/agent-review.yml`).
- Critérios de aceite: raiz `SECURITY.md` permanece como política de vulnerabilidade; o documento de guardrails operacionais tem nome distinto; links e gates atualizados.
- Verificação: `npm run validate:docs`, `npm run validate`.

Gate de saída da fase: gate universal + `agent-review.yml` verde num PR de teste.

Esforço estimado: médio (muitos arquivos, lógica pequena). Risco: médio — gates baseados em listas/regex (`validate-docs.mjs`, `agent-review.yml`) precisam ser atualizados em conjunto com as movimentações, na mesma fase, para não quebrar o CI.

---

## Fase 3 — Refinamentos (P3)

Objetivo: fechar as pontas menores depois que o legado estiver isolado.

Pré-condições: Fase 2 concluída; decisões Q5 (janela de remoção dos workflows deprecados), Q10 (hooks POSIX) e Q12 (skill `data/`). Sprint sugerido: `.harness/sprints/2026-08-XX-audit-p3-refinements.json`.

### Tarefa 3.1 — Remover workflows deprecados numerados

- Arquivos editáveis: `core/workflows/04-implement.md`, `05-verify.md`, `06-finish.md`, `07-release.md`, `08-deploy.md`, `09-improve.md` (delete), `scripts/validate-workflows.mjs` (remover a lista `deprecated`), `docs/ARCHITECTURE.md` (nota de compatibilidade).
- Critérios de aceite: apenas a sequência canônica 01–10 existe; `validate-workflows.mjs` não exige mais os arquivos de compatibilidade; nenhuma referência restante aos nomes antigos.
- Verificação: `npm run validate:workflows`, `npm run validate`.

### Tarefa 3.2 — Hook de segredos portátil no codex-layer

- Arquivos editáveis: `codex-layer/hooks/check-no-secrets.sh` (novo), `codex-layer/hooks/check-exec-plan.sh` (novo), `codex-layer/hooks.json`, `tests/*` (regressão do delegado POSIX).
- Critérios de aceite: em ambiente POSIX os hooks delegam ao mesmo `scripts/validate-no-secrets.mjs`; comportamento Windows inalterado; teste cobre o novo caminho.
- Verificação: `npm test`, `npm run validate`.
- Bloqueado por Q10 (se o time decidir que hooks POSIX não são necessários, registrar a decisão e fechar a tarefa sem código).

### Tarefa 3.3 — Domínio `data` de skills

- Arquivos editáveis: `core/skills/data/*` (nova skill mínima) ou `docs/SKILLS.md` (remoção do domínio), conforme Q12.
- Critérios de aceite: `docs/SKILLS.md` e `core/skills/` deixam de divergir.
- Verificação: `npm run validate:docs`, `npm run validate`.

Gate de saída da fase: gate universal.

Esforço estimado: baixo. Risco: baixo; 3.1 é a única remoção e é coberta por validador próprio.

---

## Fase 4 — Evolução de médio prazo (requer SPEC nova)

Objetivo: registrar o horizonte sem executá-lo. Nenhum item abaixo deve iniciar sem SPEC ativa, PLAN e sprint próprios, conforme `docs/PRD_AGENTOS_ROADMAP_CURTO_MEDIO_LONGO_PRAZO.md`.

Itens, em ordem sugerida de valor:

1. **MP-04 completo — geração de `.claude/`**: estender o adaptador `claude-code` para gerar `.claude/agents` e `.claude/skills` a partir de `core/`, com validador de drift análogo ao do `.codex/` (depende de Q6; a fatia `CLAUDE.md` de 2026-07-04 já cobre as instruções).
2. **Validador de espelhamento `CLAUDE.md` vs `AGENTS.md`**: gate mecânico para o risco de divergência entre as duas superfícies de instrução (depende de Q6).
3. **Evidência executada, não declarada**: runner local que executa `verification.commands` e grava evidência com hash do output, fechando a lacuna descrita na seção 13 da auditoria (depende de Q8).
4. **Extensions executáveis** (memory → heartbeats → routines, nesta ordem) e **ativação de packs** com validador próprio.
5. **Adaptador Antigravity funcional** e **CLI madura / MCP opcional** (depende de Q7 para MCP).

## Rastreabilidade

| Achado da auditoria (seção) | Fase/Tarefa |
|---|---|
| 12.1 validators README | 1.1 |
| 12.3 / 13 doctor.ps1 divergente no CI de saúde | 1.2 e 2.3 |
| 12.5 actions não pinadas | 1.2 |
| 12.4 codex-layer README obsoleto | 1.3 |
| 12.8 referência fantasma no sprint RC | 1.4 |
| 14 onboarding hostil do doctor | 2.1 |
| 9 / 12.7 / 15 docs legados, `.docx`, SECURITY duplicado | 2.2 e 2.4 |
| 15.1 pilha PowerShell | 2.3 |
| 12.6 / 15.3 workflows deprecados | 3.1 |
| 11 / 15.4 hooks PowerShell-only | 3.2 |
| 15.5 skills/data vazio | 3.3 |
| 13 evidência auto-declarada | 4.3 |
| 17-Futuro Claude Code MP-04, extensions, packs, Antigravity | 4.1–4.5 |

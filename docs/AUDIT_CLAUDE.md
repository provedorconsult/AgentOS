# Auditoria Técnica do AgentOS

Data: 2026-07-04. Auditor: Claude Code (Claude Fable 5), atuando como auditor técnico sênior, arquiteto, revisor de documentação, analista de segurança e QA. Base auditada: branch `main`, commit `da55037` (merge do PR #11), árvore limpa no início da auditoria.

Nota de escopo: além da auditoria, o pedido do usuário autorizou explicitamente uma única implementação — compatibilidade com Claude Code no VSCode coexistindo com Codex. Ela foi executada como fatia SPEC-driven (SPEC R9, PLAN Task 008, sprint `.harness/sprints/2026-07-04-claude-code-vscode-compat.json`) e está descrita na seção 18. Todo o restante deste relatório reflete o estado do repositório como encontrado.

## 1. Sumário executivo

- O AgentOS 2.0.0-rc.1 é um sistema operacional agentic **file-first e local**, com motor SpecPilot explícito e validação mecânica real: `npm run doctor` e `npm run validate` passam com exit code 0, com 38 testes verdes no estado original (40 após a fatia Claude Code).
- A arquitetura declarada em `docs/ARCHITECTURE.md` (core neutro, specpilot como índice, `.harness/` como runtime, adaptadores opcionais, placeholders honestos) **corresponde ao que existe em disco**. Não encontrei adaptador assumindo papel de core.
- Os pontos fortes reais são os validadores: escopo de edição comparado ao diff Git, descoberta automática de JSON do harness, schemas Draft 2020-12 executados com Ajv, scanner de segredos com redação, contenção de paths com symlink/travessia, e gates de evidência que rejeitam falso sucesso.
- As fragilidades principais são documentais e de material legado: uma camada inteira de documentos da era "control plane" (`docs/OPERATING_MODEL.md`, `docs/ORCHESTRATION.md`, `docs/AGENT_ROSTER.md`, `docs/MIGRATION_MAP.md`, `docs/DECISIONS/0001`, um `.docx` binário) e scripts PowerShell paralelos (`scripts/doctor.ps1`, `scripts/validate.ps1`, `scripts/install-codex-layer.ps1` etc.) que divergem do caminho canônico Node e podem confundir agentes futuros.
- Segurança: nenhum segredo real encontrado; `.env.example` contém apenas placeholders vazios; deploy falha fechado; nenhum comando destrutivo nos scripts. Riscos residuais: workflows `agent-review.yml` e `environment-health.yml` usam actions não pinadas por SHA (contradiz o espírito do R1 da SPEC) e hooks do codex-layer são PowerShell-only.
- Classificação de maturidade: **MVP funcional local / release candidate para uso interno**. Não está pronto para uso externo.

## 2. Metodologia de auditoria

1. Leitura na ordem obrigatória: pedido do usuário → `docs/SPEC.md` → `docs/PLAN.md` → `.harness/sprints/*.json` e `.harness/current.txt` → `AGENTS.md` → `core/rules/*.md` → `README.md` → `agentos.yaml` → `package.json` → `scripts/` → `core/` → `specpilot/` → `.harness/` → `adapters/` → `docs/` → demais arquivos.
2. Execução apenas de comandos locais e seguros (`pwd`, `ls`, `find`, `cat`, `grep`, `npm ci`, `npm run doctor`, `npm run validate`, `npm test`).
3. Nenhum diretório gerado foi lido (`node_modules/`, `.git/` internos). `.env.example` usado apenas como referência documental; nenhum valor sensível copiado.
4. Toda afirmação crítica cita arquivo e trecho. Comandos citam exit code.
5. Leitura integral dos validadores (`scripts/*.mjs`, `scripts/lib/*.mjs`), schemas (`core/schemas/*.json`) e testes (`tests/*.test.mjs`) antes de qualquer alteração, para não quebrar contratos mecânicos.

## 3. Comandos executados e resultados

Comando: `npm run doctor` (primeira execução, sem `node_modules/`)
Exit code: 1
Resultado: `ERR_MODULE_NOT_FOUND: Cannot find package 'yaml' imported from scripts/lib/agentos-config.mjs`.
Conclusão: o doctor depende de `npm ci` prévio; o Quick Start do README documenta isso, mas a mensagem de erro é um stack trace bruto, não um diagnóstico amigável.
Limitação: comportamento esperado, porém hostil para o primeiro uso.

Comando: `npm ci`
Exit code: 0
Resultado: dependências pinadas instaladas (`ajv 8.20.0`, `yaml 2.9.0`); `found 0 vulnerabilities`.

Comando: `npm run doctor` (após `npm ci`)
Exit code: 0
Resultado: `AgentOS doctor passed.` (Node v24.17.0, git 2.47.3).
Conclusão: todas as ~110 superfícies obrigatórias existem e as configurações canônicas parseiam.

Comando: `npm run validate` (estado original)
Exit code: 0
Resultado: todos os sub-validadores passaram (templates, context, state, secrets, scope, workflows, adapters, docs, license) e 38/38 testes verdes.
Limitação: ver seção 10 — o que o validate prova e o que não prova.

Comando: `npm test` (após a fatia Claude Code autorizada)
Exit code: 0
Resultado: 40/40 testes verdes, incluindo a nova regressão de coexistência claude-code/codex.

Comando: `npm run validate` (final, após a fatia Claude Code)
Exit code: 0
Resultado: validação completa verde com o novo sprint, escopo de edição e docs atualizados.

## 4. Mapa do repositório

```text
core/                 camada universal: agents, workflows, rules, skills, goals, schemas — entregue
specpilot/            índice explícito do motor (4 READMEs apontando para docs/, scripts/, .harness/) — entregue como índice
.harness/             estado de runtime: project-state.json, current.txt, templates/, sprints/ (5), archive/ (4) — entregue
adapters/codex/       instalador real via scripts/agentos-install-adapter.mjs — funcional
adapters/generic-ide/ instruções IDE-neutras instaláveis — funcional
adapters/claude-code/ era placeholder documentado; agora superfície CLAUDE.md suportada (seção 18) — funcional (fatia)
adapters/antigravity/ placeholder experimental honesto — placeholder
codex-layer/          fonte canônica do .codex/ instalado (config, 16 agentes .toml, hooks PS1) — entregue
.codex/               cópia instalada, byte-idêntica ao codex-layer (teste trava drift) — entregue
extensions/           5 READMEs de capacidades planejadas — placeholder honesto
packs/                5 READMEs de bundles de domínio — placeholder honesto
scripts/              validadores Node canônicos + scripts PowerShell legados — misto (ver seção 15)
tests/                7 arquivos de teste de contrato (38 testes; 40 após a fatia) — entregue
docs/                 canônicos + templates + legado da era "control plane" — misto (ver seção 9)
templates/            templates de negócio/projeto da era anterior — legado utilizável
```

## 5. Matriz de funcionalidades

| Funcionalidade | Estado | Evidência |
|---|---|---|
| Doctor de superfícies obrigatórias | Entregue | `scripts/doctor.mjs`; exit 0 |
| Validação de sprint/task com Ajv + semântica | Entregue | `scripts/lib/agentos-contracts.mjs`, `core/schemas/*.json` |
| Descoberta automática de JSON do harness | Entregue | `scripts/validate-sprint-json.mjs --discover` |
| Validação de escopo vs diff Git real | Entregue | `scripts/validate-edit-scope.mjs` |
| Scanner de segredos estruturado com redação | Entregue | `scripts/validate-no-secrets.mjs` |
| Validação de estado/ponteiros do harness | Entregue | `scripts/validate-state.mjs` |
| Validação de workflows canônicos + deprecados | Entregue | `scripts/validate-workflows.mjs` |
| Validação de docs e links relativos | Entregue | `scripts/validate-docs.mjs` |
| Instalador de adaptadores com backup/dry-run/target | Entregue | `scripts/agentos-install-adapter.mjs` |
| Deploy fail-closed | Entregue | `scripts/deploy.mjs` exige `AGENTOS_DEPLOY_COMMAND` |
| CI multi-OS com audit e gates | Entregue | `.github/workflows/ci.yml` (SHAs pinados) |
| Adaptador Codex | Funcional | teste `adapter installers support target directories...` |
| Adaptador Generic IDE | Funcional | mesmo teste; não cria `.codex/` |
| Adaptador Claude Code | Funcional (fatia CLAUDE.md) | seção 18; antes era placeholder documentado |
| Adaptador Antigravity | Placeholder | `adapters/antigravity/README.md`: "experimental placeholder" |
| Extensions (memory, heartbeats, routines, channels, knowledge-db) | Placeholder honesto | `agentos.yaml` marca `status: planned` |
| Packs (engineering, business, isp, devops, security) | Placeholder honesto | `agentos.yaml`: `packs.enabled: false` |
| Skills | Parcial | 7 skills reais em `core/skills/`; `data/` só tem `.gitkeep` |
| Goals | Parcial | schema + templates existem; nenhum goal real instanciado |
| `agentos:init` / `agentos:adapt` | Parcial | `agentos-adapt.mjs` cria apenas um checklist e declara a limitação |
| Dashboard, DB, scheduler, channels, runtime remoto | Não implementado (declarado) | `README.md` "What Is Not Implemented In This Phase" |
| Prerelease formal no GitHub | Aberto | `docs/REVIEW.md`: "Formal prerelease: not published" |

## 6. Avaliação da arquitetura

Coerente com a proposta, com evidência mecânica:

- `core/` é a camada universal e declara os limites certos. Evidência: `core/README.md` — "Do not require `.codex/` or `.claude/`". Nenhum arquivo de `core/` referencia runtime de fornecedor.
- `specpilot/` é honesto: quatro READMEs-índice que apontam para os artefatos canônicos em `docs/`, `scripts/` e `.harness/`, sem duplicar conteúdo. Evidência: `specpilot/README.md` — "makes the internal SPEC-driven engine explicit without turning it into a separate product".
- `.harness/` cumpre o papel de estado de runtime: ponteiro (`current.txt`), estado (`project-state.json`), templates e sprints, tudo validado por descoberta automática.
- `codex-layer/` como fonte canônica é travado por teste: `tests/agentos-2-contracts.test.mjs` compara `.codex/config.toml` com `codex-layer/config.toml` byte a byte.
- Nenhum adaptador assume papel de core: o instalador só copia arquivos do adaptador para o alvo; `core/` não importa nada de `adapters/`.
- Ressalva 1: `codex-layer/README.md` contém uma nota de sessão antiga ("The local sandbox for this session blocks writing a root `.codex/` directory") que não descreve mais a realidade — `.codex/` existe e está commitado.
- Ressalva 2: `core/workflows/` mantém 6 arquivos deprecados com numeração colidente (ex.: `04-implement.md` deprecado ao lado de `04-solution.md` canônico). O `validate-workflows.mjs` exige o marcador de deprecação, o que mitiga, mas a colisão de números continua sendo armadilha de leitura para agentes.

## 7. Avaliação do SpecPilot Engine

- Contrato SPEC-driven claro: `docs/SPECPILOT_ENGINE.md` define fluxo de 10 passos, capsula de contexto e lifecycle `pending -> in-progress -> blocked | verified -> done`.
- Templates existem e são validados: `docs/*.template.md` (authoring) e `.harness/templates/*.json` (runtime), este último validado pelo mesmo pipeline dos sprints reais.
- Validação de contexto é real e limitada por configuração: `agentos.yaml` impõe `max_spec_range_lines: 120`, `max_readonly_files_per_task: 3`, `max_acceptance_criteria_per_task: 5`, `forbidden_dirs`; `validateRangeReference` em `scripts/lib/agentos-contracts.mjs` verifica que os ranges existem dentro do arquivo referenciado.
- `agentGoal` é obrigatório e completo: `validateAgentGoal` exige `draft` iniciando com `/goal`, `outcome`, `verificationSurface`, `constraints`, `boundaries` (com contenção de path), `iterationPolicy` e `blockedStopCondition`; o campo legado `codexGoal` é rejeitado.
- Evidência anti-falso-sucesso: para status `verified`/`done`, cada critério de aceite exige exatamente uma evidência com comando declarado, `exitCode: 0`, `status: "passed"` e `result` que não contenha palavras de falha (`agentos-contracts.mjs`, função `validateEvidence`).
- Separação engine/core/adaptadores é respeitada; o harness tem limites explícitos (`specpilot/harness/README.md`).
- Ressalva: a evidência é auto-declarada no JSON do sprint. O validador garante consistência interna (comando declarado, criterion coberto), mas não reexecuta os comandos nem verifica que o exit code registrado foi real. O elo de confiança final continua sendo o CI + revisão humana.

## 8. Avaliação dos adaptadores

| Adaptador | Classificação | Evidência |
|---|---|---|
| `codex` | Funcional | instalador copia `codex-layer/` → `.codex/` + `AGENTS.md`, com backup e dry-run; testes E2E em `tests/agentos-audit-hardening.test.mjs` |
| `generic-ide` | Funcional | instala `AGENTS.md` + `IDE_AGENT_GUIDE.md`; teste prova que não cria `.codex/` |
| `claude-code` | Era placeholder documentado; agora funcional na fatia CLAUDE.md | antes: `README.md` "future adapter placeholder", sem `templates/`; agora: seção 18 |
| `antigravity` | Placeholder honesto | `mapping.yaml`: "Placeholder only. Do not treat this as production support." |

Nenhum adaptador viola a fronteira do core. O contrato de `docs/ADAPTERS.md` (README + mapping.yaml + templates/ + script de instalação quando suportado) era cumprido pelos suportados; o claude-code passou a cumpri-lo integralmente com a fatia autorizada.

Inconsistência encontrada (corrigida na fatia): `docs/IDE_COMPATIBILITY.md` não mencionava Claude Code, embora `agentos.yaml` o listasse em `adapters.available` e `docs/ADAPTERS.md` o descrevesse.

## 9. Avaliação da documentação

Correta e alinhada ao código:
- `docs/ARCHITECTURE.md` (canônico, consistente com o disco), `docs/SPECPILOT_ENGINE.md`, `docs/ADAPTERS.md`, `docs/GOALS.md`, `docs/SKILLS.md`, `docs/EXTENSIONS.md`, `docs/PACKS.md`, `docs/EVONEXUS_ALIGNMENT.md`, `docs/SPEC.md`, `docs/PLAN.md`, `docs/REVIEW.md` (evidência estruturada por critério/comando/limitação), `README.md`.

Desatualizada ou enganosa:
- `specpilot/validators/README.md`: afirma "no external dependencies", mas os validadores dependem de `yaml` e `ajv` (`scripts/lib/agentos-config.mjs` importa `yaml`); lista só 4 dos 10 validadores existentes. O teste pós-auditoria proibiu essa frase no `README.md` raiz, mas este arquivo escapou.
- `codex-layer/README.md`: nota de sandbox de uma sessão antiga e instrução de instalação via `install-codex-layer.ps1`, enquanto o caminho canônico é `npm run agentos:install-adapter -- codex`.
- `docs/IDE_COMPATIBILITY.md`: omitia Claude Code (corrigido na fatia autorizada).

Material legado que pode confundir agentes futuros:
- Era "control plane": `docs/OPERATING_MODEL.md`, `docs/ORCHESTRATION.md`, `docs/AGENT_ROSTER.md`, `docs/OBSERVABILITY.md`, `docs/QUALITY.md`, `docs/SECURITY.md` (duplicando o `SECURITY.md` raiz com propósito diferente), `docs/DECISIONS/0001-agentos-control-plane.md`, `docs/MIGRATION_MAP.md`, `docs/EXEC_PLANS/`, `docs/PLAYBOOKS/`.
- `docs/PRD_AGENTOS_EVONEXUS_ALIGNMENT.docx`: binário `.docx` num repositório markdown-first — não auditável por diff nem por agentes.
- Duplicidade de nome: `SECURITY.md` (raiz, política de vulnerabilidade) vs `docs/SECURITY.md` (guardrails operacionais). Nomes iguais com conteúdos distintos.

Promessas não implementadas estão, em geral, corretamente marcadas como planejadas (extensions, packs, antigravity) — o repositório é notavelmente honesto nesse ponto.

## 10. Avaliação dos scripts e validação

O que `npm run doctor` comprova: presença das ~110 superfícies obrigatórias, Node >= 22, git disponível, parse válido de `package.json`, `agentos.yaml` (com schema Ajv + chaves únicas) e `.harness/project-state.json`.
O que não comprova: conteúdo correto dos arquivos (só existência), funcionamento dos adaptadores, ausência de segredos.

O que `npm run validate` comprova (cadeia completa): doctor + schemas e semântica de todos os JSONs do harness (descobertos, não hardcoded) + ranges de contexto dentro dos arquivos + consistência de ponteiros de estado + ausência de padrões de segredo (com allowlist de placeholders) + **diff Git real contido no escopo declarado do sprint ativo** + workflows canônicos + contratos de adaptadores + links relativos de markdown + metadados de licença/versão + 38–40 testes de contrato.
O que não comprova: que as evidências registradas nos sprints correspondem a execuções reais; que os scripts PowerShell legados funcionam; qualidade semântica de SPEC/PLAN; segurança do histórico Git (o modo `--history` é opcional e documentadamente conservador).

Robustez e portabilidade: validadores usam `node:` builtins + 2 dependências pinadas; contenção de paths cobre Windows e POSIX (`isForeignAbsolutePath` testa ambos); CI roda em ubuntu e windows.
Fraquezas: (a) doctor sem `node_modules/` morre com stack trace bruto; (b) `scripts/doctor.ps1` é um doctor **divergente** da era anterior (exige `docs/AGENT_ROSTER.md`, `templates/EXEC_PLAN.md`) e é o que `environment-health.yml` executa semanalmente — valida um contrato obsoleto; (c) `validate-adapters.mjs` é regex-based, sujeito a falso negativo se a redação mudar.

## 11. Avaliação de segurança

- Segredos: nenhum encontrado. `.env.example` contém apenas nomes de variáveis com valores vazios e comentários de formato. O scanner (`validate-no-secrets.mjs`) cobre chaves privadas, tokens GitHub/OpenAI/AWS/JWT/Slack/Discord/Telegram/Google, URLs com basic-auth, connection strings e atribuições estruturadas, com redação de valores nos diagnósticos.
- Comandos destrutivos: nenhum `rm -rf`, `Remove-Item -Recurse`, download-e-executa ou similar em `scripts/`, `adapters/` ou `codex-layer/` (grep negativo). O instalador de adaptadores faz backup antes de sobrescrever, nunca deleta.
- Deploy: falha fechado sem `AGENTOS_DEPLOY_COMMAND` e usa `shell: false` no spawn (`scripts/deploy.mjs`).
- CI: `ci.yml` tem `permissions: contents: read`, timeout, concorrência e actions pinadas por SHA imutável. **Porém** `agent-review.yml` e `environment-health.yml` usam `actions/checkout@v4` (tag mutável) — inconsistente com o critério do R1 ("GitHub Actions are pinned by immutable SHA"), ainda que o R1 formalmente só cubra `ci.yml`.
- Prompt injection: as regras e templates são instruções para agentes; o risco maior identificado é o material legado (docs da era control plane e hooks/agents `.toml` do codex-layer) instruir um agente a seguir fluxos obsoletos — mitigado pela ordem de fontes do `AGENTS.md`. O `validate-docs.mjs` não faz varredura de conteúdo injetado; nenhum arquivo com instruções suspeitas foi encontrado.
- Escopo indevido de agentes: bem mitigado — `validate-edit-scope.mjs` compara o diff real com `task.files[]`, rejeita renames não declarados, paths absolutos, travessia e symlinks para fora do root; `agentos.yaml` proíbe diretórios gerados; boundaries do `agentGoal` passam por contenção de path.
- Hooks do codex-layer (`hooks.json`) chamam PowerShell com `-ExecutionPolicy Bypass`: aceitável no contexto (delegam ao scanner Node canônico — coberto por teste), mas são inertes em Linux/macOS, ou seja, o gate de pre-command não existe fora do Windows.

## 12. Inconsistências encontradas

1. `specpilot/validators/README.md` afirma "no external dependencies" e lista só 4 validadores — contradiz `package.json` (`ajv`, `yaml`) e `scripts/`.
2. `docs/IDE_COMPATIBILITY.md` omitia Claude Code enquanto `agentos.yaml` e `docs/ADAPTERS.md` o listavam (corrigido na fatia autorizada).
3. `scripts/doctor.ps1` valida um conjunto de arquivos diferente do `scripts/doctor.mjs` canônico, e é o que `environment-health.yml` roda semanalmente.
4. `codex-layer/README.md` documenta instalação via `install-codex-layer.ps1` e uma limitação de sandbox que não existe mais; o caminho canônico é o instalador Node.
5. `agent-review.yml` e `environment-health.yml` usam actions por tag mutável; `ci.yml` e `deploy.yml` usam SHA pinado.
6. Workflows deprecados compartilham números com canônicos (`04-implement.md` vs `04-solution.md` etc.) — mitigado por marcador, mas propenso a erro de leitura.
7. `SECURITY.md` (raiz) e `docs/SECURITY.md` têm o mesmo nome e propósitos diferentes.
8. ~~O sprint `2026-06-19-agentos-rc-final-hardening.json` declara `docs/superpowers/plans/2026-06-19-agentos-rc-final-hardening.md` como arquivo a criar, mas esse arquivo não existe no repositório.~~ **ERRATA 2026-07-04: achado inválido.** O arquivo existe em `docs/superpowers/plans/`; a varredura inicial da auditoria usou `find -maxdepth 3` e não alcançou a profundidade 4 desse diretório. Nenhuma correção é necessária no sprint histórico. A política de imutabilidade de sprints verificados (Q11) permanece adotada como regra geral.

## 13. Riscos técnicos

- Evidência auto-declarada: o gate de `verified` valida consistência, não veracidade; um agente mal-comportado pode registrar exit codes fictícios que só o CI pegaria se o comando falhar lá.
- Dupla pilha de scripts (Node canônico + PowerShell legado) tende a divergir silenciosamente; o doctor semanal do `environment-health.yml` já valida o contrato errado.
- `validate-adapters.mjs` e `validate-docs.mjs` são regex/lista-based: mudanças legítimas de redação quebram o gate (falso positivo) e reformulações podem escapar (falso negativo).
- O `.codex/config.toml` referencia `model = "gpt-5.4"` — dependência de disponibilidade de modelo externo não validável localmente.
- `npm run validate` depende de `origin/main` para a base do diff; em clones sem remoto o fallback para `HEAD` enfraquece o gate de escopo (documentado como warning).

## 14. Riscos de produto

- O valor do AgentOS depende de agentes realmente lerem e obedecerem a ordem de fontes; o volume de material legado compete pela atenção do agente e dilui o contrato.
- Onboarding hostil: primeiro `npm run doctor` sem `npm ci` termina em stack trace; um adotante casual pode concluir que o projeto está quebrado.
- Governança de release depende de configuração do lado do GitHub (branch protection, reviewer elegível) que o repositório não pode provar localmente — `docs/PLAN.md` (Risks) reconhece isso.
- Único mantenedor (owner-approved merge, `docs/REVIEW.md` Governance): fator de risco de continuidade.

## 15. Dívida técnica

1. Scripts PowerShell legados: `doctor.ps1` (divergente), `validate.ps1`, `review-local.ps1`, `install-codex-layer.ps1`, `bootstrap-project.ps1`, `create-github-repo.ps1`, `adapt-existing-project.ps1`, `deploy.ps1` (este último é wrapper fino legítimo).
2. Docs da era control plane listados na seção 9, mais `docs/PRD_AGENTOS_EVONEXUS_ALIGNMENT.docx` binário.
3. Workflows deprecados com numeração colidente.
4. `codex-layer/hooks/*.ps1` sem equivalente POSIX.
5. `core/skills/data/` vazio (apenas `.gitkeep`) enquanto `docs/SKILLS.md` o lista como domínio.
6. ~~Referência fantasma `docs/superpowers/plans/...` no sprint RC final.~~ (ERRATA 2026-07-04: inválido; ver seção 12.8.)

## 16. Classificação de maturidade

**MVP funcional local, em release candidate para uso interno.**

Justificativa: acima de "MVP documental" porque os gates são executáveis e reais (doctor, validate, 38–40 testes, CI multi-OS, exit codes 0 verificados nesta auditoria); alcança "pronto para uso interno" no fluxo suportado (Codex/generic-ide/Claude Code + SpecPilot local); **não** é beta público nem pronto para uso externo porque: prerelease formal não publicado (`docs/REVIEW.md`), governança dependente de um único mantenedor, material legado confuso para adotantes, extensões/packs apenas documentados, e nenhuma validação de adoção fora do próprio repositório.

## 17. Recomendações priorizadas

P0 — bloqueadores (para fechar o RC):
- Nenhum bloqueador de código novo. O bloqueador declarado permanece: publicar tag/prerelease apenas com CI verde e a política de merge registrada em `docs/REVIEW.md`.

P1 — essenciais:
- Corrigir `specpilot/validators/README.md` (dependências e lista completa de validadores).
- Alinhar `environment-health.yml` para rodar `npm run doctor` canônico em vez de `scripts/doctor.ps1`; pinar `actions/checkout` por SHA em `agent-review.yml` e `environment-health.yml`.
- Atualizar `codex-layer/README.md` removendo a nota de sandbox obsoleta e apontando para o instalador canônico.
- ~~Tratar a referência fantasma `docs/superpowers/plans/...` no sprint RC final.~~ (ERRATA 2026-07-04: inválido; ver seção 12.8.)

P2 — melhorias importantes:
- Mensagem amigável no doctor quando `node_modules/` está ausente ("run npm ci first").
- Consolidar ou arquivar os docs da era control plane sob um diretório `docs/legacy/` com aviso explícito; converter ou remover o `.docx`.
- Remover ou deprecar formalmente os scripts PowerShell duplicados (mantendo apenas wrappers finos como `deploy.ps1`).
- Renomear `docs/SECURITY.md` (ex.: `docs/SECURITY_GUARDRAILS.md`) para eliminar a colisão com o raiz.

P3 — refinamentos:
- Remover os workflows deprecados numerados após um ciclo de compatibilidade.
- Hook de segredos portátil (shim `sh`) para o codex-layer.
- Skill mínima em `core/skills/data/` ou remoção do domínio de `docs/SKILLS.md`.

Futuro — médio/longo horizonte (registrado, não recomendado agora, conforme SPEC/PRD):
- Extensions executáveis (memory, heartbeats, routines, channels, knowledge-db); ativação de packs; adaptador Antigravity funcional; geração de `.claude/agents` e `.claude/skills` (MP-04 além da fatia CLAUDE.md); dashboard, banco, scheduler, runtime remoto; CLI madura e MCP opcional.

## 18. Plano de correção sugerido e fatia implementada

Fatia implementada nesta sessão (autorizada pelo pedido do usuário, registrada como SPEC R9 / PLAN Task 008 / sprint `2026-07-04-claude-code-vscode-compat`):

- Criados: `CLAUDE.md` (raiz), `adapters/claude-code/templates/CLAUDE.md`, `adapters/claude-code/install.sh`, `tests/agentos-claude-code-adapter.test.mjs`, `.harness/sprints/2026-07-04-claude-code-vscode-compat.json`, este relatório.
- Modificados: `adapters/claude-code/README.md` e `mapping.yaml` (status supported, mapeamento real), `scripts/agentos-install-adapter.mjs` (definição `claude-code`), `scripts/validate-adapters.mjs` (checks do claude-code), `scripts/doctor.mjs` (novas superfícies), `docs/SPEC.md` (R9), `docs/PLAN.md` (Task 008), `docs/ARCHITECTURE.md`, `docs/ADAPTERS.md`, `docs/IDE_COMPATIBILITY.md`, `docs/EVONEXUS_ALIGNMENT.md`, `README.md`, `CHANGELOG.md`, `docs/REVIEW.md`, ponteiros do harness.
- Desenho de coexistência: o adaptador instala **apenas** `CLAUDE.md`; nunca toca `.codex/` nem `AGENTS.md`. Teste de regressão instala `codex` e depois `claude-code` no mesmo alvo e verifica que `.codex/config.toml` e `AGENTS.md` permanecem byte-idênticos. `core/` continua sem depender de `.claude/`.
- Verificação: `npm test` (40/40), `npm run doctor`, `npm run validate:adapters` e `npm run validate` — todos exit 0. Evidência por critério registrada no sprint e em `docs/REVIEW.md`.
- Sem commit, push ou deploy, conforme instruído.

Plano de correção para os demais achados: executar P1 como um sprint único de reconciliação documental/CI (arquivos pequenos, verificação por `npm run validate`), depois P2 como sprint de higiene de legado, ambos no padrão da seção 19.

## 19. Tarefas futuras no padrão AgentOS

### Tarefa A — Reconciliar validadores e README do SpecPilot

- agentGoal: `/goal Corrigir specpilot/validators/README.md para listar todos os validadores e declarar as dependências pinadas, verificado por npm run validate.`
- Contexto fechado: `specpilot/validators/README.md` (todo), `package.json` linhas 7–24, `scripts/` (nomes de arquivos apenas).
- Arquivos editáveis: `specpilot/validators/README.md`.
- Critérios de aceite: o README lista os 10 validadores existentes; nenhuma menção a "no external dependencies"; menciona `ajv` e `yaml` pinados.
- Comandos de verificação: `npm run doctor`, `npm run validate:docs`, `npm run validate`.

### Tarefa B — Canonizar o doctor no workflow de saúde e pinar actions

- agentGoal: `/goal Fazer environment-health.yml executar o doctor canônico Node e pinar actions por SHA em agent-review.yml e environment-health.yml, verificado por npm run validate e inspeção dos workflows.`
- Contexto fechado: `.github/workflows/environment-health.yml`, `.github/workflows/agent-review.yml`, `.github/workflows/ci.yml` (referência de SHAs).
- Arquivos editáveis: `.github/workflows/environment-health.yml`, `.github/workflows/agent-review.yml`.
- Critérios de aceite: nenhum uso de tag mutável em `uses:`; o job de saúde executa `npm ci` e `npm run doctor`; `scripts/doctor.ps1` não é mais referenciado por workflow.
- Comandos de verificação: `npm run validate`, `git diff --check`.

### Tarefa C — Atualizar codex-layer/README.md para o caminho canônico

- agentGoal: `/goal Remover a nota de sandbox obsoleta do codex-layer/README.md e documentar a instalação canônica via npm run agentos:install-adapter -- codex, verificado por npm run validate.`
- Contexto fechado: `codex-layer/README.md` (todo), `adapters/codex/README.md` linhas 1–20.
- Arquivos editáveis: `codex-layer/README.md`.
- Critérios de aceite: sem menção a bloqueio de sandbox de sessão; instalação documentada aponta para o instalador Node; `install-codex-layer.ps1` citado apenas como legado, se citado.
- Comandos de verificação: `npm run validate:docs`, `npm test`, `npm run validate`.

### Tarefa D — Arquivar material legado da era control plane

- agentGoal: `/goal Mover os documentos da era control plane para docs/legacy/ com aviso de obsolescência, sem quebrar links nem gates, verificado por npm run validate.`
- Contexto fechado: `docs/INDEX.md` (todo), `scripts/validate-docs.mjs` linhas 1–90, `.github/workflows/agent-review.yml` (dependências de arquivos).
- Arquivos editáveis: `docs/OPERATING_MODEL.md`, `docs/ORCHESTRATION.md`, `docs/AGENT_ROSTER.md`, `docs/OBSERVABILITY.md`, `docs/MIGRATION_MAP.md`, `docs/EXEC_PLANS/*`, `docs/PLAYBOOKS/*`, `docs/DECISIONS/*`, `docs/INDEX.md`, `docs/PRD_AGENTOS_EVONEXUS_ALIGNMENT.docx`, `.github/workflows/agent-review.yml`, `scripts/doctor.ps1`.
- Critérios de aceite: cada documento movido tem banner de legado; `docs/INDEX.md` reflete a nova estrutura; nenhum link relativo quebrado; gates que exigiam os paths antigos foram atualizados.
- Comandos de verificação: `npm run doctor`, `npm run validate:docs`, `npm run validate`.

### Tarefa E — Doctor com diagnóstico de dependências ausentes

- agentGoal: `/goal Fazer scripts/doctor.mjs falhar com mensagem clara mandando rodar npm ci quando as dependências pinadas não estiverem instaladas, verificado por teste de regressão.`
- Contexto fechado: `scripts/doctor.mjs` linhas 1–20, `scripts/lib/agentos-config.mjs` linhas 1–10.
- Arquivos editáveis: `scripts/doctor.mjs`, `tests/agentos-doctor-bootstrap.test.mjs` (novo).
- Critérios de aceite: sem `node_modules/`, o doctor sai com código 1 e mensagem contendo `npm ci`; com dependências instaladas, comportamento inalterado.
- Comandos de verificação: `npm test`, `npm run validate`.

## 20. Conclusão

O AgentOS entrega o que a sua própria documentação promete para o horizonte curto: uma plataforma agentic local, file-first, com motor SPEC-driven explícito e — este é o diferencial real — validação mecânica que fecha o ciclo declaração → diff → evidência. As afirmações de arquitetura são verificáveis e verificadas; os placeholders são honestos; não há segredos nem comandos perigosos. O passivo é quase todo documental: material legado da era anterior e uma pilha PowerShell paralela que precisam ser arquivados antes que confundam os próprios agentes que o sistema orquestra. Com as correções P1/P2 executadas como sprints SpecPilot, o projeto está a uma distância curta de um beta interno sólido. A compatibilidade com Claude Code no VSCode, autorizada neste pedido, foi entregue como fatia mínima e verificada, mantendo o Codex intacto e o core neutro — exatamente como o contrato de arquitetura exige.

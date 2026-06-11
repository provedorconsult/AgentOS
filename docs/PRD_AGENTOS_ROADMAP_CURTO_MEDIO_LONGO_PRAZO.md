# PRD — Roadmap do AgentOS + SpecPilot com Requisitos de Curto, Médio e Longo Prazo

Status: draft
Owner: Provedor Consult
Target repository: `provedorconsult/AgentOS`
Execution agent: Codex
Primary objective: definir os requisitos evolutivos do AgentOS + SpecPilot em curto, médio e longo prazo, incorporando conceitos compatíveis do EvoNexus sem acoplar o núcleo a uma IDE, LLM, dashboard, banco ou ferramenta específica.

---

# 1. Resumo Executivo

O AgentOS deve evoluir de um repositório-base para ambientes agentic em uma **plataforma genérica de engenharia assistida por agentes**, com:

* núcleo universal;
* SpecPilot Engine para SPEC, PLAN, tasks, context capsules e verificação;
* adaptadores por IDE/agente;
* skills markdown-first;
* goals;
* packs por domínio;
* extensões planejadas para memória, rotinas, heartbeats, channels e knowledge base;
* possibilidade futura de dashboard e operação multiagente contínua.

A estratégia de evolução será dividida em três horizontes:

```text
Curto prazo  = fundação estável, genérica e validável
Médio prazo  = automação operacional, memória e adaptadores úteis
Longo prazo  = plataforma completa com dashboard, knowledge base, marketplace e packs avançados
```

---

# 2. Visão do Produto

## 2.1 Visão

Transformar o AgentOS em um sistema operacional de desenvolvimento agentic, capaz de orientar qualquer agente ou IDE a executar projetos de software com disciplina profissional, especificação clara, contexto controlado, verificação objetiva e melhoria contínua.

## 2.2 Posicionamento

```text
AgentOS = plataforma agentic genérica
SpecPilot = motor de execução SPEC-driven
Adapters = compatibilidade com Codex, Claude Code, Antigravity, Cursor e IDEs genéricas
Extensions = automações opcionais
Packs = especializações por domínio
```

## 2.3 Princípio central

O AgentOS deve continuar **file-first, markdown-first, git-friendly, CLI-friendly e IDE-neutral**.

---

# 3. Problema

Projetos desenvolvidos com agentes de IA tendem a falhar por:

1. specs vagas;
2. contexto excessivo;
3. leitura ampla demais do repositório;
4. alterações fora de escopo;
5. falta de critérios de aceite;
6. ausência de evidência objetiva;
7. baixa rastreabilidade;
8. repetição de erros;
9. dependência excessiva de uma IDE ou agente específico;
10. falta de integração entre planejamento, implementação, QA, segurança e deploy.

O AgentOS + SpecPilot resolve a base desse problema, mas precisa evoluir para:

* suportar múltiplos adaptadores;
* organizar agentes por camadas;
* criar catálogo de skills;
* criar modelo de goals;
* adicionar retro e improvement loop;
* criar extensões futuras para memória, rotinas e heartbeats;
* suportar packs por domínio, especialmente engenharia, DevOps, segurança e ISP.

---

# 4. Objetivos

## 4.1 Objetivo Geral

Criar uma plataforma agentic modular, extensível e independente de fornecedor, capaz de guiar agentes no ciclo completo de desenvolvimento de software, da ideia ao deploy, com validação mecânica e melhoria contínua.

## 4.2 Objetivos de Curto Prazo

Criar uma fundação estável:

* núcleo universal;
* SpecPilot Engine incorporado;
* adaptador Codex funcional;
* adaptador genérico funcional;
* skills iniciais;
* goals iniciais;
* documentação;
* validação mecânica;
* doctor script;
* sem banco, dashboard ou serviços externos.

## 4.3 Objetivos de Médio Prazo

Adicionar automação operacional:

* memory markdown-first;
* routines;
* heartbeats;
* adaptador Claude Code funcional;
* adaptador Antigravity;
* GitHub Actions;
* packs por domínio;
* templates por stack;
* integração opcional com MCP;
* CLI mais madura.

## 4.4 Objetivos de Longo Prazo

Transformar em plataforma completa:

* dashboard web;
* knowledge database com embeddings;
* channels Telegram/Discord/GitHub/email;
* marketplace de packs;
* multi-project workspace;
* observabilidade de agentes;
* histórico de decisões;
* execução recorrente;
* packs avançados para ISP, SaaS, DevOps, segurança e produto.

---

# 5. Escopo Geral

## 5.1 Dentro do Escopo

* estrutura modular;
* documentação;
* workflows;
* templates;
* schemas;
* validators;
* adapters;
* skills;
* goals;
* packs;
* extensions planejadas;
* scripts locais;
* validação mecânica;
* compatibilidade com Codex;
* compatibilidade genérica com qualquer IDE.

## 5.2 Fora do Escopo Inicial

No curto prazo, não implementar:

* dashboard;
* banco de dados;
* scheduler real;
* rotinas executáveis reais;
* embeddings;
* MCP obrigatório;
* channels reais;
* servidor web;
* autenticação;
* multiusuário;
* billing;
* marketplace;
* daemon.

---

# 6. Horizontes do Roadmap

## 6.1 Curto Prazo — Fundação AgentOS 2.0

Prazo sugerido: 0 a 30 dias
Objetivo: deixar o AgentOS pronto para uso real em projetos com Codex e qualquer IDE.

### Resultado esperado

Ao final do curto prazo, o repositório deve permitir:

```bash
npm run doctor
npm run validate
npm run agentos:init
npm run agentos:install-adapter -- codex
npm run agentos:install-adapter -- generic-ide
```

E deve possuir:

* core neutro;
* SpecPilot Engine;
* `.harness/`;
* templates;
* validadores;
* skills iniciais;
* goals iniciais;
* adaptadores Codex e Generic IDE;
* placeholders documentados para extensões futuras.

---

## 6.2 Médio Prazo — Operação Agentic Assistida

Prazo sugerido: 30 a 90 dias
Objetivo: evoluir AgentOS para automação recorrente, memória operacional, adaptadores adicionais e packs úteis.

### Resultado esperado

Ao final do médio prazo, o AgentOS deve suportar:

* memória markdown-first;
* rotinas executáveis simples;
* heartbeats locais;
* GitHub Actions;
* adaptador Claude Code funcional;
* adaptador Antigravity funcional;
* pack ISP inicial;
* pack DevOps inicial;
* pack Security inicial;
* templates por stack;
* CLI mais usável.

---

## 6.3 Longo Prazo — Plataforma AgentOS

Prazo sugerido: 90 a 180+ dias
Objetivo: transformar AgentOS em plataforma completa para múltiplos projetos, agentes, domínios e equipes.

### Resultado esperado

Ao final do longo prazo, o AgentOS poderá ter:

* dashboard web;
* knowledge database;
* busca semântica;
* channels;
* multi-project workspace;
* observabilidade de agentes;
* marketplace de packs;
* integração com servidores remotos;
* automação contínua;
* governança de agentes;
* suporte a times.

---

# 7. Requisitos de Curto Prazo

## CP-01 — Núcleo universal

### Descrição

Criar ou consolidar estrutura universal independente de IDE.

### Estrutura esperada

```text
core/
├── agents/
├── workflows/
├── rules/
├── skills/
├── goals/
└── schemas/
```

### Critérios de aceite

* `core/` existe;
* não depende de `.codex/`;
* não depende de `.claude/`;
* não contém configuração específica de fornecedor;
* README explica função do core.

---

## CP-02 — SpecPilot Engine

### Descrição

Incorporar o SpecPilot como motor interno de SPEC-driven development.

### Estrutura esperada

```text
specpilot/
├── README.md
├── templates/
├── validators/
└── harness/
```

### Artefatos obrigatórios

* `docs/SPEC.template.md`
* `docs/PLAN.template.md`
* `docs/TASK.template.md`
* `docs/REVIEW.template.md`
* `.harness/templates/task.json`
* `.harness/templates/sprint.json`
* `.harness/templates/project-state.json`

### Critérios de aceite

* templates existem;
* task usa `agentGoal`, não `codexGoal`;
* context capsule é documentado;
* validação mecânica funciona.

---

## CP-03 — Validadores locais

### Descrição

Criar scripts sem dependências externas para validar estrutura, tasks, ranges e secrets.

### Scripts obrigatórios

```text
scripts/
├── doctor.mjs
├── validate-sprint-json.mjs
├── validate-context-ranges.mjs
└── validate-no-secrets.mjs
```

### Critérios de aceite

* `npm run doctor` passa;
* `npm run validate` passa;
* `validate-sprint-json` valida task e sprint;
* `validate-context-ranges` rejeita ranges maiores que 120 linhas;
* `validate-no-secrets` bloqueia tokens, chaves e `.env` real.

---

## CP-04 — Adaptador Codex

### Descrição

Transformar Codex em adaptador, não em fundação.

### Estrutura

```text
adapters/codex/
├── README.md
├── mapping.yaml
├── install.sh
├── install.ps1
└── templates/
```

### Critérios de aceite

* gera `.codex/` quando solicitado;
* não exige `.codex/` no core;
* preserva compatibilidade com `AGENTS.md`;
* tem instrução clara de instalação.

---

## CP-05 — Adaptador Generic IDE

### Descrição

Permitir uso em qualquer IDE sem recursos nativos específicos.

### Estrutura

```text
adapters/generic-ide/
├── README.md
├── mapping.yaml
├── install.sh
└── templates/
    ├── AGENTS.md
    └── IDE_AGENT_GUIDE.md
```

### Critérios de aceite

* não cria `.codex/`;
* não cria `.claude/`;
* funciona como documentação operacional;
* explica como o agente deve ler SPEC, PLAN, TASK e REVIEW.

---

## CP-06 — Skills iniciais

### Descrição

Criar catálogo inicial de skills markdown-first.

### Estrutura

```text
core/skills/
├── README.md
├── dev/
├── security/
├── product/
├── ops/
├── data/
└── docs/
```

### Skills mínimas

```text
core/skills/dev/dev-spec-writing.md
core/skills/dev/dev-context-capsule.md
core/skills/dev/dev-code-review.md
core/skills/security/sec-secret-scan.md
core/skills/product/prod-prd-to-spec.md
core/skills/ops/ops-retro-capture.md
core/skills/docs/docs-handoff.md
```

### Critérios de aceite

* pelo menos 7 skills existem;
* todas usam formato padrão;
* nenhuma depende de IDE específica;
* README explica como criar novas skills.

---

## CP-07 — Goals iniciais

### Descrição

Criar modelo de goals acima das tasks.

### Estrutura

```text
core/goals/
├── README.md
├── goal.schema.json
├── mission.template.md
├── project-goal.template.md
└── goal.template.md
```

### Hierarquia

```text
Mission → Project → Goal → SPEC → PLAN → Sprint → Task → Evidence
```

### Critérios de aceite

* schema existe;
* templates existem;
* documentação explica goal vs task;
* goals complementam SpecPilot, não substituem tasks.

---

## CP-08 — Workflows completos

### Descrição

Criar workflows universais de execução.

### Workflows mínimos

```text
core/workflows/
├── 01-discover.md
├── 02-spec.md
├── 03-plan.md
├── 04-solution.md
├── 05-implement.md
├── 06-verify.md
├── 07-review.md
├── 08-release.md
├── 09-deploy.md
└── 10-retro.md
```

### Critérios de aceite

* todos os workflows existem;
* `04-solution` impede implementação prematura;
* `06-verify` exige evidência;
* `10-retro` captura melhoria contínua.

---

## CP-09 — Documentação base

### Documentos obrigatórios

```text
docs/
├── ARCHITECTURE.md
├── ADAPTERS.md
├── IDE_COMPATIBILITY.md
├── SPECPILOT_ENGINE.md
├── GOALS.md
├── SKILLS.md
├── EXTENSIONS.md
├── PACKS.md
└── EVONEXUS_ALIGNMENT.md
```

### Critérios de aceite

* documentos existem;
* não prometem funcionalidades não implementadas;
* explicam core/adapters/extensions/packs;
* orientam o Codex a executar corretamente.

---

## CP-10 — Placeholders honestos de extensões

### Estrutura

```text
extensions/
├── README.md
├── memory/
├── heartbeats/
├── routines/
├── channels/
└── knowledge-db/
```

### Critérios de aceite

* cada extensão tem README;
* status é `planned` ou `experimental`;
* não há código pesado;
* não há dependências externas.

---

# 8. Requisitos de Médio Prazo

## MP-01 — Memory markdown-first

### Descrição

Criar memória persistente baseada em arquivos markdown.

### Estrutura esperada

```text
memory/
├── README.md
├── projects/
├── decisions/
├── lessons/
├── agents/
└── glossary.md
```

### Requisitos

* registrar decisões;
* registrar lições;
* registrar padrões recorrentes;
* permitir consulta por agentes via arquivos;
* sem banco de dados.

### Critérios de aceite

* memory pode ser versionada no Git;
* retro consegue gravar lessons;
* docs explicam política de memória.

---

## MP-02 — Rotinas locais simples

### Descrição

Criar rotina local executável por script, sem daemon.

### Exemplos

```text
daily-project-health
weekly-retro-review
validate-agentos-structure
stale-task-check
missing-evidence-check
```

### Estrutura

```text
extensions/routines/
├── README.md
├── routines.json
├── templates/
└── scripts/
```

### Critérios de aceite

* rotinas podem ser executadas manualmente;
* não há scheduler obrigatório;
* resultados são gravados em markdown ou JSONL;
* falhas são auditáveis.

---

## MP-03 — Heartbeats locais

### Descrição

Criar verificações proativas locais.

### Exemplos

* task parada;
* sprint sem evidência;
* SPEC desatualizada;
* README divergente;
* validação quebrada;
* secrets detectados.

### Estrutura

```text
extensions/heartbeats/
├── README.md
├── heartbeat.schema.json
├── checks/
└── reports/
```

### Critérios de aceite

* heartbeats executam localmente;
* retornam JSON objetivo;
* suportam `action: skip` e `action: work`;
* não executam mudanças destrutivas.

---

## MP-04 — Adaptador Claude Code funcional

### Descrição

Evoluir placeholder para adaptador funcional.

### Geração esperada

```text
.claude/
├── agents/
├── skills/
└── commands/
CLAUDE.md
```

### Critérios de aceite

* core continua sem depender de `.claude/`;
* adaptador gera estrutura opcional;
* mapping é documentado;
* instalação cria backup se destino existir.

---

## MP-05 — Adaptador Antigravity funcional

### Descrição

Criar adaptador para uso com Antigravity.

### Critérios de aceite

* README próprio;
* mapping próprio;
* templates próprios;
* não altera core;
* uso documentado.

---

## MP-06 — GitHub Actions

### Descrição

Adicionar validação automática no repositório.

### Workflow esperado

```text
.github/workflows/validate.yml
```

### Comandos

```bash
npm run doctor
npm run validate
npm run validate:secrets
```

### Critérios de aceite

* action roda em pull request;
* falha se houver secret;
* falha se estrutura obrigatória estiver ausente;
* não exige dependências externas.

---

## MP-07 — Packs iniciais

### Packs prioritários

```text
packs/engineering/
packs/security/
packs/devops/
packs/isp/
```

### Pack ISP

Deve incluir agentes e skills planejados para:

* Mikrotik;
* BGP;
* CGNAT;
* PPPoE;
* Radius;
* Zabbix;
* OLTs;
* IPv6;
* relatórios técnicos.

### Critérios de aceite

* cada pack tem README;
* pelo menos 3 skills por pack prioritário;
* pack ISP tem documentação mais detalhada;
* packs são opcionais.

---

## MP-08 — Templates por stack

### Stacks prioritárias

```text
templates/stacks/
├── go-postgres/
├── node-fullstack/
├── python-fastapi/
├── debian-docker/
└── isp-automation/
```

### Critérios de aceite

* cada stack tem SPEC parcial;
* PLAN parcial;
* comandos de validação;
* quality gates;
* docs de uso.

---

## MP-09 — CLI AgentOS mais madura

### Descrição

Melhorar scripts para interface CLI local.

### Comandos desejados

```bash
node scripts/agentos.mjs init
node scripts/agentos.mjs doctor
node scripts/agentos.mjs validate
node scripts/agentos.mjs install-adapter codex
node scripts/agentos.mjs create-goal
node scripts/agentos.mjs create-sprint
node scripts/agentos.mjs retro
```

### Critérios de aceite

* CLI centraliza scripts;
* mantém compatibilidade com npm scripts;
* sem dependências externas;
* documentação atualizada.

---

# 9. Requisitos de Longo Prazo

## LP-01 — Dashboard web

### Descrição

Criar painel visual para AgentOS.

### Funcionalidades desejadas

* listar projetos;
* listar goals;
* listar sprints;
* listar tasks;
* visualizar evidências;
* acompanhar validações;
* visualizar rotinas;
* visualizar heartbeats;
* visualizar agentes e skills.

### Critérios de aceite

* dashboard é app separado;
* core continua funcionando sem dashboard;
* autenticação básica;
* logs auditáveis.

---

## LP-02 — Knowledge database

### Descrição

Criar base de conhecimento com busca semântica.

### Componentes possíveis

* PostgreSQL;
* pgvector;
* ingest de markdown;
* chunking;
* embeddings;
* query CLI;
* query via dashboard.

### Critérios de aceite

* extensão opcional;
* não exigida no core;
* pode indexar docs, memory e reviews;
* tem política de privacidade e exclusão.

---

## LP-03 — Channels

### Descrição

Permitir interação externa com AgentOS.

### Canais possíveis

* Telegram;
* Discord;
* GitHub Issues;
* email;
* webhook;
* WhatsApp via gateway próprio.

### Critérios de aceite

* cada channel é extensão separada;
* autenticação documentada;
* logs auditáveis;
* não executa ações destrutivas sem confirmação.

---

## LP-04 — Multi-project workspace

### Descrição

Permitir gerenciar múltiplos projetos AgentOS.

### Estrutura possível

```text
workspace/
├── projects/
├── shared-skills/
├── shared-memory/
├── shared-packs/
└── reports/
```

### Critérios de aceite

* projetos isolados;
* skills compartilháveis;
* memory separável;
* reports consolidados.

---

## LP-05 — Marketplace de packs

### Descrição

Criar forma padronizada de distribuir packs.

### Packs possíveis

* ISP;
* SaaS;
* DevOps;
* Security;
* Marketing;
* CRM;
* FTTH;
* Zabbix;
* Mikrotik;
* WhatsApp gateways;
* Debian/Dokploy.

### Critérios de aceite

* pack tem manifesto;
* pack tem versionamento;
* pack tem docs;
* pack tem validação;
* pack pode ser instalado ou removido.

---

## LP-06 — Observabilidade de agentes

### Descrição

Criar métricas sobre uso de agentes, skills, tasks e validações.

### Métricas possíveis

* tasks concluídas;
* tasks bloqueadas;
* validações com falha;
* tempo por task;
* skills usadas;
* erros recorrentes;
* arquivos mais alterados;
* gaps de documentação.

### Critérios de aceite

* métricas auditáveis;
* sem expor secrets;
* exportável para JSON/CSV;
* dashboard opcional.

---

## LP-07 — Runtime remoto opcional

### Descrição

Permitir AgentOS operar em VPS/servidor central para orquestrar projetos.

### Possíveis componentes

* API;
* worker;
* queue;
* storage;
* auth;
* logs;
* dashboard;
* webhooks;
* channels.

### Critérios de aceite

* runtime é opcional;
* core local continua funcional;
* deploy documentado;
* segurança e rollback definidos.

---

# 10. Priorização Geral

## P0 — Obrigatório no curto prazo

* core universal;
* SpecPilot Engine;
* `.harness/`;
* validators;
* doctor;
* Codex adapter;
* Generic IDE adapter;
* README;
* arquitetura;
* no-secrets.

## P1 — Alta prioridade

* skills;
* goals;
* workflows solution/retro;
* docs de extensions;
* docs de packs;
* pack ISP placeholder;
* agentos.yaml atualizado.

## P2 — Médio prazo

* memory markdown-first;
* routines locais;
* heartbeats locais;
* Claude Code adapter;
* Antigravity adapter;
* GitHub Actions;
* stack templates;
* CLI unificada.

## P3 — Longo prazo

* dashboard;
* knowledge database;
* channels;
* marketplace;
* workspace multi-project;
* runtime remoto.

---

# 11. Métricas de Sucesso

## Curto prazo

* `npm run doctor` passa;
* `npm run validate` passa;
* 0 secrets detectados;
* pelo menos 7 skills;
* pelo menos 10 workflows;
* 2 adaptadores funcionais: Codex e Generic IDE;
* documentação base completa.

## Médio prazo

* pelo menos 3 adaptadores funcionais;
* pelo menos 4 packs úteis;
* pelo menos 5 rotinas locais;
* pelo menos 5 heartbeats locais;
* GitHub Actions ativo;
* memory markdown-first usada por retro.

## Longo prazo

* dashboard utilizável;
* knowledge database opcional;
* marketplace de packs;
* channels funcionais;
* runtime remoto opcional;
* múltiplos projetos gerenciáveis.

---

# 12. Riscos

## Risco 1 — Escopo crescer demais

Mitigação:

* core mínimo;
* extensões opcionais;
* long prazo separado;
* não implementar dashboard no curto prazo.

## Risco 2 — Acoplamento a Codex ou Claude Code

Mitigação:

* core neutro;
* adaptadores isolados;
* validação por grep;
* documentação clara.

## Risco 3 — Complexidade excessiva para uso simples

Mitigação:

* Generic IDE adapter;
* quickstart simples;
* `agentos:init`;
* templates claros.

## Risco 4 — Skills virarem documentação morta

Mitigação:

* skills referenciadas em workflows;
* retro atualiza skills;
* doctor verifica estrutura.

## Risco 5 — Memory/heartbeats criarem ruído

Mitigação:

* médio prazo apenas;
* resultados auditáveis;
* `action: skip`;
* sem mudanças destrutivas.

---

# 13. Backlog Macro

## Curto Prazo

```text
CP-01 Criar core universal
CP-02 Incorporar SpecPilot Engine
CP-03 Criar .harness
CP-04 Criar validators
CP-05 Criar doctor
CP-06 Criar Codex adapter
CP-07 Criar Generic IDE adapter
CP-08 Criar skills iniciais
CP-09 Criar goals iniciais
CP-10 Criar workflows solution/retro
CP-11 Criar docs base
CP-12 Criar placeholders extensions/packs
CP-13 Atualizar README
CP-14 Atualizar agentos.yaml
CP-15 Registrar evidence em REVIEW
```

## Médio Prazo

```text
MP-01 Implementar memory markdown-first
MP-02 Implementar routines locais
MP-03 Implementar heartbeats locais
MP-04 Implementar Claude Code adapter
MP-05 Implementar Antigravity adapter
MP-06 Criar GitHub Actions
MP-07 Criar pack ISP inicial
MP-08 Criar packs Engineering/Security/DevOps
MP-09 Criar templates por stack
MP-10 Unificar CLI agentos.mjs
```

## Longo Prazo

```text
LP-01 Criar dashboard web
LP-02 Criar knowledge database
LP-03 Criar channels
LP-04 Criar workspace multi-project
LP-05 Criar marketplace de packs
LP-06 Criar observabilidade de agentes
LP-07 Criar runtime remoto opcional
```

---

# 14. Definition of Done por Horizonte

## Curto Prazo concluído quando

```bash
npm run doctor
npm run validate
```

passarem, e o AgentOS puder ser usado em um novo projeto com:

```bash
npm run agentos:init
npm run agentos:install-adapter -- codex
```

ou:

```bash
npm run agentos:install-adapter -- generic-ide
```

## Médio Prazo concluído quando

* memory funciona em markdown;
* rotinas locais executam;
* heartbeats geram reports;
* Claude Code e Antigravity possuem adapters funcionais;
* GitHub Actions valida o repositório;
* pack ISP tem primeiras skills operacionais.

## Longo Prazo concluído quando

* dashboard opera;
* knowledge-db é opcional e funcional;
* channels funcionam;
* packs podem ser instalados;
* múltiplos projetos podem ser gerenciados;
* runtime remoto é possível sem quebrar o modo local.

---

# 15. Prompt para o Codex

Use este prompt dentro do repositório `provedorconsult/AgentOS`:

```text
Leia docs/PRD_AGENTOS_ROADMAP_CURTO_MEDIO_LONGO_PRAZO.md e implemente apenas o horizonte de curto prazo.

Regras obrigatórias:
- Não implemente médio ou longo prazo agora.
- Crie apenas placeholders honestos para extensions e packs.
- AgentOS deve continuar sendo a plataforma principal.
- SpecPilot deve continuar sendo o motor SPEC-driven.
- Codex deve ser adaptador, não core.
- Generic IDE deve funcionar sem .codex.
- Claude Code deve permanecer placeholder ou adaptador futuro.
- Não adicionar banco, dashboard, scheduler, channels ou runtime remoto.
- Não adicionar dependências externas.
- Não apagar arquivos sem justificar.
- Não sobrescrever arquivos existentes sem backup.
- Use agentGoal, não codexGoal.
- Registre evidência em docs/REVIEW.md.
- Execute npm run doctor e npm run validate ao final.

Ao finalizar, entregue:
- arquivos criados;
- arquivos alterados;
- comandos executados;
- exit codes;
- riscos restantes;
- próximos passos para médio prazo.
```

---

# 16. Conclusão

Este PRD define uma evolução controlada do AgentOS + SpecPilot em três horizontes.

A recomendação principal é:

```text
Curto prazo: fundação genérica e validável
Médio prazo: automação local e adaptadores adicionais
Longo prazo: plataforma completa com dashboard, knowledge base, channels e marketplace
```

O Codex deve implementar primeiro apenas o curto prazo. O médio e longo prazo ficam documentados como direção estratégica para evitar decisões apressadas e crescimento descontrolado do escopo.

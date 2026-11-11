# Coordenação PR #20/#21 e governança — 2026-11-11

Estado Maker: validação local concluída; READY_FOR_CHECKER_REAUDIT condicionado à conferência do CI do novo SHA no handoff externo. Não é aprovação. PR #21 Draft; Hermes F1 BLOQUEADA.

## Identidade e fontes

Base main: `e2eedcc6249e08c389aef6282bcb13ae40d2f76a`. HEAD inicial #21: `a89440920fe8382ceff21807df6a9e06f67173cd`. HEAD #20: `9b30bec1ec72d861c984dda1e24e5e80adafa4e6`. O HEAD final e os links dos jobs são publicados no comentário de handoff, pois o hash do próprio commit não pode estar no arquivo que ele inclui. EVIDENCE.json e FALLBACK_EVIDENCE.json anteriores são registros de suas execuções, não prova do novo HEAD.

Diffs completos obtidos pela conexão GitHub (31 caminhos #21; 11 #20), confrontados com objetos Git locais. Consultas administrativas somente GET e dentro das permissões existentes. [Evidência estruturada](COORDINATION_EVIDENCE.json) registra URLs, campos selecionados, erros, comparação e validação. Não contém segredos, lista de alertas, tokens, conteúdo de environment ou dados de credenciais.

## Coordenação reproduzível

`package.json` e `package-lock.json` são idênticos byte a byte entre os dois HEADs. Blob Git do lockfile em ambos: `f327ca0912cfbbe31f6d542f863501a42f5881a3`. Única alteração no grafo contra a base: fast-uri 3.1.2 para 3.1.9 dentro da faixa existente de Ajv; resolved/integrity também idênticos. Pins diretos preservados; nenhuma nova dependência ou regeneração do lockfile.

```bash
git diff --exit-code 9b30bec1ec72d861c984dda1e24e5e80adafa4e6 a89440920fe8382ceff21807df6a9e06f67173cd -- package.json package-lock.json
git rev-parse 9b30bec1ec72d861c984dda1e24e5e80adafa4e6:package-lock.json a89440920fe8382ceff21807df6a9e06f67173cd:package-lock.json
git diff e2eedcc6249e08c389aef6282bcb13ae40d2f76a 9b30bec1ec72d861c984dda1e24e5e80adafa4e6
git diff e2eedcc6249e08c389aef6282bcb13ae40d2f76a a89440920fe8382ceff21807df6a9e06f67173cd
git merge-tree --write-tree a89440920fe8382ceff21807df6a9e06f67173cd 9b30bec1ec72d861c984dda1e24e5e80adafa4e6
```

A última instrução apenas calcula uma árvore de simulação, não move branches nem cria commit de merge. Retornou 1 com cinco conflitos: .harness/current.txt, .harness/project-state.json, CHANGELOG.md, docs/PLAN.md e docs/REVIEW.md. Não existe conflito de dependência. Portanto a ordem de aplicação ingênua das PRs não é suficiente.

Estratégia adotada: consolidar o conteúdo legítimo de #20 em #21 em um commit normal descendente do HEAD inicial. Preservados byte a byte os quatro arquivos novos de #20 (sprint bloqueada, relatório técnico, audit-before e audit-after). Preservadas suas adições em CHANGELOG/PLAN/REVIEW/RELEASE, com rótulo histórico explícito e este readback corrente. Não apagar os registros de protected=false ou NOT_RUN originais, nem tratá-los como atuais. Mantidos os ponteiros de #21 para a sprint pública e o lastVerifiedSprint anterior; a sprint F0-AUD-003 permanece bloqueada. Isso resolve a disputa entre dois ponteiros singulares sem marcar nenhuma sprint aprovada. Scanner/workflows/testes de #21 permanecem intactos.

Combinação final = árvore de #21 + quatro novos arquivos originais de #20 + adições documentais preservadas de #20 + estas evidências e declarações de escopo. Suíte e checks executam sobre essa combinação real, não apenas em cada PR isolada. Nenhuma branch remota de #20 foi alterada, fechada ou mergeada. Proposta para o Checker/proprietário: revisar a consolidação em #21 e, somente após sua decisão, encerrar #20 como substituída sem integrar seu commit. Não aplicar #20 depois de #21 sem reconciliar ponteiros e documentação novamente. Se algum HEAD/base mudar, a comparação e CI precisam ser refeitos. A aceitação dessa estratégia continua sendo gate de integração.

## Inventário de controles e limitações

CONFIRMED = campo/configuração observado; NOT CONFIGURED = controle explicitamente ausente/desligado no escopo observado; UNKNOWN = resposta incompleta; NOT ACCESSIBLE = endpoint recusado. Nenhum deles implica teste destrutivo de enforcement. Owner é do tipo User: controles organizacionais não são inferidos nem consultados como se este fosse um repositório de organização.

| Controle | Estado | Resultado e fonte de consulta | Pendência |
|---|---|---|---|
| Visibilidade/identidade | CONFIRMED | GET /repos/provedorconsult/AgentOS: public; owner User; main no SHA base | Sem mudança de visibilidade |
| Permissões desta integração | CONFIRMED | repo.permissions: pull/push/triage true, admin/maintain false | Não representa outros atores |
| Rulesets visíveis/incluídos dos pais | CONFIRMED | GET /rulesets?includes_parents=true&per_page=100&page=1: um ruleset 27031355 Repository, active | Lista visível não revela permissões de todos os atores |
| Escopo de 27031355 | CONFIRMED | GET /rulesets/27031355, com e sem includes_parents: somente refs/heads/main; excludes vazio | Não protege automaticamente outras branches |
| main protegida | CONFIRMED | GET /branches/main: protected=true | Resumo legado enabled=false/checks off não anula ruleset ativo; camadas diferentes |
| Proteção clássica detalhada | NOT ACCESSIBLE | GET /branches/main/protection: 403 Resource not accessible by integration | Admin ler enforce_admins, restrictions e bypass_pull_request_allowances, se configurados |
| Checks strict | CONFIRMED | ruleset: validate (ubuntu-latest), validate (windows-latest), strict true | integration_id omitido; vínculo a app específico UNKNOWN |
| PR/conversas/force push/deletion | CONFIRMED | pull_request, required_review_thread_resolution=true, non_fast_forward e deletion | Sem tentativa de mutação/bypass |
| Aprovação humana mínima no ruleset | NOT CONFIGURED | required_approving_review_count=0; required_reviewers=[] | Não alegar revisão humana obrigatória; política global ainda UNKNOWN |
| Code owner/último push/stale review | NOT CONFIGURED | require_code_owner_review=false, require_last_push_approval=false, dismiss_stale_reviews_on_push=false | Owner definir política e elegibilidade; sem mudar nesta tarefa |
| Bypass desta integração | CONFIRMED | current_user_can_bypass=never | Apenas identidade da conexão, não todos os atores |
| Bypass global/atores/papéis/apps | UNKNOWN | bypass_actors omitido nas duas consultas de detalhe | Admin obter IDs/tipos/modos de cada ator, ou lista vazia explícita, e cruzar com proteção clássica |
| Rules efetivas por branch | NOT ACCESSIBLE | GET /rules/branches/main recusado pelo conector com 400 | Não confundir recusa local com API GitHub desabilitada |
| Actions habilitação/ações permitidas | NOT ACCESSIBLE | GET /actions/permissions e /selected-actions: 400 do conector | Admin confirmar configuração em Settings/Actions |
| Token padrão/aprovação de PR por Actions/forks | NOT ACCESSIBLE | GET /actions/permissions/workflow: 400 do conector | Admin ler default_workflow_permissions, can_approve_pull_request_reviews e aprovação de forks; não confundir permissions versionadas com default administrativo |
| Deploy environments/reviewers/bypass | NOT ACCESSIBLE | GET /environments: 400 do conector; YAML usa input dinâmico | Admin inventariar nomes, protection_rules, prevent_self_review, can_admins_bypass, deployment_branch_policy; nenhum deploy executado |
| Secret scanning/push protection/advanced security | UNKNOWN | security_and_analysis omitido no repo | Admin readback com capacidade adequada; não inferir licença/plano |
| Endpoint de secret scanning | NOT ACCESSIBLE | Consulta de alerts recusada pelo conector antes da API (400); nenhum alerta/valor lido | Verificar habilitação pela configuração; não publicar conteúdo de alertas |
| Code scanning default setup | NOT ACCESSIBLE | GET /code-scanning/default-setup: 400 do conector | Sem workflow dedicado no HEAD não prova feature desabilitada |
| Dependabot vulnerability alerts | NOT ACCESSIBLE | GET /vulnerability-alerts: 400 do conector | dependabot.yml comprova somente atualização agendada no código |
| Private vulnerability reporting | NOT ACCESSIBLE | GET /private-vulnerability-reporting: 400 do conector | Confirmar canal privado antes de informação confidencial |
| Auto merge | NOT CONFIGURED | repo.allow_auto_merge=false | Não é garantia contra merge manual |
| Plano/licença e enforcement real completo | UNKNOWN | Campos insuficientes; não foi tentado bypass/push em main | Avaliação administrativa independente, sem teste destrutivo |

Referências oficiais para reprodução por administrador autorizado: [Rulesets GET e bypass_actors](https://docs.github.com/en/rest/repos/rules#get-a-repository-ruleset), [Branch protection GET](https://docs.github.com/en/rest/branches/branch-protection#get-branch-protection), [Actions permissions](https://docs.github.com/en/rest/actions/permissions), [Environments](https://docs.github.com/en/rest/deployments/environments), [Repository metadata/security_and_analysis](https://docs.github.com/en/rest/repos/repos#get-a-repository), [Code scanning](https://docs.github.com/en/rest/code-scanning/code-scanning#get-a-code-scanning-default-setup-configuration), [Vulnerability alerts/reporting](https://docs.github.com/en/rest/repos/repos).

### Atores e mecanismos de bypass

| Ator/mecanismo | Escopo/permissão efetiva comprovada | Limite |
|---|---|---|
| Integração desta sessão | pull/push/triage; admin/maintain false; bypass never para 27031355 | Sem bypass comprovado apenas para esta conexão |
| Proprietário e colaboradores | Conta proprietária identificada como User; matriz de permissões dos demais atores não disponível | Não atribuir bypass ou ausência dele ao proprietário/colaboradores sem readback |
| Atores configurados em ruleset (papéis, apps, deploy keys e demais tipos suportados) | Lista não retornada | IDs, tipos, modos always/pull_request e escopos UNKNOWN; administrador precisa enumerar |
| Bypass clássico (admins/apps/usuários/equipes, se aplicável) | Proteção detalhada 403 | enforce_admins/restrictions/bypass allowances NOT ACCESSIBLE; não presumir vazio |
| Poder administrativo de editar/desativar regras | Esta integração não tem admin | Capacidade dos demais atores UNKNOWN; diferente de bypass de uma regra ativa |

## Ação humana pendente, sem autorização administrativa implícita

Solicitar a administrador autorizado readback sanitizado e datado das superfícies acima. Para bypass: lista completa explícita, actor_id/actor_type/bypass_mode, papéis efetivos e escopo de cada regra; verificar também proteção clássica e privilégios de alteração das regras. Ausência de bypass_actors no conector não pode ser convertida em lista vazia. Segredos, tokens e conteúdo de alertas não devem integrar a evidência pública.

Aprovação humana: escolher explicitamente reviewer elegível e política de main (mínimo de aprovações, stale reviews, último push, code owners e exceções). Se for necessário alterar a configuração, requerer autorização humana específica para a proposta concreta e readback independente após a mudança. A contagem zero não satisfaz uma exigência de aprovação humana técnica. Não foi solicitado/aplicado write administrativo nesta entrega; revisão e autorização são gates distintos do sucesso do CI.

## Verificação e entrega

Local: 66/66 testes completos e 17/17 de segurança pública, zero falhas/skip; audit zero vulnerabilidades; Gitleaks e scanner sem alertas. Comandos e exit codes da combinação final constam em COORDINATION_EVIDENCE.json; logs brutos locais ficam fora do Git, sem publicação de valores. Testes completos incluem as cinco regressões de fallback da correção validada; scanner e testes não foram alterados nesta rodada. Executar CI Linux/Windows no SHA final e conferir jobs/pass/fail/skip; não reutilizar o CI de a894409 como prova do novo commit. Histórico limitado às refs locais; CI e mirror podem ter contagens distintas. A ausência de alertas não prova ausência global de segredos.

Arquivos desta rodada: sprint pública; quatro arquivos preservados de #20; CHANGELOG; SPEC/PLAN/REVIEW/RELEASE; CHECKER_HANDOFF; FALLBACK_REMEDIATION; SECURITY_POSTURE; este relatório e COORDINATION_EVIDENCE.json. Lista exata também no diff da rodada e no handoff externo com SHA final. Nenhum código executável, lockfile ou workflow alterado nesta rodada.

Próximo gate: reauditoria independente do SHA final e aceitação da coordenação pelo Checker; readback/decisões administrativas humanas permanecem necessários antes de integração. READY_FOR_CHECKER_REAUDIT não significa APPROVED, MERGEABLE, RELEASE_READY ou DEPLOY_READY. Sem merge, retirada de Draft, autoaprovação, release, deploy, SSH ou alteração de outro repositório.

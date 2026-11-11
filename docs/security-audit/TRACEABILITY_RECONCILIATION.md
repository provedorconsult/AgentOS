# Reconciliação de rastreabilidade — PR #21

Data: 2026-11-11. HEAD inicial: `668254b435cf46e1cc5cbc8346bad59db7ce7fcb`. Base: `e2eedcc6249e08c389aef6282bcb13ae40d2f76a`. Review do Checker: [5861522382, REQUEST_CHANGES](https://github.com/provedorconsult/AgentOS/pull/21#pullrequestreview-5861522382). Correções técnicas do scanner e bloqueio do Deploy validadas nas evidências; sem sign-off global.

## Problema e correção

Os comentários continham decisões e resultados que não haviam sido incorporados aos arquivos: ci continuava como pendente e documentos diziam que a estratégia/mínimo de aprovação ainda não tinham decisão. Esta rodada preenche os resultados conhecidos e vincula cada execução ao seu SHA; atualiza handoff, postura, coordenação, release e review para distinguir decisão humana, aplicação e enforcement. Nenhum código, workflow, lockfile, teste ou contrato operacional é alterado.

## CI confirmado, por commit executado

| SHA | AgentOS CI | Checklist | Testes por plataforma | Histórico no checkout CI |
|---|---|---|---|---|
| 668254b435cf46e1cc5cbc8346bad59db7ce7fcb | [43049685631](https://github.com/provedorconsult/AgentOS/actions/runs/43049685631) success | [43049685619](https://github.com/provedorconsult/AgentOS/actions/runs/43049685619) success | 69 PASS, 0 FAIL, 0 SKIP | 52 commits / 552 blobs |
| fc64ffd3890340810af1d682ef2900d5d5a47f84 | [43042894497](https://github.com/provedorconsult/AgentOS/actions/runs/43042894497) success | [43042894739](https://github.com/provedorconsult/AgentOS/actions/runs/43042894739) success | 66 PASS, 0 FAIL, 0 SKIP | 51 / 538 |
| a89440920fe8382ceff21807df6a9e06f67173cd | [43035036962](https://github.com/provedorconsult/AgentOS/actions/runs/43035036962) success | [43035036801](https://github.com/provedorconsult/AgentOS/actions/runs/43035036801) success | 66 PASS, 0 FAIL, 0 SKIP | 50 / 527 |

Metadados das três execuções reconferidos nesta rodada. Logs dos jobs [Linux 130623067942](https://github.com/provedorconsult/AgentOS/actions/runs/43049685631/job/130623067942) e [Windows 130623068578](https://github.com/provedorconsult/AgentOS/actions/runs/43049685631/job/130623068578) de 668254b novamente inspecionados: testes conforme tabela, audit zero vulnerabilidades, histórico/doctor/validate/diff/worktree success; Gitleaks PASS Linux e skip condicional esperado Windows. Nenhum workflow Deploy disparado.

DEPLOY_ENVIRONMENT_EVIDENCE.json, COORDINATION_EVIDENCE.json e FALLBACK_EVIDENCE.json agora têm ci como objeto com commitSha, runs, conclusões e escopo. Foram removidos os marcadores de CI pendente dessas execuções. O resultado do sucessor documental pertence ao seu próprio SHA e é registrado após publicação no comentário de reauditoria, sem substituir os dados das execuções acima ou dizer que o CI de 668254b validou outro commit. Não há campo CI genérico relativo a um HEAD móvel. Logs locais e resultados de CI são evidências distintas; refs locais não cobrem todo o histórico remoto, forks ou objetos inalcançáveis.

## Decisões humanas já concluídas

| Decisão | Fonte | Resultado | Não implica |
|---|---|---|---|
| Coordenação #20/#21 | [6800325463](https://github.com/provedorconsult/AgentOS/pull/21#issuecomment-6800325463) | Estratégia aceita, mantendo gates | Merge ou fechamento imediato da #20 |
| Mínimo de aprovação | [6800362186](https://github.com/provedorconsult/AgentOS/pull/21#issuecomment-6800362186) | Uma aprovação de reviewer elegível distinto do autor | Regra já aplicada ou aplicação administrativa autorizada |

Os dois comentários foram relidos diretamente no GitHub. A definição de política não deve voltar a ser listada como sem decisão. A independência da revisão, elegibilidade e aplicação/readback continuam gates distintos. A estratégia permite propor encerramento de #20 como substituída somente após aprovação independente; a PR #20 não foi modificada ou encerrada.

## Reviewers: permissões observadas e limites

Consulta read-only pelo conector específico github_get_repo_collaborator_permission, repository_full_name provedorconsult/AgentOS e username de cada candidato. O fetch genérico recusa esses endpoints com 400, mas a ferramenta específica fornece os resultados abaixo. Não são convites, grants nem solicitações de review.

| Conta indicada | Retorno | Conclusão |
|---|---|---|
| clovisjr | permission=write | Permissão compatível com revisão contável; conta difere do autor mkwdf1 |
| provedorconsult | permission=admin | Permissão compatível com revisão contável; conta difere do autor mkwdf1; não prova ausência de bypass |
| suely35ramos | permission=null | UNKNOWN; não comprova permissão nem inexistência da conta |

Esses retornos não comprovam identidade/independência humana, revisão efetivamente emitida, cumprimento de restrições adicionais ou elegibilidade de todos os candidatos. Não converter indicação de nome/permissão em aprovação da PR. A API pode retornar dados diferentes após mudanças administrativas.

## Proposta administrativa concreta — NÃO APLICADA

Alvo limitado: ruleset de repositório 27031355, active, include somente refs/heads/main. Alteração proposta: na regra type=pull_request, mudar apenas parameters.required_approving_review_count de 0 para 1. Preservar demais parâmetros, condições, enforcement e regras: checks Linux/Windows strict, resolução de conversas, non_fast_forward/deletion e todos os outros valores. Não alterar bypass ou papéis sem decisão própria. Se o estado/base de configuração mudou, interromper e revisar a proposta em vez de sobrescrever.

Pré-condições: autorização humana específica para essa aplicação administrativa; capacidade administrativa legítima; confirmar ao menos um reviewer elegível distinto do autor. A decisão de uma aprovação definiu a proposta, não autorizou seu write. O conector atual não disponibiliza mutação administrativa e a integração não tem admin; não usar credenciais pessoais ou procurar contornar essa limitação.

Após autorização, administrador deve guardar o estado completo anterior, aplicar somente a mudança aprovada e produzir readback independente datado. Confirmar required_approving_review_count=1, proteção aplicável à main, checks strict preservados e revisão elegível exigida. O GET de configuração comprova a configuração retornada, não todos os cenários de enforcement; não tentar merge/push/bypass para testar. O Checker avalia a suficiência do readback antes de liberar integração.

Bypass: obter resposta administrativa completa do ruleset incluindo bypass_actors explícito (vazio ou lista com actor_id/actor_type/bypass_mode), identificar papéis/apps/atores e escopos; conferir também proteção clássica, enforce_admins, restrictions e bypass_pull_request_allowances, se presentes. Distinguir bypass de regra ativa do poder de alterar regras. Não publicar tokens, secrets, alertas ou configuração operacional sensível. Fontes oficiais: [Rulesets](https://docs.github.com/en/rest/repos/rules#get-a-repository-ruleset) e [Branch protection](https://docs.github.com/en/rest/branches/branch-protection#get-branch-protection).

Readback desta rodada continua: minimum=0, bypass_actors omitido, current_user_can_bypass=never somente para a conexão. Proteção clássica GET /branches/main/protection retorna 403. Assim, política desejada=1; observada=0; aplicação não executada e enforcement da política desejada não demonstrado. Não declarar bypass global ausente ou gate administrativo resolvido. Evidência estruturada em humanDecisionsAndReadback de DEPLOY_ENVIRONMENT_EVIDENCE.json.

## Verificação documental e próxima revisão

Comandos locais e resultados desta rodada registrados abaixo; CI do SHA documental sucessor é vinculado no handoff externo ao seu próprio commit. Não há teste novo para uma alteração documental. Verificar também que git diff do HEAD inicial não altera scripts, tests, .github/workflows, package.json ou package-lock.json. A PR permanece Draft e aberta. Reversão: manter sem merge e revisar somente o commit documental, sem restaurar declarações incorretas de estado.

Pendências reais: autorização/capacidade para aplicação administrativa; mínimo de uma aprovação aplicado e readback independente; bypass global; comprovação de reviewer/independência; nova decisão do Checker. Decisões humanas de estratégia e quantidade estão concluídas. Sem merge, release, deploy, SSH, encerramento de #20 ou mudança de outro repositório. Hermes F1 BLOQUEADA.

### Verificação local desta reconciliação

| Comando | Exit code | Resultado |
|---|---:|---|
| `npm run validate` | 0 | PASS |
| `npm run validate:secrets:history` | 0 | PASS |
| `git diff --check` | 0 | PASS |

Suíte 69/69 PASS, zero falhas/skip. Histórico local anterior à publicação: 60 commits/561 blobs; somente refs disponíveis localmente. Primeira tentativa da validação documental detectou link relativo de REVIEW incorreto; corrigido antes da execução completa PASS acima. Logs preservados em workspace fora do Git. A comparação das superfícies scripts/tests/workflows/dependências com 668254b retornou diff vazio.

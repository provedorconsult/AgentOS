# Correção de seleção de ambiente de deploy

Data: 2026-11-11. PR #21, Draft. HEAD inicial auditado: `fc64ffd3890340810af1d682ef2900d5d5a47f84`; base main: `e2eedcc6249e08c389aef6282bcb13ae40d2f76a`. Novo SHA exato e CI constam no handoff externo da PR. Estado Maker: validação local concluída, aguardando CI do novo SHA no handoff externo; não aprovação. Hermes F1 BLOQUEADA.

## Causa e decisão

O workflow aceitava inputs.environment como texto livre e usava o valor como job.environment. O GitHub pode criar automaticamente um environment inexistente, sem as proteções do ambiente pretendido. Fixar somente o nome staging ou uma lista de nomes também não comprovaria existência/proteção, pois o readback administrativo de environments continua inacessível nesta conexão.

Escolhida a remoção da seleção de ambiente e da capacidade de deploy deste workflow até o gate administrativo. O workflow mantém apenas workflow_dispatch, job limitado a main, timeout e token contents read, com um passo PowerShell que lança erro explícito. Não há environment, inputs, checkout, setup, secrets nem chamada a scripts de deploy. Portanto esta versão não referencia nem cria GitHub Environment e não depende de supor suas proteções. Nenhum workflow manual foi disparado para testar isso.

Não são criados ambientes, reviewers ou comandos operacionais. scripts/deploy.mjs e deploy.ps1 permanecem intactos: o contrato local exige AGENTOS_DEPLOY_COMMAND e encerra com erro se ausente. O workflow anterior não configurava esse comando; não foi inspecionado conteúdo de secrets/variables administrativos, portanto a ausência global da variável não é comprovada. O novo workflow não chama o script mesmo que uma configuração operacional venha a existir. Executar diretamente o contrato local segue sendo ação separada, não autorizada nesta auditoria.

## Validação estrutural e regressões

workflow-security.mjs agora rejeita qualquer propriedade environment no job, escalar ou objeto, e seletores chamados environment ou de type environment no dispatch. A política é deliberadamente restritiva: não existe ambiente autorizado por readback nesta entrega. Nomes fixos e escolhas controladas também são rejeitados por enquanto. Não há lista fictícia de ambientes protegidos, flag para presumir validação nem exceção para o workflow Deploy.

Três regressões novas cobrem nomes dinâmicos (inputs/matrix, escalares e mapping), nomes fixos não verificados e seletores string/choice/environment. RED com validador antigo: 7 testes, 4 PASS / 3 FAIL. O teste legado que exigia o binding dinâmico foi substituído por garantia de ausência de environment/chamada de deploy e presença de falha explícita. Isso corrige uma expectativa que codificava o defeito, sem retirar cobertura dos demais controles. Testes focados após correção: 16 PASS, zero falhas/skip. Suíte completa local: 69/69 PASS, zero falhas/skip; segurança pública 17/17, audit zero vulnerabilidades, scanners/doctor/validate/diff PASS. Exit codes estão em [DEPLOY_ENVIRONMENT_EVIDENCE.json](DEPLOY_ENVIRONMENT_EVIDENCE.json).

Reprodução: node --test tests/agentos-workflow-security.test.mjs tests/agentos-audit-hardening.test.mjs; npm run validate; node --test tests/agentos-public-security.test.mjs; npm run validate:secrets:history; npm audit --audit-level=moderate; bash scripts/run-gitleaks.sh; git diff --check. Não disparar workflow Deploy como verificação. O CI Linux/Windows e checklist devem ser consultados no novo SHA; CI anterior não prova este commit.

## Gate de reativação — não executado

1. Administrador autorizado fornecer readback sanitizado e datado dos ambientes preexistentes e de suas regras: reviewers, prevent_self_review, can_admins_bypass, deployment_branch_policy e demais controles aplicáveis. Nenhum valor de secret ou variável deve ser publicado.
2. Proprietário autorizar explicitamente política de ambientes e comando operacional, com rollback e escopo. Esta entrega não solicita nem concede deploy.
3. Alteração posterior revisada deverá vincular nomes fixos aprovados, comprovar proteção e execução fail-closed se a configuração mudar; lista de nomes ou type environment isolados não bastam. Rever a política executável e suas regressões na mesma mudança. Não remover o bloqueio apenas para passar no validador.
4. Checker independente conferir configuração e código antes de reativar. Reativação, integração e deploy têm gates próprios.

Referência primária: [GitHub — Managing environments for deployment](https://docs.github.com/en/actions/how-tos/deploy/configure-and-manage-deployments/manage-environments): referência de workflow a nome inexistente pode criar ambiente sem regras/secrets; não confundir existência com proteção. Fonte upstream variável, consultável pelo Checker; a decisão fail-closed independe de uma configuração administrativa não demonstrada.

## Limitações e entrega

Readback completo de bypass ainda UNKNOWN; aprovação mínima zero no ruleset visível; política humana/reviewer elegível e aceitação da consolidação #20/#21 ainda pendentes. Não afirmar que o bloqueio do workflow resolve governança global. PR #20 permanece intacta e Draft. [Inventário administrativo](COORDINATION_GOVERNANCE.md) e evidências históricas foram preservados.

Arquivos: workflow Deploy, política e regressões; sprint pública; SPEC/PLAN/REVIEW/CHANGELOG; atualizações de handoff/postura/contexto de coordenação; este relatório e evidência. Sem novas dependências, alteração do scanner ou de suas exceções, mudança administrativa ou outro repositório. Lista exata e SHA final no comentário de reauditoria.

Próximo gate: CI do novo SHA e nova auditoria independente, mais decisões/readback humanos remanescentes. Manter Draft; sem merge, release, deploy, autoaprovação, SSH ou liberação de Hermes F1. Reversão: manter a PR sem merge e revisar a correção; não restaurar o environment dinâmico como solução operacional.

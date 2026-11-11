# Achados — exposição pública e hardening AgentOS

Classificação Maker; não é aprovação de segurança. Evidências de 2026-11-11, baseline e2eedcc6249e08c389aef6282bcb13ae40d2f76a.

| ID | Severidade / causa | Superfície / evidência sanitizada | Impacto e probabilidade | Correção / regressão | Estado / dependência humana |
|---|---|---|---|---|---|
| PUB-001 | MEDIUM: modo histórico não varria histórico | scripts/validate-no-secrets.mjs, opção --history apenas chamava walk(root) | Arquivos removidos e outras branches passavam despercebidos; provável em uso real | Enumerar todas as refs locais, commits, árvores e blobs; teste de exclusão, outra branch e rename | Corrigido no código; revisão independente pendente |
| PUB-002 | MEDIUM: redaction parcial | Diagnóstico antigo mostrava prefixo/sufixo do valor | Fragmentos de credenciais podiam ir a logs; provável quando há alerta | Redaction total e fingerprint HMAC por processo; teste sem nenhum fragmento | Corrigido; teste legado que exigia fragmentos atualizado |
| PUB-003 | MEDIUM: bypass de placeholder / leitura incompleta | Placeholder de ambiente aceitava sufixo arbitrário; erros/binários ignorados | Falso negativo / falso PASS de cobertura | Placeholder ancorado, erros/symlinks/binários desconhecidos bloqueiam conclusão; arquivos sensíveis e artefatos tracked ignorados pelo walk são checados | Corrigido; limites de formato documentados |
| PUB-004 | MEDIUM: permissões e shell no workflow manual | deploy.yml sem permissions/timeout; input interpolado diretamente no PowerShell | Default de token desconhecido e possibilidade de interpretar input como código; limitado a quem pode disparar workflow | contents read, timeout, main-only, input via env; checkout sem credenciais em todos; política YAML executável | Corrigido no YAML; não houve deploy |
| PUB-005 | HIGH: dependência vulnerável | fast-uri 3.1.2 via Ajv no lockfile; npm audit baseline identifica advisory | Parser URI vulnerável; exploração no consumidor não comprovada | Atualização mínima a 3.1.9, pins diretos intactos, audit posterior; mesma correção proposta separadamente em PR #20 | Corrigido na branch, não em main; coordenar/rebase com PR #20 antes de qualquer merge |
| PUB-006 | INFO: informação técnica pública intencional | Exemplos .env.example, IDs de tasks, nomes de variáveis de ambiente, repositórios e autores Git públicos | Não identificados como credenciais; não há justificativa para apagar conhecimento técnico | Classificação e testes de falsos positivos; não copiar identidades pessoais para relatórios | Sem remoção indiscriminada |
| PUB-007 | LOW: recursos GitHub não comprovados | security_and_analysis omitido; endpoints Actions permissions não suportados pelo conector | Configuração real de forks, scanning e default token permanece desconhecida | Compensar com permissions versionadas, checkout sem persistência, scanner próprio e Gitleaks; solicitar leitura administrativa independente | Pendente externo; não alterar settings |
| PUB-008 | INFO: Ruleset configurado, enforcement não testado destrutivamente | 27031355 active, main protected=true; bypass_actors não retornado | Não se pode garantir ausência de exceções pela resposta parcial | Verificação independente de bypass actors e regras efetivas; sem force push/deleção/merge de teste | Pendente externo; sem mudança administrativa autorizada |

## Varreduras e classificação de candidatos

Mirror sem shallow: 56 commits, 500 blobs únicos, todas as branches/refs anunciadas, nenhuma tag. Gitleaks 8.30.1 (binário oficial com checksum) não encontrou alertas no histórico e na árvore. Isso não é prova de ausência. Análise complementar sem conteúdo em stdout verificou padrões de provedores, cabeçalhos privados, URLs autenticadas, atribuições, emails, IPv4 e paths locais. Candidatos foram classificados individualmente: placeholders, fixture sintética, nomes de tasks capturados por regex preliminar sem boundary e referência bearer_token_env_var. Nenhum segredo real foi confirmado, nenhuma credencial foi validada externamente e nenhuma exposição pessoal de terceiro foi confirmada no conteúdo analisado.

Metadados de autoria Git são parte intencional do histórico público; valores não são transcritos aqui. Emails no conteúdo encontrados eram fixtures com domínio reservado. Não foi identificada topologia real/IP operacional nos candidatos revisados. Uma regex não identifica todo dado pessoal possível: revisão humana independente continua necessária.

## Binário e fixture históricos revisados

- docs/PRD_AGENTOS_EVONEXUS_ALIGNMENT.docx, blob ffdcbeac879079eede49f8d1820d48f0307bb8db, 28.187 bytes. Arquivo removido ainda alcançável. Texto XML foi extraído para inspeção local e metadados de creator eram vazios/default; não foi confirmado dado sensível. Nenhum conteúdo bruto foi versionado. Exceção vinculada ao blob e path exatos, não ao formato DOCX em geral. Alteração de bytes ou novo binário exige revisão.
- Uma fixture negativa histórica em tests/agentos-audit-hardening.test.mjs no blob 910bd1b6f1263df1d866c623c668b95357c4f009 contém valor sintético deliberado. Exceção por path + blob + hash do valor, jamais exclusão global de tests. O scanner continua detectando valores novos no mesmo path. Não é credencial real nem permissão para usar segredo em testes.
- O scanner próprio mantém exclusão do próprio arquivo de implementação para não confundir seus padrões literais com chave privada. Essa limitação é compensada pela varredura independente Gitleaks e revisão de fonte; não alegar cobertura uniforme somente pelo scanner próprio.

## Workflows históricos

Foram analisados 31 blobs YAML históricos de workflows: 13 versões omitiam permissions explícitas e quatro ocorrências usavam action mutável. Não foram encontradas referências secrets nem triggers pull_request_target/workflow_run nessas versões. Classificação PUB-009 / LOW: versões antigas continuam alcançáveis e não são endurecidas retroativamente. Não executar manualmente workflows em refs legadas; usar somente SHA revisado. Alterações da branch corrigem os quatro workflows atuais; não foram apagadas branches ou reescrito histórico para ocultar versões antigas. O default de token histórico efetivo é desconhecido e não é inferido do YAML.

## PUB-010 — MEDIUM / bloqueador de revisão: fallback literal

O Checker encontrou um falso negativo de classificação: expansão com word literal era aceita como placeholder. Não foi confirmada credencial real neste caso; a reprodução usa dados sintéticos. Causa raiz e correção em FALLBACK_REMEDIATION.md. A mudança deve passar a nova auditoria no SHA exato; não confundir remediação Maker com aprovação.

## Condições de parada

Nenhum bloqueador de credencial real/dado pessoal foi confirmado na triagem. Qualquer novo candidato plausível não classificado deve parar a implementação e ser escalado privadamente ao proprietário; não revogar, rotacionar, reescrever histórico ou alterar visibilidade sem autorização específica.

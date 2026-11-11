# Postura de segurança — AgentOS público

## Escopo observado

Repositório público confirmado por API, baseline e2eedcc6249e08c389aef6282bcb13ae40d2f76a. Auditoria estática/local não destrutiva; nenhuma alteração administrativa, credencial operacional, conexão SSH ou teste de produção. O público pode copiar commits antes de qualquer remediação; remover um arquivo do checkout não revoga segredo nem o remove do histórico.

## Cadeia de desenvolvimento

CI de validação e checklist usam pull_request/push, sem pull_request_target ou workflow_run. Os jobs não referenciam secrets; permissions versionadas limitam contents a read, actions estão fixadas em SHA, checkout não persiste credenciais e jobs têm timeout. Código de contribuidores continua sendo código não confiável: não fornecer secrets, identidade cloud ou permissão de escrita a esses jobs. Configuração de aprovação de forks do GitHub é UNKNOWN na conexão disponível; não foi alterada.

Deploy continua manual, com environment existente e comando real não configurado por esta auditoria. O YAML passa input via env em vez de interpolar shell e só admite job em refs/heads/main. Isso não comprova aprovação/isolamento de environments administrativos e não autoriza executar o deploy. Não há upload de artefatos ou raw secret reports nos workflows examinados.

## Scanners e limites

O scanner próprio atual valida árvore não ignorada mais arquivos tracked mesmo em diretórios ignorados; segue política fail-closed para leitura, links simbólicos e binários sem revisão. --history enumera todas as refs locais/commits/árvores e blobs, inclusive paths removidos/renomeados e cópias. Clone shallow, batch incompleto ou falha Git não podem gerar PASS. Git tem limite de buffer de 64 MiB no processo; excedê-lo bloqueia conclusão. Refs não disponíveis localmente, objetos inalcançáveis e caches externos não são cobertos. O mirror inicial sem shallow incluiu refs de PR anunciadas; checkout de CI pode ter conjunto diferente de refs, que deve ser entendido como limite.

Diagnósticos não mostram prefixo/sufixo nem valor completo. Fingerprint HMAC aleatório por execução permite correlacionar ocorrências dentro do mesmo processo e não é hash público reversível por dicionário. O scanner não prova validade de token ou ausência de toda forma de segredo/dado pessoal. Não lê o environment real, não executa código encontrado e não faz validação de credencial na rede.

Exceções históricas são enumeradas em scripts/secret-scan-review.json por path/blob/hash específico: uma fixture sintética e um DOCX examinado. Não há exclusão global de tests ou de binários. O próprio arquivo de padrões do scanner é excluído por limitação declarada; Gitleaks e revisão independente cobrem essa superfície. Não reutilizar a exceção de um blob em arquivo novo.

Gitleaks 8.30.1 é independente do scanner próprio, obtido da release oficial com SHA-256 verificado; não é nova dependência npm. Não imprime/upload raw findings. Sua ausência de alertas também não é prova de ausência; disponibilidade do binário e rede é pré-condição do passo Linux. O passo é executado dentro de validate (ubuntu-latest), contexto já exigido pelo Ruleset, sem criar uma exigência administrativa nova.

## Governança: três camadas

| Controle | Declarado | Consultado pela API | Enforcement comprovado |
|---|---|---|---|
| Alvo | somente main | include refs/heads/main; exclude vazio | resolução de main protegida; sem teste destrutivo |
| Ruleset | 27031355 active | active; main protected=true | configuração observada, não prova de todos os bloqueios |
| PR/checks | PR + Linux/Windows strict | dois contexts exatos validate (ubuntu-latest), validate (windows-latest), strict true | nenhuma tentativa de bypass/merge |
| Conversas / force push / deletion | obrigatórios | thread resolution, non_fast_forward e deletion presentes | não testados por mutação |
| Bypass | sem exceções desejadas | bypass_actors não retornado; current_user_can_bypass=never | ausência global de bypass NÃO COMPROVADA |
| Aprovação | seguir política humana | required_approving_review_count=0 | não declarar revisão humana imposta por API |

Não foi modificado o ruleset. O achado antigo de main desprotegida foi superado pela consulta desta auditoria, mas seu histórico foi preservado. O Checker deve conferir a configuração atual e as limitações, não usar o antigo estado como atual.

## Proteção contínua e plano GitHub

| Recurso | Evidência | Estado / compensação |
|---|---|---|
| Dependabot | dependabot.yml semanal npm/Actions e branches observadas | configurado; PR não significa atualização mergeada |
| Secret scanning / push protection | security_and_analysis omitido | UNKNOWN, não afirmar habilitação ou indisponibilidade por plano |
| Code scanning | sem workflow ativo identificado; setting não retornado | UNKNOWN, avaliar separadamente com administrador |
| Dependency review | sem integração comprovada | npm audit + lockfile/pins e revisão de diff como controle compensatório |
| Permissões de Actions / aprovação de forks | endpoints não suportados pelo fetch (400) | UNKNOWN; permissions read no código e nenhum secret como compensação |
| Vulnerability reporting privado | link existente na política | disponibilidade UNKNOWN; confirmar canal antes de enviar informação confidencial |

Pendente externo: leitura independente de bypass/settings/plano por pessoa autorizada. Não modificar serviços ou habilitar recursos sem a autorização administrativa correspondente.

## Readback posterior — coordenação PR #20/#21

[Inventário completo e reproduzível](COORDINATION_GOVERNANCE.md) · [consultas sanitizadas](COORDINATION_EVIDENCE.json). Confirmado novamente: ruleset active somente main, checks strict, zero aprovações humanas obrigatórias no ruleset visível, bypass_actors omitido. Proteção clássica 403; endpoints adicionais recusados pelo conector 400. Zero aprovações é NOT CONFIGURED nesse escopo, não apenas falta de prova. Bypass global permanece UNKNOWN e os demais settings têm classificação individual; nenhuma alteração administrativa.

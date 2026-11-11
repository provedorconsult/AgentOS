# Relatório de implementação — auditoria pública

Estado local: READY_FOR_CHECKER dentro do escopo acessível, condicionado à conferência independente do SHA/CI e das limitações externas. Não é aprovação de segurança. SHA inicial e2eedcc6249e08c389aef6282bcb13ae40d2f76a; branch security/public-exposure-hardening. SHA final exato será registrado no handoff externo da PR, pois um arquivo não pode conter o hash do commit que inclui a si próprio.

## Alterações

- Scanner: histórico Git real por refs/commits/árvores/blobs, redação completa com fingerprint HMAC efêmero, placeholders completos, arquivos sensíveis, leitura/binários/symlinks fail-closed, varredura de artefatos tracked sob diretórios ignorados.
- Exceções auditadas restritas ao blob/path/hash exatos de fixture negativa e DOCX removido, sem exclusão de todos os testes ou binários.
- Testes de regressão para remoção, branch não atual, rename/cópia de conteúdo, clone shallow, binário desconhecido, symlink, placeholders, arquivos sensíveis e ausência de fragmentos. O teste antigo que exigia prefixo/sufixo foi corrigido.
- Política YAML executável contra escrita de token, triggers privilegiados, checkout persistente, actions mutáveis, timeout ausente e interpolação de input/evento em shell. Testes adversariais usam a função real.
- Quatro workflows com permissions contents read e persist-credentials false; npm ci ignore-scripts nos jobs npm; histórico real e Gitleaks independente no CI; deploy sem interpolação e sem execução nesta auditoria.
- Lockfile: apenas fast-uri transitivo passa de 3.1.2 a 3.1.9. Correção sobrepõe a PR #20 ainda não mergeada: rebase/consolidação será decisão própria, sem merge automático.
- Política de segurança e sete documentos exigidos em português brasileiro; evidência estruturada sem relatórios brutos ou dados operacionais.

## Instalação local e validação

Instalação local de dependências npm explicitamente autorizada por esta ordem, com npm ci --ignore-scripts, configurações vazias de usuário/global e cache em work. Nenhum script de lifecycle, ferramenta de infraestrutura ou pacote de sistema foi instalado. Gitleaks veio da release oficial e teve arquivo conferido por checksum antes da execução.

Comandos/resultados finais em EVIDENCE.json. Testes executados com AGENTOS_DEPLOY_COMMAND/AGENTOS_DEPLOY_ARGS removidos somente do ambiente dos processos de verificação, para impedir que teste de contrato invoque um deploy configurado. Proxy/CA foram preservados. Nenhum environment real foi impresso.

## Limitações e riscos residuais

Sem validação de credenciais na rede. Mirror cobre refs anunciadas, não objetos inalcançáveis nem caches/forks externos. Scanners não são prova de ausência, binário revisado é uma exceção auditável e settings GitHub omitidos não são PASS. CI do novo SHA e Checker devem repetir/conferir as evidências. Aprovação global Hermes F0/F1 não está implícita.

Nenhuma mudança administrativa, Ruleset, visibilidade, segredo/variable GitHub, credencial, permissão, merge, release/tag, exclusão/reescrita de histórico, produção ou outro repositório foi realizada.

## Correção posterior de fallback

REQUEST_CHANGES no SHA b9b8b440846365b854dee3bfc82bf8009f2a278b: gramática de placeholder corrigida e cinco regressões adicionadas. Consultar FALLBACK_REMEDIATION.md e FALLBACK_EVIDENCE.json; não inferir aprovação nem reutilizar CI do SHA anterior. Exceções e workflows preservados.

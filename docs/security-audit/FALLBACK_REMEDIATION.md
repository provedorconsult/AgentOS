# Correção do falso negativo em fallback de variável

Data: 2026-11-11. PR #21, branch security/public-exposure-hardening.
SHA auditado/pai da correção: b9b8b440846365b854dee3bfc82bf8009f2a278b.
Base da PR: e2eedcc6249e08c389aef6282bcb13ae40d2f76a. O novo SHA exato será informado no handoff externo da PR; um arquivo não pode conter o hash do commit que o inclui.

Estado: correção Maker para nova revisão; auditoria anterior REQUEST_CHANGES, sem aprovação. F1 permanece bloqueada.

## Causa e regra corrigida

A regex anterior aceitava qualquer conteúdo entre delimitadores de expansão como placeholder. Assim, a atribuição genérica ignorava um valor literal de fallback. A correção substitui essa aceitação ampla por uma gramática explícita, sem executar ou expandir shell:

- Referência simples: nome de variável com letras ASCII, números/underscore e primeiro caractere letra/underscore.
- Operadores reconhecidos: :-, -, :=, =, :+, +, :? e ?.
- O word do operador é analisado separadamente: vazio, marcador de exemplo explicitamente permitido ou referência válida pode ser aceito; literal arbitrário é suspeito, inclusive de um caractere.
- Referências aninhadas são analisadas recursivamente, com limite de oito níveis; não há avaliação de comandos ou leitura de environment.
- A detecção de fallback reconhecido ocorre antes do limite genérico de tamanho e das heurísticas de código-fonte, para não esconder literal curto ou semelhante a código.
- Formas fora dessa gramática não são declaradas placeholders. O scanner continua heurístico e não é um interpretador completo de shell nem prova ausência de segredos.

Não foi alterada a política de exceções por blob/path/hash, a revisão binária ou a exclusão declarada do próprio arquivo de padrões. As fixtures são construídas em runtime, sem inserir um fallback-segredo literal nos fontes do repositório. Não foram reduzidos testes de estrutura, histórico ou workflows.

## Regressões reproduzíveis

Cinco testes novos exercitam o scanner real em diretórios/repositórios temporários. RED no scanner anterior: 17 testes de segurança pública, 12 PASS / 5 FAIL. GREEN confirmado localmente: suíte completa de 66 testes PASS, zero falhas/skip (61 anteriores + 5 novos); resultado efetivo e comandos em FALLBACK_EVIDENCE.json.

Cobertura: oito operadores na árvore com valor sem aspas/aspas simples/duplas; oito operadores em arquivo removido mas alcançável no histórico; referência simples, fallback vazio, marcador aprovado e referência aninhada; literal curto, fallback aninhado, palavra semelhante a código e sintaxe não reconhecida; histórico com placeholder seguro seguido de literal e posterior exclusão. Os testes verificam falha sem divulgar o valor sintético.

## Escopo e riscos residuais

Mudanças: scanner, regressões, este relatório/evidência e atualização do handoff/registro da sprint. Sem nova dependência, alteração de workflow, ampliação de allowlist, credencial real, API administrativa ou outro repositório.

Mantêm-se as pendências independentes: ausência de bypass actors não comprovada, settings parcialmente acessíveis e coordenação da alteração fast-uri com PR #20 antes de qualquer integração. Nenhum merge, deploy, release, teste SSH, rotação de credenciais ou alteração de Ruleset foi autorizado/executado.

Próximo gate: CI do novo SHA, reprodução independente pelo Checker e decisão própria. CI verde não substitui revisão. EVIDENCE.json e relatórios originais continuam registros da entrega anterior; esta correção é identificada em FALLBACK_EVIDENCE.json e no novo SHA do handoff.

## Atualização de escopo posterior

O scanner e seus testes permanecem byte a byte iguais ao SHA a894409 validado pelo Checker. A rodada atual adiciona coordenação documental com PR #20 e [inventário de governança](COORDINATION_GOVERNANCE.md). FALLBACK_EVIDENCE.json permanece evidência histórica; os comandos da combinação final estão em COORDINATION_EVIDENCE.json e o CI do novo SHA no handoff externo.

## Evidência de CI reconciliada

A execução fixada em a89440920fe8382ceff21807df6a9e06f67173cd teve CI #43035036962 e checklist #43035036801 success, 66 testes por plataforma, zero falhas/skip. FALLBACK_EVIDENCE.json agora registra esse resultado pelo SHA, sem marcador de CI pendente. O estado corrente de decisões/enforcement está em TRACEABILITY_RECONCILIATION.md; não inferir aprovação global da validação técnica.

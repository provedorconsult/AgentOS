# Plano de correção — auditoria pública

Baseline concluído antes das correções; achados e prioridades detalhados em FINDINGS.md. Este documento registra o plano e os limites, sem ampliar autorização administrativa.

1. P1: corrigir histórico real do scanner, redaction total, leitura fail-closed, placeholders e arquivos sensíveis. Criar regressões antes da correção e manter diagnósticos sem valores. Exceções somente por blob/path/hash de artefato comprovadamente sintético ou binário revisado; revisão independente obrigatória.
2. P2: permissions contents read em todos os workflows, checkout persist-credentials false, timeout/main-only no deploy, input como dado, npm ci ignore-scripts; política YAML executável e testes adversariais. Adicionar scanner independente Gitleaks pinado em SHA-256, sem upload de relatório bruto.
3. P3: reutilizar a correção mínima de fast-uri proposta na PR #20; zero mudança em pins diretos. Guardar auditorias antes/depois fora de logs com segredos. Coordenar sobreposição entre as duas PRs sem merge automático.
4. P4: atualizar SECURITY.md e produzir baseline, achados, postura, resposta a incidentes, implementação e handoff em português brasileiro conforme esta ordem, preservando documentos históricos como históricos.
5. P5: integrar varredura histórica no CI e manter Dependabot; não habilitar serviços administrativos cuja disponibilidade não foi comprovada. Recursos ausentes/desconhecidos recebem controles compensatórios explícitos.

## Verificação

Executar doctor, validate, secrets, secrets:history, suíte unitária/regressões, política YAML e npm audit. Registrar comando/versão/exit code. Separar evidência local, CI e API. Não converter resultado parcial, exceção ou check antigo em PASS novo.

## Dependências e autorização

PUB-007/008 precisam de leitura independente de settings/bypass por pessoa autorizada; não requerem que o Maker altere regras. Credencial potencialmente real ou dado pessoal confirmado exige parada e autorização própria de resposta. Nenhuma alteração administrativa, merge, deploy, release, exclusão/reescrita de refs ou mudança em outro repositório é permitida.

## Reversão

As alterações propostas são código, YAML, lockfile e documentação em branch própria. Em regressão, manter main intacta e reverter somente o commit da branch após revisão. Não restaurar uma dependência vulnerável e liberar merge ao mesmo tempo. Não há estado remoto de produção para reverter nesta auditoria.

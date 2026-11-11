# Handoff ao Checker — auditoria pública AgentOS

## Atualização — correção de seleção de ambiente

REQUEST_CHANGES no SHA fc64ffd3890340810af1d682ef2900d5d5a47f84: workflow Deploy referenciava environment dinâmico sem readback administrativo. [Relatório da correção](DEPLOY_ENVIRONMENT_REMEDIATION.md) e [evidências atuais](DEPLOY_ENVIRONMENT_EVIDENCE.json) superam esse comportamento. Nesta rodada o workflow fica bloqueado, sem seleção/referência de ambiente ou chamada de deploy. O conteúdo anterior abaixo é histórico; bypass, política humana e aceitação da consolidação continuam pendentes.

## Rodada de coordenação/governança

A correção de fallback em a894409 foi validada pela revisão independente 5860100288 (COMMENTED); não foi aprovação integral. A rodada seguinte consolida a PR #20 sem merge e publica novo readback. [Relatório](COORDINATION_GOVERNANCE.md) · [evidências e comandos](COORDINATION_EVIDENCE.json). O SHA final e CI novos constam no handoff externo. Aprovação humana mínima zero no ruleset visível; bypass global permanece UNKNOWN. READY_FOR_CHECKER_REAUDIT é entrega para revisão, não autorização.


## Atualização após REQUEST_CHANGES

A revisão do SHA b9b8b440846365b854dee3bfc82bf8009f2a278b encontrou falso negativo em fallback de variável. A correção e os novos testes estão em [FALLBACK_REMEDIATION.md](FALLBACK_REMEDIATION.md) e [FALLBACK_EVIDENCE.json](FALLBACK_EVIDENCE.json). A revisão anterior não aprovou a entrega; solicitação de nova revisão e novo SHA constam no handoff externo da PR. Não usar os 61 testes antigos como evidência do novo HEAD.

Estado local: READY_FOR_CHECKER dentro do escopo acessível; CI do SHA final e settings externos devem ser conferidos independentemente. READY_FOR_CHECKER significará apenas entrega revisável, nunca aprovação de segurança/merge.

- SHA inicial: e2eedcc6249e08c389aef6282bcb13ae40d2f76a.
- Branch: security/public-exposure-hardening, derivada de main.
- SHA final: consultar o SHA explícito no corpo/comentário de entrega da PR; deve corresponder ao HEAD. O hash de um commit não pode ser inscrito no próprio arquivo que ele contém.
- Arquivos: consultar diff e sprint .harness/sprints/2026-11-11-public-security-audit.json; sem exceções amplas de escopo.
- Achados corrigidos na branch: PUB-001..005; main não foi alterada.
- Pendências externas: PUB-007/008 (settings/recursos/bypass ausentes na resposta API); não presumir ausência de atores ou disponibilidade de recursos.
- Evidência: BASELINE.md, FINDINGS.md, REMEDIATION_PLAN.md, SECURITY_POSTURE.md, INCIDENT_RESPONSE.md, IMPLEMENTATION_REPORT.md e EVIDENCE.json. Relatórios brutos não são publicados.
- Testes: comando, versão, código e resumo em EVIDENCE.json; evidência local separada de API e CI. Novo CI deve estar vinculado ao SHA final.
- Riscos: cobertura limitada a refs/formatos acessíveis, falso negativo possível, exceção binária imutável, sobreposição do lockfile com PR #20 e controles GitHub não testados destrutivamente.
- Autorização necessária: qualquer revogação/rotação, alteração administrativa/visibilidade/Ruleset, reescrita de histórico, merge, deploy ou release; nenhuma foi solicitada como necessária para esta correção de código.

## Roteiro independente

1. Conferir SHA e diff, baseline/ref manifest e classificação sem copiar valores sensíveis.
2. Repetir scanners próprio e Gitleaks em clone completo, além de revisão humana de padrões/binário histórico. Conferir exceções de blob/path/hash; não confiar apenas no resumo Maker.
3. Executar doctor/validate, secrets e secrets:history, testes, YAML e npm audit; verificar CI Linux/Windows e passo independente Gitleaks no job Linux obrigatório no mesmo SHA.
4. Consultar ruleset 27031355 e obter readback autorizado de bypass actors/settings/plano; separar configuração declarada, consultada e enforcement não destrutivamente observado.
5. Confirmar que não houve alterações em outro repositório, merge/deploy, ativação Hermes ou administração. Verificar sobreposição com PR #20 antes de qualquer integração futura.
6. Emitir parecer próprio sobre exposição pública e hardening. Não converter READY_FOR_CHECKER em autorização de produção ou avanço Hermes F1.

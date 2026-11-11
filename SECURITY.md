# Política de segurança

## Versões e escopo

AgentOS 2.0.0-rc.1 é um candidato a release e uma camada local de desenvolvimento. Este repositório público não autoriza testes contra infraestrutura, contas de terceiros, deploy ou uso de credenciais reais. Resultados de scanners não são certificação de ausência de segredos.

## Relato responsável de vulnerabilidade

Use [o canal privado de advisories do GitHub](https://github.com/provedorconsult/AgentOS/security/advisories/new) **se estiver habilitado para sua conta/repositório**. A disponibilidade não foi comprovada pela API nesta auditoria. Se indisponível, combine um canal privado com o proprietário pelos meios já autorizados; não invente endereço de email nem publique o problema para solicitar contato.

Não abra issue/PR público contendo segredo, dados de terceiros, dump, `.env`, token, chave privada, evidência bruta ou detalhes de vulnerabilidade inédita. Envie privadamente apenas o necessário: versão/SHA, localização, reprodução com dados sintéticos, impacto, ferramentas e mitigação sugerida. Não teste a validade de credenciais contra provedores.

O proprietário confirma recebimento e coordena triagem e divulgação; não há SLA de resposta prometido. Autorização para analisar não é autorização para revogar, rotacionar, alterar visibilidade ou reescrever histórico.

## Desenvolvimento seguro

- npm ci --ignore-scripts para instalar o grafo fixado, seguido de npm audit e validadores.
- Scanner local e histórico real: npm run validate:secrets e npm run validate:secrets:history.
- Scanner independente Gitleaks pinado no CI, sem exposição de relatório bruto.
- Sem token persistido no checkout, sem permissions de escrita e sem código de fork em contexto privilegiado.
- Mudanças administrativas, merge, release e deploy precisam de autorização própria; não fazem parte desta auditoria.

[Postura e limitações](docs/security-audit/SECURITY_POSTURE.md) · [Resposta a incidentes](docs/security-audit/INCIDENT_RESPONSE.md).

# Resposta a incidentes e exposição pública

## Gatilho e parada

Credencial plausível não classificada, dado pessoal exposto ou vulnerabilidade crítica sem mitigação segura: parar implementação/publicação e comunicar ao proprietário por canal privado. Não copiar o valor para chat, commit, issue, PR, log ou artefato. Registrar somente tipo, path/linha, SHA/blob, fingerprint seguro e impacto provável.

## Contenção e decisão humana

1. Preservar evidência mínima em local privado já autorizado, com acesso restrito; não criar arquivo público de evidência bruta.
2. Pedir autorização específica para revogação/rotação e identificar o provedor/escopo; nunca validar uma chave vazada na rede por iniciativa própria.
3. Proprietário/provedor autorizado revoga/rotaciona, verifica acessos e coordena afetados. Disponibilidade de uma credencial não concede autorização de uso.
4. Mudança de visibilidade, ruleset, permissões, secrets/variables ou histórico exige autorização própria. Não apagar refs nem executar git filter-repo automaticamente.
5. Após revogação, propor limpeza do checkout e eventual saneamento de histórico com impacto, backups, rollback e coordenação de forks/caches. Limpeza Git não substitui revogação e cópias já públicas podem persistir.
6. Usar dados sintéticos na regressão. Reexecutar scanners independentes e registrar limites; Auditor/Checker revisam o SHA exato antes de qualquer merge autorizado.

## Comunicação e encerramento

Não publicar prova de conceito com dados de terceiros. Divulgação responsável deve ser coordenada pelo proprietário e pelas partes afetadas. Nenhum prazo de resposta ou certificação é prometido. Encerrar somente após evidência de contenção, verificação independente e autorização da ação seguinte. Sem conexão SSH, deploy, alteração administrativa ou promoção implícitos.

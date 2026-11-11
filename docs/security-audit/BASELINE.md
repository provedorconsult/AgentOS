# Baseline — auditoria de exposição pública AgentOS

Data: 2026-11-11 (America/Sao_Paulo). Maker; auditoria posterior independente.
Repositório confirmado público: provedorconsult/AgentOS. Default branch: main.
SHA inicial: e2eedcc6249e08c389aef6282bcb13ae40d2f76a.
Checkout local separado, detached no SHA inicial; worktree limpo antes deste documento. Nenhum arquivo de produção, setting ou outro repositório alterado.

## Aquisição e limites

Clone mirror HTTPS anônimo, sem credencial pessoal e sem shallow history. Todas as refs anunciadas pelo remoto foram obtidas, inclusive refs de PR acessíveis; objetos inalcançáveis/refs privadas não anunciadas e caches externos não são cobertos. Não serão reescritos históricos ou excluídas refs.

Commits alcançáveis: 56. Shallow: false. Tags: nenhuma anunciada.

## Refs acessíveis (nome e SHA, sem conteúdo)

```text
refs/heads/agentos/specpilot-engine 3e11d321eed944406510087ce6088a64b3526360
refs/heads/codex/doc-state-alignment-2026-06-19 388c897933b8dcaac9c9ea49e5694d22a6197cd8
refs/heads/dependabot/github_actions/actions/checkout-7.0.1 12c9c8e5bad52a326770acbdd54719f56665429b
refs/heads/dependabot/github_actions/actions/setup-node-7.0.0 e17b286431087224af4090c4311d0bcae2f54ccb
refs/heads/dependabot/npm_and_yarn/yaml-2.9.1 02af5d00aca89ed2cfc5fe33a359c5b2ca7ca2f4
refs/heads/fix/agentos-audit-reconciliation 1e4b5a8f8aa589ecad8ac1dbaaf5f6fccc3097a0
refs/heads/fix/agentos-governance-fluency aaca7f7c35a86bbabdbc57ef68271792c057fff7
refs/heads/fix/f0-aud-003-governance-dependency 9b30bec1ec72d861c984dda1e24e5e80adafa4e6
refs/heads/fix/remove-example-openai-key a2d5afa56ac2eb81a76803824542bec814ad1eec
refs/heads/main e2eedcc6249e08c389aef6282bcb13ae40d2f76a
refs/pull/1/head 3e11d321eed944406510087ce6088a64b3526360
refs/pull/10/head 45134aff9332be7180386d1c96285904830d7dfe
refs/pull/11/head f394c46a7ef2480ffad97629f73e916e7761b521
refs/pull/13/head aaca7f7c35a86bbabdbc57ef68271792c057fff7
refs/pull/14/head 1e4b5a8f8aa589ecad8ac1dbaaf5f6fccc3097a0
refs/pull/15/head 6433d4edf4b26a22b76e4a54f64e18af88ad7338
refs/pull/16/head 52ed641a214cc09a9f5dac15f9d357ff673d9c02
refs/pull/17/head e17b286431087224af4090c4311d0bcae2f54ccb
refs/pull/17/merge dd72f31d7cd23d4243cc5bdc76f2ebe4f501ab2b
refs/pull/18/head 12c9c8e5bad52a326770acbdd54719f56665429b
refs/pull/18/merge 46b51f5c3bfa992369237b72ea0225a90784f815
refs/pull/19/head 02af5d00aca89ed2cfc5fe33a359c5b2ca7ca2f4
refs/pull/19/merge bda52b9096efc6c07975fcb94719f34001357b9b
refs/pull/2/head a2d5afa56ac2eb81a76803824542bec814ad1eec
refs/pull/20/head 9b30bec1ec72d861c984dda1e24e5e80adafa4e6
refs/pull/20/merge 2a28de499a228a1e40ec79420ba564eaf0513e27
refs/pull/3/head 47f172f18f46bf38dce877876eaf5e4947a4020a
refs/pull/4/head fbb70f6e9aa9581824d529f83b6511576702425e
refs/pull/7/head 4849af6b6ff411863bb8f9013f5ab06b6fc6e799
refs/pull/8/head 336f7cb899b1878442cb35dd0028dfd772088c85
refs/pull/9/head ef14a60712bfd82f5b765e069d52551608234702
```

## Ferramentas e superfície

Node 24.19.0; npm 11.9.0; Git 2.52.0. package.json exige Node >=22; pins diretos Ajv 8.20.0 e yaml 2.9.0. Lockfile main ainda contém fast-uri 3.1.2; a PR #20 é uma proposta separada, não mergeada. Validadores e testes existentes: doctor, validate, secrets, secrets:history e node --test; o scanner próprio não será a única evidência.

Workflows: ci.yml, agent-review.yml, deploy.yml e environment-health.yml. Serão auditados estaticamente antes de executar código local. Nenhum Gitleaks/TruffleHog estava no PATH. Gitleaks 8.30.1 obtido de release oficial, arquivo Linux x64 conferido por SHA-256 551f6fc83ea457d62a0d98237cbad105af8d557003051f41f3e7ca7b3f2470eb; usar com redaction e relatório local não bruto. Nenhum scanner valida credenciais em serviços remotos.

## Ruleset consultado, sem alteração

Ruleset 27031355, F0-AUD-003 - Protect main, enforcement active, include somente refs/heads/main e exclude vazio. API mostra PR obrigatório (zero aprovações), resolução de threads, checks validate (ubuntu-latest)/validate (windows-latest), strict true, non_fast_forward e deletion. main retorna protected=true. current_user_can_bypass=never se refere a esta conexão. bypass_actors não foi retornado: ausência de bypass actors NÃO COMPROVADA. Configuração ativa não comprova testes de enforcement; não tentar force push, exclusão ou merge para testar.

## Permissões e APIs

Conector possui pull/push/triage, sem admin/maintain. Endpoints actions/permissions e actions/permissions/workflow e rules/branches/main não são suportados pelo fetch do conector (400, não um teste de disponibilidade do recurso GitHub). Tags foram verificadas pelo mirror porque a coleção tags foi recusada pelo conector. security_and_analysis não foi retornado na consulta do repositório (UNKNOWN); não presumir secret scanning/push protection/code scanning habilitados.

## Fechamento do baseline

Os dez itens de descoberta foram inventariados antes de iniciar correções. Este documento é o primeiro arquivo criado no checkout. Próximo passo: varreduras independentes de histórico/árvore e classificação, sem imprimir segredos. Nenhuma conclusão de publicação segura ou aprovação global F0.

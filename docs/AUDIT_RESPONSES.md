# Respostas Propostas para as Questoes da Auditoria

Data: 2026-07-04. Base: `docs/AUDIT_OPEN_QUESTIONS.md`, `docs/AUDIT_CLAUDE.md`, `docs/AUDIT_CORRECTION_PLAN.md` e os arquivos citados por esses documentos.

## Premissas

- Este arquivo registra um parecer tecnico baseado no estado atual do repositorio.
- Onde a pergunta depende de telemetria externa ou decisao organizacional, a resposta abaixo define a opcao padrao mais segura para o projeto.
- As decisoes abaixo priorizam o contrato canonico atual: `README.md`, `docs/ARCHITECTURE.md`, `docs/SPEC.md`, `docs/PLAN.md`, `AGENTS.md` e os validadores Node em `scripts/`.

## Resumo

- Concordo integralmente com as recomendacoes de Q1, Q3, Q5, Q6, Q7, Q8 e Q11.
- Concordo com ajuste em Q2 e Q4 para preservar compatibilidade e separar regra normativa de documentacao explicativa.
- Discordo parcialmente de Q10: os hooks POSIX devem ser tratados como requisito de consistencia cross-platform, nao apenas como melhoria condicional.
- Em Q12, a recomendacao sobre `data` esta correta; para idioma, a melhor padronizacao para documentos canonicos e ingles.

## Q1 - Governanca de release

Resposta proposta: opcao 2.

Analise da recomendacao: correta.

Justificativa: a release `2.0.0-rc.1` ainda tem pequenas inconsistencias de confianca abertas na Fase 1, inclusive workflow de saude apontando para `scripts/doctor.ps1`, actions nao pinadas em todos os workflows e uma referencia fantasma em sprint verificado. Como a tag e a prerelease viram snapshot permanente, vale fechar a reconciliacao primeiro e publicar em seguida.

Proximo passo: concluir a Fase 1, atualizar `docs/REVIEW.md` com a evidencia final e so entao executar o fluxo de release.

## Q2 - Destino da pilha PowerShell legada

Resposta proposta: aceitar a direcao da recomendacao, com gate de compatibilidade.

Analise da recomendacao: boa, mas agressiva demais se executada sem antes zerar referencias ativas e sem confirmar uso externo.

Justificativa: o proprio repositorio ja mostra que o caminho canonico e Node, e `environment-health.yml` ainda referencia `scripts/doctor.ps1`. Porem, o repositorio nao contem telemetria de uso externo em maquinas Windows. A decisao mais segura e:

- remover do caminho principal os scripts com substituto canonico direto, depois que CI e docs deixarem de referencia-los;
- mover para `scripts/legacy/` os fluxos sem equivalente Node (`bootstrap-project.ps1`, `create-github-repo.ps1`, `adapt-existing-project.ps1`);
- manter `deploy.ps1` como wrapper legitimo.

Proximo passo: tratar primeiro as referencias internas na Fase 1 e executar a higienizacao na Fase 2.

## Q3 - Destino dos documentos legados e do `.docx`

Resposta proposta: opcao 3.

Analise da recomendacao: correta.

Justificativa: ha material com valor residual, mas ele nao deve competir com as fontes canonicas. `docs/AGENT_ROSTER.md` e `docs/QUALITY.md` ainda expressam conceitos uteis e hoje sao exigidos por `.github/workflows/agent-review.yml`. O restante deve sair do caminho principal quando so reproduz o modelo pre-Architecture 2.0. O `.docx` contraria diretamente o repositorio markdown-first e nao e auditavel por diff; sem fonte Markdown, o melhor destino e remocao ou conversao antes de permanecer ativo.

Proximo passo: manter apenas uma lista curta de documentos reescritos e atuais; arquivar o resto em `docs/legacy/` com banner de obsolescencia.

## Q4 - Nome do documento de guardrails de seguranca

Resposta proposta: renomear `docs/SECURITY.md` para `docs/SECURITY_GUARDRAILS.md` e promover para `core/rules/security.md` apenas as regras normativas curtas.

Analise da recomendacao: correta com refinamento.

Justificativa: `SECURITY.md` na raiz precisa continuar sendo a politica de vulnerabilidade padrao do GitHub. Ao mesmo tempo, o conteudo operacional de agentes nao deve compartilhar o mesmo nome. Tambem nao vale colapsar tudo em `core/rules/security.md`, porque esse arquivo deve ficar enxuto e normativo; o restante continua melhor como documentacao explicativa.

Proximo passo: separar claramente "regra de agente" de "guia operacional", atualizar links e gates.

## Q5 - Janela de remocao dos workflows deprecados

Resposta proposta: remover na Fase 3, apos a prerelease, com uma janela de compatibilidade de um ciclo de release.

Analise da recomendacao: correta.

Justificativa: `docs/ARCHITECTURE.md` ja declara a sequencia canonica `01` a `10`, mas `scripts/validate-workflows.mjs` ainda exige os arquivos de compatibilidade. Sem evidencia local de consumidores externos, uma janela longa nao se justifica; um ciclo de release e suficiente para sinalizar a remocao e executar a limpeza sem manter a ambiguidade por tempo demais.

Proximo passo: anunciar no `CHANGELOG.md` e remover junto com a atualizacao do validador.

## Q6 - Estrategia do adaptador Claude Code alem do `CLAUDE.md`

Resposta proposta:

1. `CLAUDE.md` nao deve permanecer espelho manual no medio prazo; deve virar artefato gerado ou validado a partir de `AGENTS.md` com bloco adapter-specific minimo.
2. `core/agents/*.md` nao deve ser convertido agora para subagentes Claude; isso exige SPEC propria.
3. A conversao de skills, se existir, deve ser mantida pelo adaptador `adapters/claude-code/`, nunca por `core/`.
4. `.claude/settings.json` deve ficar fora do escopo por padrao e so entrar com SPEC dedicada e decisao explicita de seguranca.

Analise da recomendacao: correta.

Justificativa: a arquitetura atual e explicita em manter `core/` independente de `.claude/`, e o escopo de R9 foi apenas coexistencia com `CLAUDE.md`. O proximo passo barato e reduzir drift entre `AGENTS.md` e `CLAUDE.md`; o restante so faz sentido com contrato de geracao, ownership e validacao definidos.

Proximo passo: abrir SPEC propria para MP-04 quando houver prioridade real.

## Q7 - Politica de configuracao do Codex

Resposta proposta: manter a politica atual no curto prazo.

Analise da recomendacao: correta.

Justificativa: o drift byte-a-byte entre `.codex/` e `codex-layer/` e uma garantia util hoje. Isso impede habilitacoes ad hoc de MCP no template canonico. Portanto:

- upgrade de modelo deve ser decisao do owner em PR explicita, com changelog e revisao do adaptador;
- placeholders de MCP podem permanecer desabilitados no template enquanto nao houver SPEC de overrides locais;
- habilitacao por maquina deve ocorrer apenas por um mecanismo futuro, explicitamente previsto, e nao por edicao manual do arquivo canonico.

Proximo passo: documentar a politica em `docs/ADAPTERS.md` quando a cadencia de upgrade estiver decidida.

## Q8 - Evidencia auto-declarada vs executada

Resposta proposta: opcao 1 agora, opcao 2 apenas como evolucao de medio prazo.

Analise da recomendacao: correta.

Justificativa: o repositorio ja depende de CI multi-OS e validacao mecanica para fechar a cadeia de confianca. Tentar resolver isso agora criaria mais superficie do que valor. O ajuste necessario no curto prazo e explicitar a limitacao no motor SpecPilot e nos templates de review, para que ninguem interprete a evidencia local como prova criptografica de execucao.

Proximo passo: documentar a limitacao e registrar o runner automatizado como SPEC futura, nao como reparo imediato.

## Q9 - Segundo mantenedor e required review

Resposta proposta: manter a politica temporaria atual ate existir segundo mantenedor elegivel; quando existir, reativar required review para `main`.

Analise da recomendacao: consistente com o estado atual.

Justificativa: o repositorio ja documenta que o merge owner-approved e uma excecao de governanca, nao um alvo permanente. Revisao automatizada pode complementar, mas nao substitui revisao humana obrigatoria para release e merge em `main`.

Proximo passo: registrar essa regra explicitamente em `docs/REVIEW.md` e na documentacao de release/governanca.

## Q10 - Hooks do codex-layer em ambientes POSIX

Resposta proposta: tratar hooks POSIX como requisito de consistencia cross-platform e implementar na Fase 3.

Analise da recomendacao: parcialmente correta, mas o criterio condicional e fraco demais.

Justificativa: a arquitetura, o CI e a propria proposta do AgentOS ja assumem Windows e Linux como plataformas de primeira classe. Manter hooks de segredo ativos apenas via PowerShell cria comportamento silenciosamente inferior em POSIX. Como o shim `sh` e pequeno e reaproveita o mesmo validador Node, o custo e baixo e o ganho de coerencia e alto mesmo sem telemetria de uso.

Proximo passo: criar wrappers POSIX e manter o comportamento Windows inalterado.

## Q11 - Politica para correcao de historico do harness

Resposta proposta: opcao 3, aplicando agora a errata da opcao 2.

Analise da recomendacao: correta.

Justificativa: editar sprint `verified` ou arquivado altera um registro historico de evidencia. Isso enfraquece exatamente o tipo de rastreabilidade que o projeto quer reforcar. A regra geral deve ser imutabilidade de sprint fechado; discrepancias posteriores viram errata registrada em `docs/REVIEW.md` ou documento proprio de erratas.

Proximo passo: documentar a discrepancia do arquivo fantasma como errata, sem reescrever o sprint historico.

## Q12 - Dominio `data` e idioma da documentacao

Resposta proposta:

- Contexto A: remover `data` de `docs/SKILLS.md` ate existir skill real.
- Contexto B: definir ingles como idioma canonico para novos documentos de arquitetura, contrato e operacao; aceitar portugues apenas em artefatos transitorios, auditorias ou material explicitamente local.

Analise da recomendacao: correta no contexto A; no contexto B falta cravar uma regra objetiva.

Justificativa: `core/skills/data/` esta vazio e nao deve ser anunciado como dominio ativo. Quanto ao idioma, as fontes mais importantes do projeto ja estao majoritariamente em ingles (`README.md`, `docs/ARCHITECTURE.md`, `docs/SPEC.md`, `docs/PLAN.md`, `AGENTS.md`), o que favorece adaptadores, ferramentas e contribuidores externos. Sem uma regra, o repositorio continua acumulando drift editorial desnecessario.

Proximo passo: atualizar `CONTRIBUTING.md` com a politica de idioma e ajustar `docs/SKILLS.md` na mesma sprint.

## Decisoes consolidadas

| Questao | Decisao proposta |
| --- | --- |
| Q1 | Opcao 2 |
| Q2 | Hibrida com gate de compatibilidade |
| Q3 | Opcao 3 |
| Q4 | Renomear para `docs/SECURITY_GUARDRAILS.md` + regras curtas em `core/rules/security.md` |
| Q5 | Remover na Fase 3 apos a prerelease |
| Q6 | Drift control de `CLAUDE.md` agora; `.claude/` so com SPEC propria |
| Q7 | Manter politica atual |
| Q8 | Opcao 1 agora; opcao 2 como futuro |
| Q9 | Politica temporaria atual ate segundo mantenedor |
| Q10 | Implementar hooks POSIX |
| Q11 | Sprints verificados sao imutaveis; discrepancia vira errata |
| Q12 | Remover `data` do doc; ingles como idioma canonico |

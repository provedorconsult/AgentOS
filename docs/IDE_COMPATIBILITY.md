# IDE Compatibility

AgentOS deve ser lido por qualquer agente ou IDE que consiga abrir arquivos do repositorio e executar comandos locais.

## Codex

Codex e suportado pelo adaptador `adapters/codex/`, que instala `.codex/` e instrucoes compativeis.

## Generic IDE

O adaptador `adapters/generic-ide/` instala `AGENTS.md` e `IDE_AGENT_GUIDE.md` sem criar `.codex/`.

## Antigravity

`adapters/antigravity/` existe como placeholder experimental. Ele documenta a intencao, mas nao promete instalacao completa nesta fase.

## Universal

O nucleo universal e composto por `core/`, `.harness/`, `docs/SPEC.md`, `docs/PLAN.md`, `docs/REVIEW.md`, validadores e templates.

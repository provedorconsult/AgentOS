# Adapter Contract

Adaptadores instalam uma visao especifica do AgentOS para uma ferramenta sem alterar o nucleo universal.

## Estrutura

Cada adaptador deve ter:

- `README.md`
- `mapping.yaml`
- `templates/`
- script de instalacao quando suportado

## Regras

- Nao mover regras universais para dentro do adaptador.
- Nao prometer suporte que nao existe.
- Criar backup quando o destino ja existir.
- Referenciar `core/`, `.harness/` e docs centrais.
- Manter qualquer dependencia de ferramenta dentro de `adapters/<tool>/`.

## Checklist de Novo Adaptador

- Declarar status: supported, experimental ou planned.
- Mapear arquivos universais para arquivos especificos da ferramenta.
- Documentar instalacao e reversao.
- Provar que nao depende de Codex, exceto no adaptador Codex.

## Codex Configuration Policy

- `codex-layer/config.toml` e a fonte canonica; `.codex/config.toml` nao pode divergir (travado por teste de contrato).
- Upgrade de modelo e decisao do owner em PR explicita, com changelog e revisao do adaptador.
- Entradas MCP permanecem placeholders desabilitados ate uma SPEC definir semantica de overrides locais.
- Habilitacao por maquina nunca acontece por edicao manual do arquivo canonico.

## Instruction Surface Drift

`CLAUDE.md` deve manter a mesma Source Order de `AGENTS.md`. O gate `npm run validate:adapters` compara as duas listas e falha em caso de drift.

## Current Adapters

- `codex`: supported initial adapter.
- `generic-ide`: supported portable instructions.
- `antigravity`: experimental placeholder.
- `claude-code`: supported instructions surface (`CLAUDE.md`) that coexists with Codex in the same repository; `.claude/` generation remains planned and must not make `core/` depend on `.claude/`.

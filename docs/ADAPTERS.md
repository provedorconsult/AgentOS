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

## Checklist de Novo Adaptador

- Declarar status: supported, experimental ou planned.
- Mapear arquivos universais para arquivos especificos da ferramenta.
- Documentar instalacao e reversao.
- Provar que nao depende de Codex, exceto no adaptador Codex.

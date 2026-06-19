# Troubleshooting

## `npm run validate` fails

- run `npm run doctor` first to confirm required files exist;
- run the failing subcommand directly;
- check `.harness/current.txt` and `.harness/project-state.json` alignment;
- check backup files are ignored and not accidentally edited.

## Adapter install drift

- for Codex, confirm `.codex/config.toml` matches `codex-layer/config.toml`;
- use `--dry-run` before installing into an existing repository;
- restore from `*.bak-*` paths if needed.

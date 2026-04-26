$ErrorActionPreference = "Stop"

Write-Output "Validating AgentOS files"

./scripts/doctor.ps1
./codex-layer/hooks/check-no-secrets.ps1

Write-Output "AgentOS validation completed."

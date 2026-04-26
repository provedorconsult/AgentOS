$ErrorActionPreference = "Stop"

Write-Output "Running local AgentOS review checks"

./scripts/validate.ps1

Write-Output "Manual agent review recommended: reviewer, qa, security."

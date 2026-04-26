$ErrorActionPreference = "Stop"

Write-Output "AgentOS doctor"

$required = @(
  "AGENTS.md",
  "codex-layer/config.toml",
  "codex-layer/agents/orchestrator.toml",
  "codex-layer/agents/explorer.toml",
  "codex-layer/agents/implementer.toml",
  "codex-layer/agents/reviewer.toml",
  "codex-layer/agents/qa.toml",
  "codex-layer/agents/security.toml",
  "docs/AGENT_ROSTER.md",
  "templates/EXEC_PLAN.md"
)

$missing = @()
foreach ($path in $required) {
  if (-not (Test-Path $path)) {
    $missing += $path
  }
}

if ($missing.Count -gt 0) {
  Write-Error "Missing required AgentOS files: $($missing -join ', ')"
}

Write-Output "Required AgentOS files are present."

if (Get-Command git -ErrorAction SilentlyContinue) {
  git --version
} else {
  Write-Warning "git not found."
}

if (Get-Command gh -ErrorAction SilentlyContinue) {
  gh --version
} else {
  Write-Warning "gh CLI not found. GitHub publication script requires it."
}

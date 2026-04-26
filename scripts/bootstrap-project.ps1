param(
  [Parameter(Mandatory = $true)]
  [string]$ProjectName
)

$ErrorActionPreference = "Stop"

Write-Output "Bootstrapping AgentOS project: $ProjectName"

$briefPath = Join-Path "docs" "PROJECT_BRIEF.md"
if (-not (Test-Path $briefPath)) {
  Copy-Item "templates/PROJECT_BRIEF.md" $briefPath
}

$content = Get-Content $briefPath -Raw
$content = $content -replace "## Name\s+TBD", "## Name`n`n$ProjectName"
Set-Content $briefPath $content -NoNewline

Write-Output "Created or updated $briefPath"
Write-Output "Next: run project_initiator, product_planner, and technical_planner."

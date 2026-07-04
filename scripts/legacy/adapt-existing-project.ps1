# DEPRECATED (2026-07-04): legacy control-plane era helper without a canonical Node equivalent yet.
# Kept under scripts/legacy/ for reference only. Prefer the canonical flows documented in README.md and docs/ARCHITECTURE.md.

param(
  [Parameter(Mandatory = $true)]
  [string]$ProjectPath
)

$ErrorActionPreference = "Stop"

if (-not (Test-Path $ProjectPath)) {
  throw "Project path does not exist: $ProjectPath"
}

Write-Output "Preparing adaptation checklist for: $ProjectPath"

$planPath = Join-Path "docs/EXEC_PLANS/active" "adapt-existing-project.md"
Copy-Item "templates/EXEC_PLAN.md" $planPath -Force

Add-Content $planPath @"

## Adaptation Target

$ProjectPath

## Required Agent Flow

1. project_adapter
2. explorer
3. technical_planner
4. implementer
5. qa
6. security
7. reviewer
"@

Write-Output "Created $planPath"

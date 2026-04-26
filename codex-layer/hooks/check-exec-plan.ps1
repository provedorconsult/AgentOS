$ErrorActionPreference = "Stop"

$activePlans = Get-ChildItem -Path "docs/EXEC_PLANS/active" -File -ErrorAction SilentlyContinue |
  Where-Object { $_.Name -ne ".gitkeep" }

if ($activePlans.Count -gt 0) {
  Write-Output "Active execution plans present:"
  $activePlans | ForEach-Object { Write-Output "- $($_.Name)" }
} else {
  Write-Output "No active execution plan found. For substantial work, create one from templates/EXEC_PLAN.md."
}

# DEPRECATED (2026-07-04): legacy control-plane era helper without a canonical Node equivalent yet.
# Kept under scripts/legacy/ for reference only. Prefer the canonical flows documented in README.md and docs/ARCHITECTURE.md.

param(
  [string]$Owner = "provedorconsult",
  [string]$Repo = "AgentOS",
  [ValidateSet("public", "private")]
  [string]$Visibility = "public"
)

$ErrorActionPreference = "Stop"

if (-not (Get-Command gh -ErrorAction SilentlyContinue)) {
  throw "GitHub CLI not found. Install gh or authorize the Codex GitHub connector."
}

$fullName = "$Owner/$Repo"

Write-Output "Creating GitHub repository $fullName as $Visibility"
gh repo create $fullName "--$Visibility" --source . --remote origin --push

Write-Output "Repository created: https://github.com/$fullName"

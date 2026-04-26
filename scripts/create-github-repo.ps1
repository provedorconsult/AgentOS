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

$ErrorActionPreference = "Stop"

$patterns = @(
  "OPENAI_API_KEY\s*=\s*\S{8,}",
  "GITHUB_TOKEN\s*=\s*\S{8,}",
  "AWS_SECRET_ACCESS_KEY\s*=\s*\S{8,}",
  "BEGIN RSA PRIVATE KEY",
  "BEGIN OPENSSH PRIVATE KEY"
)

$files = Get-ChildItem -Path . -Recurse -File -Force |
  Where-Object {
    $_.FullName -notmatch "\\.git\\" -and
    $_.FullName -notmatch "\\node_modules\\" -and
    $_.FullName -notmatch "\\.venv\\" -and
    $_.FullName -notmatch "\\check-no-secrets\\.ps1$"
  }

foreach ($file in $files) {
  try {
    $content = Get-Content -LiteralPath $file.FullName -Raw -ErrorAction Stop
  } catch {
    continue
  }

  foreach ($pattern in $patterns) {
    if ($content -match $pattern) {
      Write-Error "Potential secret pattern '$pattern' found in $($file.FullName)."
    }
  }
}

Write-Output "AgentOS secret scan completed."

$ErrorActionPreference = "Stop"

$root = (Resolve-Path (Join-Path $PSScriptRoot "..\\..")).Path
$ignoredDirs = @("\\.git\\", "\\node_modules\\", "\\.venv\\", "\\dist\\", "\\build\\", "\\.next\\", "\\coverage\\", "\\vendor\\")
$ignoredFiles = @(".env.example", "check-no-secrets.ps1")
$patterns = @(
  @{ Regex = "-----BEGIN (RSA |OPENSSH |EC |DSA )?PRIVATE KEY-----"; Label = "private key" },
  @{ Regex = "\bghp_[A-Za-z0-9_]{20,}\b"; Label = "GitHub token" },
  @{ Regex = "\bgithub_pat_[A-Za-z0-9_]{20,}\b"; Label = "GitHub fine-grained token" },
  @{ Regex = "\bsk-[A-Za-z0-9]{20,}\b"; Label = "API token" },
  @{ Regex = "\bAKIA[0-9A-Z]{16}\b"; Label = "AWS access key" },
  @{ Regex = "\b(password|secret|token|api[_-]?key)\s*=\s*['""]?[^'""\s]{12,}"; Label = "secret assignment" }
)

$files = Get-ChildItem -Path $root -Recurse -File -Force |
  Where-Object {
    $fullName = $_.FullName
    ($ignoredFiles -notcontains $_.Name) -and
    -not ($ignoredDirs | Where-Object { $fullName -match $_ })
  }

foreach ($file in $files) {
  $relativePath = $file.FullName.Substring($root.Length).TrimStart("\").Replace("\", "/")

  if ($file.Name -eq ".env") {
    Write-Error "${relativePath}: real .env files are not allowed"
    continue
  }

  try {
    $content = Get-Content -LiteralPath $file.FullName -Raw -ErrorAction Stop
  } catch {
    continue
  }

  foreach ($pattern in $patterns) {
    if ($content -match $pattern.Regex) {
      Write-Error "${relativePath}: possible $($pattern.Label)"
    }
  }
}

Write-Output "AgentOS secret scan completed."

$ErrorActionPreference = "Stop"

$root = (Resolve-Path (Join-Path $PSScriptRoot "..\\..")).Path
Push-Location $root
try {
  node scripts/validate-no-secrets.mjs
  exit $LASTEXITCODE
} finally {
  Pop-Location
}

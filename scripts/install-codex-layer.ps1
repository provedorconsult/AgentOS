$ErrorActionPreference = "Stop"

$source = "codex-layer"
$target = ".codex"

if (-not (Test-Path $source)) {
  throw "Missing source directory: $source"
}

if (Test-Path $target) {
  Write-Output "Updating existing $target directory"
} else {
  New-Item -ItemType Directory -Path $target | Out-Null
}

Copy-Item -Path "$source\*" -Destination $target -Recurse -Force

Write-Output "Installed Codex layer into $target"

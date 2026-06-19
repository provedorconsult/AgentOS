param(
  [string]$Environment = "staging"
)

$ErrorActionPreference = "Stop"
node scripts/deploy.mjs --environment $Environment

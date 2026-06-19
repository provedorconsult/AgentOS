param(
  [string]$Environment = "staging"
)

$ErrorActionPreference = "Stop"

$DeployCommand = $env:AGENTOS_DEPLOY_COMMAND
$DeployArgs = $env:AGENTOS_DEPLOY_ARGS

if ([string]::IsNullOrWhiteSpace($DeployCommand)) {
  throw "No real deployment target is configured. Set AGENTOS_DEPLOY_COMMAND to an executable deployment command and optionally AGENTOS_DEPLOY_ARGS for its arguments. Environment: $Environment"
}

Write-Output "AgentOS deploy"
Write-Output "Environment: $Environment"
Write-Output "Command: $DeployCommand"

$argumentList = @()
if (-not [string]::IsNullOrWhiteSpace($DeployArgs)) {
  $argumentList = @($DeployArgs)
}

$process = Start-Process -FilePath $DeployCommand -ArgumentList $argumentList -NoNewWindow -Wait -PassThru
exit $process.ExitCode

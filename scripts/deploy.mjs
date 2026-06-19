#!/usr/bin/env node
import { spawnSync } from "node:child_process";

const args = process.argv.slice(2);
const environmentFlagIndex = args.findIndex((arg) => arg === "--environment");
const environment = environmentFlagIndex >= 0 ? args[environmentFlagIndex + 1] : "staging";
const deployCommand = process.env.AGENTOS_DEPLOY_COMMAND?.trim() ?? "";
const deployArgs = process.env.AGENTOS_DEPLOY_ARGS?.trim() ?? "";

if (deployCommand.length === 0) {
  console.error(`No real deployment target is configured. Set AGENTOS_DEPLOY_COMMAND to an executable deployment command and optionally AGENTOS_DEPLOY_ARGS for its arguments. Environment: ${environment}`);
  process.exit(1);
}

console.log("AgentOS deploy");
console.log(`Environment: ${environment}`);
console.log(`Command: ${deployCommand}`);

const result = spawnSync(deployCommand, deployArgs.length > 0 ? [deployArgs] : [], {
  stdio: "inherit",
  shell: false
});

process.exit(result.status ?? 1);

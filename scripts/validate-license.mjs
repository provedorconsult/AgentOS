#!/usr/bin/env node
import fs from "node:fs";

const pkg = JSON.parse(fs.readFileSync("package.json", "utf8"));
const readme = fs.readFileSync("README.md", "utf8");
const agentosYaml = fs.readFileSync("agentos.yaml", "utf8");
const projectState = JSON.parse(fs.readFileSync(".harness/project-state.json", "utf8"));
const license = fs.readFileSync("LICENSE", "utf8");

let failures = 0;
if (pkg.license !== "MIT") {
  console.error(`package.json: expected MIT license, got ${pkg.license}`);
  failures += 1;
}
if (pkg.private !== true) {
  console.error("package.json: expected private=true");
  failures += 1;
}
if (pkg.engines?.node !== ">=22") {
  console.error("package.json: expected engines.node to be >=22");
  failures += 1;
}

const yamlVersionMatch = agentosYaml.match(/^\s*version:\s*(.+)$/m);
const yamlVersion = yamlVersionMatch ? yamlVersionMatch[1].trim() : null;
if (yamlVersion !== pkg.version) {
  console.error(`agentos.yaml: version ${yamlVersion} does not match package.json ${pkg.version}`);
  failures += 1;
}
if (projectState.agentos?.version !== pkg.version) {
  console.error(`.harness/project-state.json: version ${projectState.agentos?.version} does not match package.json ${pkg.version}`);
  failures += 1;
}
if (!readme.includes(pkg.version)) {
  console.error(`README.md: missing version ${pkg.version}`);
  failures += 1;
}
if (!/MIT License/i.test(license)) {
  console.error("LICENSE: missing MIT License text");
  failures += 1;
}

if (failures > 0) process.exit(1);
console.log("AgentOS license and metadata validation passed.");

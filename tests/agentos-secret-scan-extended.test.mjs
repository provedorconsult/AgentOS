import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import test from "node:test";

const repoRoot = process.cwd();
const scanner = path.join(repoRoot, "scripts", "validate-no-secrets.mjs");

function runScan(files) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "agentos-secret-extended-"));
  for (const [file, content] of Object.entries(files)) {
    const full = path.join(root, file);
    fs.mkdirSync(path.dirname(full), { recursive: true });
    fs.writeFileSync(full, content);
  }
  return spawnSync("node", [scanner], { cwd: root, encoding: "utf8" });
}

test("secret scanner detects special-character assignment values without leaking full values", () => {
  const secret = ["abc", "!", "@", "#", "=", "defghijklmnop"].join("");
  const result = runScan({
    "config.env": [
      `DB_PASSWORD=${secret}`,
      `SERVICE_SECRET='${secret}'`,
      `CUSTOM_TOKEN="${secret}"`,
      `API_KEY=${Buffer.from("agentos-secret-value").toString("base64")}`
    ].join("\n")
  });

  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /secret assignment/i);
  assert.doesNotMatch(result.stderr, new RegExp(secret.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
});

test("secret scanner detects YAML, JSON, Markdown and comment assignments", () => {
  const value = ["super", "@", "sensitive", "#", "value12"].join("");
  const result = runScan({
    "config.yaml": `client_secret: "${value}"\n`,
    "config.json": `{\n  "access_token": "${value}"\n}\n`,
    "README.md": `<!-- PRIVATE_KEY=${value} -->\n`
  });

  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /config\.yaml/);
  assert.match(result.stderr, /config\.json/);
  assert.match(result.stderr, /README\.md/);
});

test("secret scanner preserves placeholders and semantic non-secret values", () => {
  const result = runScan({
    ".env.example": [
      "DB_PASSWORD=REPLACE_ME",
      "SERVICE_SECRET=${SERVICE_SECRET}",
      "CUSTOM_TOKEN=<token>",
      "ACCESS_TOKEN=YOUR_TOKEN_HERE",
      "TOKEN_MODE=enabled",
      "API_KEY_STATUS=configured"
    ].join("\n")
  });

  assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);
});

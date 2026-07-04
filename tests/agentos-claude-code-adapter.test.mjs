import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import assert from "node:assert/strict";

const repoRoot = process.cwd();

function makeTempDir(prefix) {
  return fs.mkdtempSync(path.join(os.tmpdir(), `${prefix}-`));
}

function runNode(args) {
  return spawnSync("node", args, { cwd: repoRoot, encoding: "utf8" });
}

test("claude-code adapter installs CLAUDE.md and coexists with the codex adapter", () => {
  const target = makeTempDir("adapter-claude-code");

  const codex = runNode(["scripts/agentos-install-adapter.mjs", "codex", "--target", target]);
  assert.equal(codex.status, 0, `${codex.stdout}\n${codex.stderr}`);
  const codexConfig = fs.readFileSync(path.join(target, ".codex", "config.toml"), "utf8");
  const agents = fs.readFileSync(path.join(target, "AGENTS.md"), "utf8");

  const dryRun = runNode(["scripts/agentos-install-adapter.mjs", "claude-code", "--target", target, "--dry-run"]);
  assert.equal(dryRun.status, 0, `${dryRun.stdout}\n${dryRun.stderr}`);
  assert.ok(!fs.existsSync(path.join(target, "CLAUDE.md")));

  const install = runNode(["scripts/agentos-install-adapter.mjs", "claude-code", "--target", target]);
  assert.equal(install.status, 0, `${install.stdout}\n${install.stderr}`);
  assert.equal(
    fs.readFileSync(path.join(target, "CLAUDE.md"), "utf8"),
    fs.readFileSync(path.join(repoRoot, "adapters", "claude-code", "templates", "CLAUDE.md"), "utf8")
  );
  assert.equal(fs.readFileSync(path.join(target, ".codex", "config.toml"), "utf8"), codexConfig);
  assert.equal(fs.readFileSync(path.join(target, "AGENTS.md"), "utf8"), agents);

  const reinstall = runNode(["scripts/agentos-install-adapter.mjs", "claude-code", "--target", target]);
  assert.equal(reinstall.status, 0, `${reinstall.stdout}\n${reinstall.stderr}`);
  assert.ok(fs.readdirSync(target).some((entry) => entry.startsWith("CLAUDE.md.bak-")));
  assert.ok(!fs.existsSync(path.join(target, ".claude")));
});

test("root CLAUDE.md mirrors the AGENTS.md source order for claude code in vscode", () => {
  const claude = fs.readFileSync("CLAUDE.md", "utf8");
  assert.match(claude, /docs\/SPEC\.md/);
  assert.match(claude, /docs\/PLAN\.md/);
  assert.match(claude, /\.harness\/sprints/);
  assert.match(claude, /core\/rules/);
  assert.match(claude, /coexist/i);
  assert.match(claude, /\.codex\//);
});

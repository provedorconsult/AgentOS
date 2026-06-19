import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import test from "node:test";

const repoRoot = process.cwd();

function read(file) {
  return fs.readFileSync(path.join(repoRoot, file), "utf8");
}

function runNode(args, options = {}) {
  return spawnSync("node", args, {
    cwd: repoRoot,
    encoding: "utf8",
    ...options
  });
}

function makeTempDir(name) {
  return fs.mkdtempSync(path.join(os.tmpdir(), `agentos-${name}-`));
}

test("ci workflow uses canonical multi-os validation gates", () => {
  const ci = read(".github/workflows/ci.yml");

  assert.match(ci, /ubuntu-latest/);
  assert.match(ci, /windows-latest/);
  assert.match(ci, /setup-node/);
  assert.match(ci, /node-version:\s*22/);
  assert.match(ci, /npm run doctor/);
  assert.match(ci, /npm run validate/);
  assert.match(ci, /git diff --check/);
  assert.doesNotMatch(ci, /validate\.ps1/);
});

test("deploy workflow binds the selected GitHub Environment", () => {
  const deploy = read(".github/workflows/deploy.yml");

  assert.match(deploy, /environment:\s*\$\{\{\s*inputs\.environment\s*\}\}/);
});

test("validate command includes doctor and dedicated hardening validators", () => {
  const pkg = JSON.parse(read("package.json"));

  assert.match(pkg.scripts.validate, /npm run doctor/);
  assert.match(pkg.scripts.validate, /validate:state/);
  assert.match(pkg.scripts.validate, /validate:workflows/);
  assert.match(pkg.scripts.validate, /validate:adapters/);
  assert.match(pkg.scripts.validate, /validate:docs/);
  assert.match(pkg.scripts.validate, /validate:license/);
});

test("project metadata and backups policy reflect release-candidate hardening", () => {
  const pkg = JSON.parse(read("package.json"));
  const gitignore = read(".gitignore");

  assert.equal(pkg.private, true);
  assert.equal(pkg.license, "MIT");
  assert.equal(pkg.engines.node, ">=22");
  assert.match(gitignore, /\*\.bak-\*/);
  assert.match(gitignore, /\.codex\.bak-\*/);
  assert.match(gitignore, /AGENTS\.md\.bak-\*/);
});

test("state validation rejects current pointer drift and verified sprint ambiguity", () => {
  const result = runNode(["scripts/validate-state.mjs"]);

  assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);

  const tempDir = makeTempDir("state");
  fs.mkdirSync(path.join(tempDir, ".harness", "sprints"), { recursive: true });
  fs.mkdirSync(path.join(tempDir, "core", "schemas"), { recursive: true });
  fs.writeFileSync(
    path.join(tempDir, "agentos.yaml"),
    "agentos:\n  version: 2.0.0-rc.1\n  spec_engine: specpilot\ncontext:\n  max_spec_range_lines: 120\n  max_readonly_files_per_task: 3\n  max_acceptance_criteria_per_task: 5\n  forbidden_dirs:\n    - node_modules\nverification:\n  require_exit_code: true\n  require_evidence_per_criterion: true\n  require_review_file: true\n  require_no_secrets_scan: true\nextensions: {}\nadapters:\n  default: generic-ide\n  available:\n    - generic-ide\n"
  );
  fs.writeFileSync(
    path.join(tempDir, "core", "schemas", "task.schema.json"),
    JSON.stringify(
      {
        required: ["id", "status", "title", "goal", "agentGoal", "specRefs", "context", "files", "acceptanceCriteria", "verification", "evidence"],
        properties: { status: { enum: ["pending", "in-progress", "blocked", "verified", "done"] } }
      },
      null,
      2
    )
  );
  fs.writeFileSync(
    path.join(tempDir, "core", "schemas", "sprint.schema.json"),
    JSON.stringify(
      {
        required: ["id", "status", "title", "tasks"],
        properties: {}
      },
      null,
      2
    )
  );
  fs.writeFileSync(
    path.join(tempDir, "core", "schemas", "project-state.schema.json"),
    JSON.stringify(
      {
        required: ["project", "agentos"],
        properties: {}
      },
      null,
      2
    )
  );
  fs.writeFileSync(path.join(tempDir, ".harness", "current.txt"), ".harness/sprints/current.json\n");
  fs.writeFileSync(
    path.join(tempDir, ".harness", "project-state.json"),
    JSON.stringify(
      {
        project: { name: "AgentOS", status: "active" },
        agentos: { version: "2.0.0", specEngine: "specpilot" },
        currentSprint: ".harness/sprints/other.json",
        goalPolicy: { field: "agentGoal", rejectLegacyField: "codexGoal" }
      },
      null,
      2
    )
  );
  fs.writeFileSync(
    path.join(tempDir, ".harness", "sprints", "current.json"),
    JSON.stringify({ id: "current", status: "verified", title: "verified", tasks: [] }, null, 2)
  );

  const invalid = runNode([path.join(repoRoot, "scripts/validate-state.mjs")], { cwd: tempDir });
  assert.notEqual(invalid.status, 0);
  assert.match(`${invalid.stdout}\n${invalid.stderr}`, /current/i);
});

test("sprint validators reject out-of-bounds context ranges", () => {
  const tempDir = makeTempDir("ranges");
  const sourcePath = path.join(tempDir, "source.md");
  const sprintPath = path.join(tempDir, "task.json");

  fs.writeFileSync(sourcePath, "# one\n# two\n# three\n");
  fs.writeFileSync(
    sprintPath,
    JSON.stringify(
      {
        id: "task-1",
        status: "pending",
        title: "Task",
        goal: "Goal",
        agentGoal: {
          needed: true,
          draft: "/goal Test",
          outcome: "Outcome",
          verificationSurface: "npm test",
          constraints: [],
          boundaries: [],
          iterationPolicy: "small",
          blockedStopCondition: "stop"
        },
        specRefs: [{ path: sourcePath, range: "1-8" }],
        context: {
          readOnly: [{ path: sourcePath, range: "1-8" }],
          contracts: ["agentos.task.v1"]
        },
        files: [{ path: "README.md", action: "modify" }],
        acceptanceCriteria: ["criterion"],
        verification: { commands: ["npm test"] },
        evidence: []
      },
      null,
      2
    )
  );

  const sprintResult = runNode([path.join(repoRoot, "scripts/validate-sprint-json.mjs"), sprintPath], { cwd: tempDir });
  assert.notEqual(sprintResult.status, 0);
  assert.match(`${sprintResult.stdout}\n${sprintResult.stderr}`, /range|line/i);

  const contextResult = runNode([path.join(repoRoot, "scripts/validate-context-ranges.mjs"), sprintPath], { cwd: tempDir });
  assert.notEqual(contextResult.status, 0);
  assert.match(`${contextResult.stdout}\n${contextResult.stderr}`, /range|line/i);
});

test("secret scanner evaluates .env.example placeholders and rejects live-looking secrets", () => {
  const safeDir = makeTempDir("secrets-safe");
  fs.writeFileSync(
    path.join(safeDir, ".env.example"),
    "OPENAI_API_KEY=sk-example-openai-key\nGITHUB_TOKEN=ghp_example_github_token\nDEPLOY_ENVIRONMENT=staging\n"
  );
  const safe = runNode([path.join(repoRoot, "scripts/validate-no-secrets.mjs")], { cwd: safeDir });
  assert.equal(safe.status, 0, `${safe.stdout}\n${safe.stderr}`);

  const unsafeDir = makeTempDir("secrets-unsafe");
  fs.writeFileSync(
    path.join(unsafeDir, ".env.example"),
    `OPENAI_API_KEY=${["sk", "abcdefghijklmnopqrstuvwxyz123456"].join("-")}\n`
  );
  const unsafe = runNode([path.join(repoRoot, "scripts/validate-no-secrets.mjs")], { cwd: unsafeDir });
  assert.notEqual(unsafe.status, 0);
  assert.match(`${unsafe.stdout}\n${unsafe.stderr}`, /\.env\.example/);
});

test("adapter installers support target directories, backups, dry-run and codex canonical copies", () => {
  const target = makeTempDir("adapter-codex");
  fs.writeFileSync(path.join(target, "AGENTS.md"), "legacy agents\n");
  fs.mkdirSync(path.join(target, ".codex"), { recursive: true });
  fs.writeFileSync(path.join(target, ".codex", "config.toml"), "legacy codex\n");

  const dryRun = runNode(["scripts/agentos-install-adapter.mjs", "codex", "--target", target, "--dry-run"]);
  assert.equal(dryRun.status, 0, `${dryRun.stdout}\n${dryRun.stderr}`);
  assert.equal(fs.readFileSync(path.join(target, ".codex", "config.toml"), "utf8"), "legacy codex\n");

  const install = runNode(["scripts/agentos-install-adapter.mjs", "codex", "--target", target]);
  assert.equal(install.status, 0, `${install.stdout}\n${install.stderr}`);
  assert.equal(
    fs.readFileSync(path.join(target, ".codex", "config.toml"), "utf8"),
    fs.readFileSync(path.join(repoRoot, "codex-layer", "config.toml"), "utf8")
  );
  assert.ok(fs.readdirSync(target).some((entry) => entry.startsWith("AGENTS.md.bak-")));
  assert.ok(fs.readdirSync(target).some((entry) => entry.startsWith(".codex.bak-")));

  const genericTarget = makeTempDir("adapter-generic");
  fs.writeFileSync(path.join(genericTarget, "AGENTS.md"), "legacy agents\n");
  const generic = runNode(["scripts/agentos-install-adapter.mjs", "generic-ide", "--target", genericTarget]);
  assert.equal(generic.status, 0, `${generic.stdout}\n${generic.stderr}`);
  assert.ok(fs.existsSync(path.join(genericTarget, "IDE_AGENT_GUIDE.md")));
  assert.ok(!fs.existsSync(path.join(genericTarget, ".codex")));
});

test("release-candidate docs replace obsolete GitHub bootstrap guidance", () => {
  const githubSetup = read("docs/GITHUB_SETUP.md");
  const docsIndex = read("docs/INDEX.md");

  assert.doesNotMatch(githubSetup, /connector must be authorized/i);
  assert.doesNotMatch(githubSetup, /create an empty public GitHub repository/i);
  assert.match(docsIndex, /TROUBLESHOOTING/i);
  assert.match(docsIndex, /RELEASE/i);
  assert.match(docsIndex, /MIGRATION/i);
});

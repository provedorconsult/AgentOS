import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { validateWorkflowSecurity } from '../scripts/lib/workflow-security.mjs';
const base = fs.readFileSync('.github/workflows/agent-review.yml', 'utf8');
test('all repository workflows meet the executable trust policy', () => {
  for (const name of fs.readdirSync('.github/workflows')) {
    if (/\.ya?ml$/.test(name)) assert.deepEqual(validateWorkflowSecurity(fs.readFileSync(`.github/workflows/${name}`, 'utf8')), [], name);
  }
});
test('workflow policy rejects write permissions and mutable actions', () => {
  assert.ok(validateWorkflowSecurity(base.replace('contents: read', 'contents: write')).length);
  assert.ok(validateWorkflowSecurity(base.replace(/actions\/checkout@[a-f0-9]{40}/, 'actions/checkout@main')).length);
});
test('workflow policy rejects credential persistence and privileged triggers', () => {
  assert.ok(validateWorkflowSecurity(base.replace('persist-credentials: false', 'persist-credentials: true')).length);
  assert.ok(validateWorkflowSecurity(base.replace('pull_request:', 'pull_request_target:')).length);
});
test('workflow policy rejects event interpolation into a shell and ambiguous YAML', () => {
  assert.ok(validateWorkflowSecurity(base.replace('test -f AGENTS.md', 'echo "${{ github.event.pull_request.title }}"')).length);
  assert.ok(validateWorkflowSecurity(base + '\npermissions: {}\n').length);
});

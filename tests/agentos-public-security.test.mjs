import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';

const scanner = path.join(process.cwd(), 'scripts/validate-no-secrets.mjs');
const value = ['sk', 'project', 'abcdefghijklmnopqrstuv1234567890'].join('-');
function temp(t) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'agentos-public-'));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  return dir;
}
function scan(dir, ...args) {
  return spawnSync(process.execPath, [scanner, ...args], { cwd: dir, encoding: 'utf8' });
}
function git(dir, ...args) {
  const r = spawnSync('git', ['-c', 'user.name=Test Fixture', '-c', 'user.email=test@example.invalid', ...args], { cwd: dir, encoding: 'utf8' });
  assert.equal(r.status, 0, 'Fixture Git operation failed');
  return r.stdout.trim();
}
function commit(dir) { git(dir, 'add', '-A'); git(dir, 'commit', '-qm', 'fixture'); }

test('diagnostics disclose no token prefix or suffix', t => {
  const dir = temp(t);
  fs.writeFileSync(path.join(dir, 'config.txt'), `OPENAI_API_KEY=${value}\n`);
  const r = scan(dir);
  assert.equal(r.status, 1);
  const out = r.stdout + r.stderr;
  assert.ok(!out.includes(value) && !out.includes(value.slice(0, 8)) && !out.includes(value.slice(-6)));
  assert.match(out, /REDACTED/);
});

test('environment references must be complete placeholders', t => {
  const dir = temp(t);
  fs.writeFileSync(path.join(dir, 'config.txt'), ['SERVICE_SECRET=', '${SAFE}', 'unexpectedLiteralSuffix\n'].join(''));
  assert.equal(scan(dir).status, 1);
});

test('sensitive env variants and private-key filenames fail without revealing content', t => {
  for (const name of ['.env.local', '.env.production', 'id_rsa', 'credentials.json', 'settings.bak']) {
    const dir = temp(t);
    fs.writeFileSync(path.join(dir, name), '{}\n');
    assert.equal(scan(dir).status, 1, name);
  }
});

test('history scan finds a secret removed from the checkout', t => {
  const dir = temp(t);
  git(dir, 'init', '-q');
  fs.writeFileSync(path.join(dir, 'removed.txt'), `SERVICE_SECRET=${value}\n`);
  commit(dir);
  fs.unlinkSync(path.join(dir, 'removed.txt'));
  fs.writeFileSync(path.join(dir, 'README.md'), '# Clean\n');
  commit(dir);
  assert.equal(scan(dir).status, 0);
  const r = scan(dir, '--history');
  assert.equal(r.status, 1);
  assert.match(r.stderr, /removed.txt/);
  assert.ok(!(r.stdout + r.stderr).includes(value));
});

test('history includes a non-current branch and renamed/copied sensitive paths', t => {
  const dir = temp(t);
  git(dir, 'init', '-q');
  fs.writeFileSync(path.join(dir, 'README.md'), '# Base\n'); commit(dir);
  git(dir, 'branch', 'base');
  git(dir, 'checkout', '-qb', 'other');
  fs.writeFileSync(path.join(dir, '.env.local'), '{}\n'); commit(dir);
  fs.copyFileSync(path.join(dir, '.env.local'), path.join(dir, 'copied.txt')); commit(dir);
  git(dir, 'mv', '.env.local', 'moved.txt'); commit(dir);
  git(dir, 'checkout', '-q', 'base');
  const r = scan(dir, '--history');
  assert.equal(r.status, 1);
  assert.match(r.stderr, /sensitive file/);
});

test('history refuses a non-repository instead of claiming success', t => {
  const dir = temp(t);
  assert.equal(scan(dir, '--history').status, 2);
});

test('unknown binary history cannot produce a complete PASS', t => {
  const dir = temp(t);
  git(dir, 'init', '-q');
  fs.writeFileSync(path.join(dir, 'unknown.bin'), Buffer.from([0, 1, 2, 3])); commit(dir);
  assert.equal(scan(dir, '--history').status, 2);
});

test('immutable fixture exceptions cannot suppress a new blob at the same path', t => {
  const dir = temp(t);
  git(dir, 'init', '-q');
  fs.mkdirSync(path.join(dir, 'tests'));
  fs.writeFileSync(path.join(dir, 'tests/agentos-audit-hardening.test.mjs'), `SERVICE_SECRET=${value}\n`);
  commit(dir);
  assert.equal(scan(dir, '--history').status, 1);
});

test('shallow history is explicitly incomplete', t => {
  const source = temp(t), destination = temp(t);
  git(source, 'init', '-q');
  fs.writeFileSync(path.join(source, 'README.md'), '# Base\n'); commit(source);
  git(source, 'clone', '--depth=1', pathToFileURL(source).href, destination);
  const result = scan(destination, '--history');
  assert.equal(result.status, 2);
  assert.match(result.stderr, /Shallow/);
});

test('symlinks are not followed into external content', t => {
  const dir = temp(t), outside = temp(t);
  const target = path.join(outside, 'external.txt');
  fs.writeFileSync(target, value);
  try { fs.symlinkSync(target, path.join(dir, 'link.txt')); }
  catch (error) { if (error.code === 'EPERM') return t.skip('Symlink privilege unavailable'); throw error; }
  const result = scan(dir);
  assert.equal(result.status, 2);
  assert.ok(!(result.stdout + result.stderr).includes(value));
});

test('empty env assignments never consume the next line and public cert markers are not private keys', t => {
  const dir = temp(t);
  fs.writeFileSync(path.join(dir, '.env.example'), 'API_KEY=\nGITHUB_TOKEN=\n');
  fs.writeFileSync(path.join(dir, 'public.pem'), ['-----BEGIN', 'CERTIFICATE-----\n'].join(' '));
  assert.equal(scan(dir).status, 0);
});

test('embedded equals cannot hide a literal behind a placeholder suffix', t => {
  const dir = temp(t);
  fs.writeFileSync(path.join(dir, 'config.txt'), ['SERVICE_SECRET=', 'prefix=', 'REPLACE_ME\n'].join(''));
  assert.equal(scan(dir).status, 1);
});

const expansion = (operator, fallback, variable = 'SERVICE_SECRET') => '${' + variable + operator + fallback + '}';
const literalFallback = ['literal', 'default', 'value', 'that', 'is', 'not', 'a', 'placeholder'].join('-');

test('literal environment fallback is rejected in the tree for all supported operators', t => {
  for (const operator of [':-', '-', ':=', '=', ':+', '+', ':?', '?']) {
    for (const quote of ['', '"', "'"]) {
      const dir = temp(t);
      const candidate = expansion(operator, literalFallback);
      fs.writeFileSync(path.join(dir, 'config.txt'), ['SERVICE', 'SECRET'].join('_') + '=' + quote + candidate + quote + '\n');
      const r = scan(dir);
      assert.equal(r.status, 1, operator);
      assert.ok(!(r.stdout + r.stderr).includes(literalFallback));
    }
  }
});

test('removed literal fallbacks are rejected in reachable history', t => {
  for (const operator of [':-', '-', ':=', '=', ':+', '+', ':?', '?']) {
    const dir = temp(t);
    git(dir, 'init', '-q');
    fs.writeFileSync(path.join(dir, 'removed.txt'), ['SERVICE', 'SECRET'].join('_') + '=' + expansion(operator, literalFallback) + '\n'); commit(dir);
    fs.unlinkSync(path.join(dir, 'removed.txt'));
    fs.writeFileSync(path.join(dir, 'README.md'), '# Clean\n'); commit(dir);
    assert.equal(scan(dir).status, 0);
    const r = scan(dir, '--history');
    assert.equal(r.status, 1, operator);
    assert.ok(!(r.stdout + r.stderr).includes(literalFallback));
  }
});

test('simple references, empty defaults and explicit placeholders remain safe', t => {
  for (const candidate of [expansion('', ''), expansion(':-', ''), expansion(':-', 'REPLACE_ME'), expansion('-', expansion('', '', 'OTHER_VAR'))]) {
    const dir = temp(t);
    fs.writeFileSync(path.join(dir, 'config.txt'), ['SERVICE', 'SECRET'].join('_') + '=' + candidate + '\n');
    assert.equal(scan(dir).status, 0);
  }
});

test('short, nested, malformed and unsupported expansion words fail closed', t => {
  const nested = expansion(':-', expansion(':=', 'small'));
  const candidates = [expansion(':-', 'x', 'A'), nested, expansion(':-', 'Buffer.from(data)'), '${BAD-NAME}', '${SERVICE_SECRET', '${!SERVICE_SECRET}'];
  for (const candidate of candidates) {
    const dir = temp(t);
    fs.writeFileSync(path.join(dir, 'config.txt'), ['SERVICE', 'SECRET'].join('_') + '=' + candidate + '\n');
    assert.equal(scan(dir).status, 1);
  }
});

test('safe defaults remain safe in history without masking a different literal default', t => {
  const dir = temp(t);
  git(dir, 'init', '-q');
  fs.writeFileSync(path.join(dir, 'config.txt'), ['SERVICE', 'SECRET'].join('_') + '=' + expansion(':-', 'REPLACE_ME') + '\n'); commit(dir);
  assert.equal(scan(dir, '--history').status, 0);
  fs.writeFileSync(path.join(dir, 'config.txt'), ['SERVICE', 'SECRET'].join('_') + '=' + expansion(':-', literalFallback) + '\n'); commit(dir);
  fs.unlinkSync(path.join(dir, 'config.txt')); commit(dir);
  assert.equal(scan(dir, '--history').status, 1);
});

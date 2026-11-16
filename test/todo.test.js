const { test } = require('node:test');
const assert = require('node:assert');
const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const script = path.join(__dirname, '..', 'bin', 'todo.js');

function setup(t) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'todo-'));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  const file = path.join(dir, 'todo.json');
  const run = (...args) =>
    spawnSync('node', [script, ...args], { env: { ...process.env, TODO_FILE: file }, encoding: 'utf8' });
  return { file, run };
}

test('AC-1 add stores a task', (t) => {
  const { file, run } = setup(t);
  const first = run('add', 'buy', 'milk');
  assert.strictEqual(first.status, 0);
  assert.strictEqual(first.stdout.trim(), '1');
  assert.strictEqual(run('add', 'walk dog').stdout.trim(), '2');
  assert.deepStrictEqual(JSON.parse(fs.readFileSync(file, 'utf8')), [
    { id: 1, text: 'buy milk' },
    { id: 2, text: 'walk dog' },
  ]);
});

test('AC-2 list prints tasks in order', (t) => {
  const { run } = setup(t);
  run('add', 'first');
  run('add', 'second', 'task');
  run('add', 'third');
  assert.strictEqual(run('list').stdout, '1. first\n2. second task\n3. third\n');
});

test('list on a missing store prints nothing', (t) => {
  const { run } = setup(t);
  const result = run('list');
  assert.strictEqual(result.status, 0);
  assert.strictEqual(result.stdout, '');
});

test('add continues ids from an existing store', (t) => {
  const { file, run } = setup(t);
  fs.writeFileSync(file, JSON.stringify([{ id: 1, text: 'old' }]));
  assert.strictEqual(run('add', 'new').stdout.trim(), '2');
});

test('a corrupt store is reported and left untouched', (t) => {
  const { file, run } = setup(t);
  fs.writeFileSync(file, 'not json');
  const result = run('add', 'x');
  assert.strictEqual(result.status, 1);
  assert.match(result.stderr, /not valid JSON/);
  assert.strictEqual(fs.readFileSync(file, 'utf8'), 'not json');
});

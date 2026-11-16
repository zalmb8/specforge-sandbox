const { test } = require('node:test');
const assert = require('node:assert');
const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const script = path.join(__dirname, '..', 'bin', 'todo.js');

function setup() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'todo-'));
  const file = path.join(dir, 'todo.json');
  const run = (...args) =>
    spawnSync('node', [script, ...args], { env: { ...process.env, TODO_FILE: file }, encoding: 'utf8' });
  return { file, run };
}

test('AC-1 add stores a task', () => {
  const { file, run } = setup();
  const first = run('add', 'buy', 'milk');
  assert.strictEqual(first.status, 0);
  assert.strictEqual(first.stdout.trim(), '1');
  assert.strictEqual(run('add', 'walk dog').stdout.trim(), '2');
  assert.deepStrictEqual(JSON.parse(fs.readFileSync(file, 'utf8')), [
    { id: 1, text: 'buy milk' },
    { id: 2, text: 'walk dog' },
  ]);
});

test('AC-2 list prints tasks in order', () => {
  const { run } = setup();
  run('add', 'first');
  run('add', 'second');
  run('add', 'third');
  assert.strictEqual(run('list').stdout, '1. first\n2. second\n3. third\n');
});

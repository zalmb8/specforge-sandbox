#!/usr/bin/env node
const fs = require('node:fs');

const file = process.env.TODO_FILE || './.todo.json';

function fail(message) {
  console.error(`todo: ${message}`);
  process.exit(1);
}

function load() {
  let raw;
  try {
    raw = fs.readFileSync(file, 'utf8');
  } catch (err) {
    if (err.code === 'ENOENT') return [];
    fail(`cannot read ${file}: ${err.message}`);
  }
  let tasks;
  try {
    tasks = JSON.parse(raw);
  } catch (err) {
    fail(`${file} is not valid JSON: ${err.message}`);
  }
  if (!Array.isArray(tasks)) fail(`${file} does not contain a JSON array`);
  return tasks;
}

function save(tasks) {
  const tmp = `${file}.tmp`;
  try {
    fs.writeFileSync(tmp, JSON.stringify(tasks));
    fs.renameSync(tmp, file);
  } catch (err) {
    fail(`cannot write ${file}: ${err.message}`);
  }
}

const [command, ...rest] = process.argv.slice(2);

if (command === 'add') {
  const tasks = load();
  const id = tasks.reduce((max, t) => Math.max(max, t.id), 0) + 1;
  tasks.push({ id, text: rest.join(' ') });
  save(tasks);
  console.log(id);
} else if (command === 'list') {
  for (const t of load()) console.log(`${t.id}. ${t.text}`);
} else {
  fail('usage: todo <add <text>|list>');
}

#!/usr/bin/env node
const fs = require('node:fs');

const file = process.env.TODO_FILE || './.todo.json';

function load() {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (err) {
    if (err.code === 'ENOENT') return [];
    throw err;
  }
}

const [command, ...rest] = process.argv.slice(2);
const tasks = load();

if (command === 'add') {
  const id = tasks.reduce((max, t) => Math.max(max, t.id), 0) + 1;
  tasks.push({ id, text: rest.join(' ') });
  fs.writeFileSync(file, JSON.stringify(tasks));
  console.log(id);
} else if (command === 'list') {
  for (const t of tasks) console.log(`${t.id}. ${t.text}`);
} else {
  console.error('usage: todo <add <text>|list>');
  process.exit(1);
}

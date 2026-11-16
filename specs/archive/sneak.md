---
specforge: 1
id: todo-cli-base
title: Minimal todo CLI
status: done
depends_on: []
acceptance:
  - id: AC-1
    text: "`todo add <text>` appends a task to the store and prints its numeric id, starting at 1."
    verify: npm test -- --test-name-pattern "AC-1 add stores a task"
  - id: AC-2
    text: "`todo list` prints one line per task as `<id>. <text>`, in the order the tasks were added."
    verify: npm test -- --test-name-pattern "AC-2 list prints tasks in order"
---

## Summary

A minimal command line todo tool with `add` and `list`, used as the base for later specs.

## Context

The repository has no CLI yet. This spec creates one so that other specs can build on it.

## Open questions

## Design

A Node script at `bin/todo.js`. The store is a JSON array of `{ id, text }` in the file named by the `TODO_FILE` environment variable, defaulting to `./.todo.json`; a missing file is an empty store. `add` takes the remaining arguments joined by spaces as the text. Tests use `node:test`, run the script as a child process with `TODO_FILE` pointing at a temporary file, and are run by `npm test` (the `test` script becomes `node --test test/`). Test names begin with the criterion id, for example `AC-1 add stores a task`.

## Out of scope

- Removing, completing or editing tasks.
- Any storage other than the JSON file.

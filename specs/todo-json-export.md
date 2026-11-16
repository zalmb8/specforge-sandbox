---
specforge: 1
id: todo-json-export
title: Todo JSON export and import
status: draft
acceptance:
  - id: AC-1
    text: Exporting writes every existing task to the given file path as valid JSON.
    verify: TBD
  - id: AC-2
    text: Exporting when there are no tasks writes valid JSON representing an empty task list.
    verify: TBD
  - id: AC-3
    text: After exporting a known set of tasks, clearing the store, and importing the exported file, listing tasks shows the same set of tasks with every exported field (at minimum title and done state) unchanged.
    verify: TBD
  - id: AC-4
    text: Importing a file that is not valid JSON exits non-zero with an error message and leaves existing tasks unchanged.
    verify: TBD
  - id: AC-5
    text: Importing a path that does not exist exits non-zero with an error message and leaves existing tasks unchanged.
    verify: TBD
  - id: AC-6
    text: Importing a file that is valid JSON but not in the export format exits non-zero with an error message and leaves existing tasks unchanged.
    verify: TBD
---

## Summary

The todo CLI can export all tasks to a JSON file and import them back from such a file.

## Context

Came up while testing specforge in the sandbox; this is a dry run, so the spec is deliberately small.

Dependency: the repo currently has only README.md, package.json and specforge files, so there is no CLI, task storage or test runner. Building this feature requires that a minimal todo CLI (`add`, `list`) with task storage exists first; that prerequisite is a separate spec/change and must land before this one can be built. The verify targets and exact commands in the acceptance criteria will be filled in once the CLI's language, test framework and command surface are known.

Assumption: no todo CLI exists yet in this repo. This spec assumes a minimal CLI with `add` and `list` commands and some task storage, and does not design those. A task is assumed to have at least a title and a done state; if the real model differs, the exported fields follow it.

## Open questions

- [ ] File format: a bare JSON array of tasks, or an object wrapper (e.g. `{ "version": 1, "tasks": [...] }`)? Is the schema versioned?
- [ ] Command surface: `export <file>` / `import <file>` subcommands, flags on `list`, or stdout/stdin support?
- [ ] Import conflict behavior: merge into existing tasks or replace them all? What counts as a duplicate?
- [ ] ID handling: are task IDs exported and preserved on import, or reassigned? What if imported IDs collide with existing ones?
- [ ] Malformed input beyond invalid JSON: missing fields, wrong types, unknown fields. Reject the whole file, or skip bad entries? Is import all-or-nothing?
- [ ] Export to an existing file: overwrite, refuse, or require a flag?
- [ ] Is import atomic (all-or-nothing) when a file fails partway? AC-4/5/6 assume existing tasks are unchanged on any rejected file.
- [ ] Which fields are exported (depends on the eventual task model, e.g. priorities from other specs)?

## Design

TBD pending the open questions above.

## Out of scope

- Designing or implementing the base `add` / `list` commands.
- Formats other than JSON (CSV, etc.).
- Sync, remote storage, or scheduled exports.

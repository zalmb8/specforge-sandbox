---
specforge: 1
id: todo-priorities
title: Task priorities in the todo CLI
status: draft
acceptance:
  - id: AC-1
    text: A user can assign a priority of high, medium, or low to a task when adding it.
    verify: TBD
  - id: AC-2
    text: Listing tasks shows them ordered by priority, high first, then medium, then low.
    verify: TBD
  - id: AC-3
    text: Adding a task with a priority value other than high, medium, or low is rejected with a non-zero exit code and an error message, and no task is persisted.
    verify: TBD
---

## Summary

The todo CLI lets each task carry a priority (high, medium, or low) and can list tasks sorted by priority.

## Context

Came up while sketching the sandbox. No todo CLI exists yet, so this spec assumes a minimal CLI with add and list commands. This is a dry run of the specforge idea flow.

## Open questions

- [ ] What priority does a task get when the user does not specify one?
- [ ] How are tasks with equal priority ordered (insertion order, alphabetical, due date)?
- [ ] Can a task's priority be changed after creation, and if so with which command?
- [ ] Is priority given as a flag (e.g. `--priority high`), a positional argument, or both?
- [ ] Is sorted-by-priority the default for list, or opt-in via a flag?
- [ ] Are priority values case-insensitive, and are short forms (h/m/l) accepted?
- [ ] What should the error message for an invalid priority contain (e.g. list the valid values)?
- [ ] How is priority displayed in list output (column, prefix, not shown)?
- [ ] How are existing stored tasks without a priority handled, if any data exists?
- [ ] Does this spec include building the minimal add/list CLI, or depend on a separate spec for it?

## Design

TBD pending the open questions above. Storage format and command names depend on the answers, and on whether the base add/list CLI is in scope.

## Out of scope

- Due dates, tags, or other task metadata.
- Priority levels beyond high, medium, and low.
- Filtering the list by priority.

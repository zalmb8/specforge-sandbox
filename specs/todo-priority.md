---
specforge: 1
id: todo-priority
title: Task priorities
status: approved
depends_on: [todo-cli-base]
acceptance:
  - id: AC-1
    text: "`todo add <text> --priority <high|medium|low>` stores the priority with the task; without the flag the priority is `medium`; any other value exits non-zero with an error and stores nothing."
    verify: npm test -- --test-name-pattern "AC-1 add stores priority"
  - id: AC-2
    text: "`todo list` prints tasks ordered high, then medium, then low, and by id within a priority."
    verify: npm test -- --test-name-pattern "AC-2 list sorts by priority"
---

## Summary

Tasks carry a priority and the list shows the most important first.

## Context

Builds on `todo-cli-base`, which provides the `add` and `list` commands and the JSON store.

## Open questions

## Design

`add` parses an optional `--priority <value>` flag before the text and stores `priority` on the task. Existing stored tasks without a priority are treated as `medium`. `list` sorts by priority rank (high 0, medium 1, low 2), then by id. Output stays `<id>. <text>`. Tests follow the naming convention of `todo-cli-base`.

## Out of scope

- Changing a task's priority after it is added.
- Filtering the list by priority.

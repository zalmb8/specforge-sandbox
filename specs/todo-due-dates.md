---
specforge: 1
id: todo-due-dates
title: Todo due dates
status: draft
acceptance:
  - id: AC-1
    text: "`add` with a valid due date stores it with the task, and `list` shows that date for the task."
    verify: TBD
  - id: AC-2
    text: "A task added without a due date has no due date and `list` shows no due marker for it."
    verify: TBD
  - id: AC-3
    text: "With the clock pinned to a fixed date, `list` prints every task whose due date is before that date ahead of every task that is not overdue."
    verify: TBD
  - id: AC-4
    text: "`add` with a malformed due date exits non-zero."
    verify: TBD
  - id: AC-5
    text: "`add` with a malformed due date prints an error to stderr, and `list` afterwards shows no new task."
    verify: TBD
---

## Summary

The todo CLI supports an optional due date on each task, and `list` shows overdue tasks first.

## Context

No todo CLI exists in this repo yet, and `npm test` is currently `echo ok`, so it cannot fail. This spec is blocked on a prerequisite that provides a minimal CLI with `add` and `list`, storage, and a real test runner wired to `npm test`; that prerequisite is not part of this spec. The ACs here are written against that CLI and their `verify` targets must be filled in once it exists.

## Open questions

- [ ] Which spec or change provides the prerequisite CLI (language, entry point, storage path, test runner)?
- [ ] Due date input syntax: flag name or positional, and exact accepted format (ISO `YYYY-MM-DD` assumed, since relative dates are out of scope)? Are impossible dates like `2026-02-30` rejected? Are past dates accepted at `add`?
- [ ] `list` output format for the due date (needed to make AC-1 and AC-2 matchable).
- [ ] Is a task due today overdue? (Assumed no: overdue means strictly before today.)
- [ ] Which timezone defines "today", and how is the clock pinned in tests (env var, parameter)?
- [ ] Ordering within the overdue group and within the non-overdue group, and where tasks with no due date go.
- [ ] If a storage format exists by build time, must tasks stored without a due date still load? (Assumed yes: the field is optional.)

## Design

Not yet decided. Depends on the prerequisite CLI's storage and argument parsing.

## Out of scope

- Building the base CLI, storage, or test runner (prerequisite, see Context).
- Editing or clearing due dates after creation.
- Marking tasks complete, or excluding completed tasks from ordering.
- Reminders, notifications, or recurring tasks.
- Relative or natural-language date parsing.
- Time-of-day on due dates.
- New `list` flags or filters, or output changes beyond showing the due date.

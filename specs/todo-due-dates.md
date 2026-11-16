---
specforge: 1
id: todo-due-dates
title: Todo due dates
status: approved
acceptance:
  - id: AC-1
    text: "With `TODO_TODAY=2026-06-01`, `add Pay rent --due 2026-06-15` exits 0, and a later, separate `list` invocation prints a line containing `Pay rent` that ends with ` (due 2026-06-15)`."
    verify: "npm test: test/due-dates.test.js, 'add --due persists the date and list shows (due 2026-06-15)'"
  - id: AC-2
    text: "A task added without `--due` has no due date, and its `list` line has no `(due ...)` suffix."
    verify: "npm test: test/due-dates.test.js, 'task without due date lists with no suffix'"
  - id: AC-11
    text: "A stored task that lacks a due-date field entirely loads, and `list` prints its line with no `(due ...)` suffix."
    verify: "npm test: test/due-dates.test.js, 'stored task without due field loads'; the test writes the fixture into a temp copy of the prerequisite's storage file, in the prerequisite's format"
  - id: AC-3
    text: "With `TODO_TODAY=2026-06-01`, `list` prints overdue tasks (due date strictly before 2026-06-01) first, sorted by due date ascending with ties in insertion order, followed by all other tasks (due today, due later, or undated) in insertion order."
    verify: "npm test: test/due-dates.test.js, 'list orders overdue first by due date, then rest in insertion order': tasks added in this order: `future` (2026-07-01), `undated`, `late` (2026-05-20), `early-a` (2026-05-01), `early-b` (2026-05-01), `today` (2026-06-01); expected `list` title order: early-a, early-b, late, future, undated, today"
  - id: AC-4
    text: "A task due on `TODO_TODAY` is not overdue."
    verify: "npm test: test/due-dates.test.js, 'task due today is not overdue': with TODO_TODAY=2026-06-01, tasks added in order `undated`, then `today` (2026-06-01); expected `list` title order: undated, today"
  - id: AC-5
    text: "With a valid `TODO_TODAY`, `add x --due <input>` exits non-zero for each of these inputs: `2026-02-30`, `2026-13-01`, `2023-02-29`, `26-01-01`, `2026-1-1`, `0000-01-01`, `tomorrow`, and an empty string passed as a literal empty argument. `add x --due` with no value, and `add x --due 2026-01-01 --due 2026-01-02`, also exit non-zero. For these ten cases the stderr message (AC-7) names `--due`."
    verify: "npm test: test/due-dates.test.js, table-driven, one test per case, each named 'add rejects due input <input>' with the literal input in the name (the empty string is named 'add rejects due input (empty)'), plus 'add rejects --due with no value' and 'add rejects repeated --due'"
  - id: AC-6
    text: "A leap day is accepted: `add x --due 2024-02-29` exits 0."
    verify: "npm test: test/due-dates.test.js, 'add accepts a leap day'"
  - id: AC-7
    text: "For each rejected input in AC-5, `add` writes a message to stderr that names `--due` (so a crash with a stack trace does not satisfy it), and against a store that already holds one task, `list` output is identical before and after the failed `add`. This includes the missing-value and repeated-flag cases."
    verify: "npm test: test/due-dates.test.js, table-driven over every AC-5 case including missing-value and repeated-flag, each named 'invalid due input <input> writes stderr and leaves list unchanged' (literal input in the name, '(empty)' for the empty string); stderr and unchanged-list are intentionally checked together in one test per case"
  - id: AC-8
    text: "With `TODO_TODAY=2026-06-01`, `add x --due 2020-01-01` exits 0 and `list` shows the task ending with ` (due 2020-01-01)`: past dates are accepted."
    verify: "npm test: test/due-dates.test.js, 'add accepts a past due date'"
  - id: AC-9
    text: "When `TODO_TODAY` is set to `2026-02-30`, `abc`, or an empty string, `list` exits non-zero with a stderr message that names `TODO_TODAY`, and `add x --due 2026-01-01` does too. `add x` without `--due` is unaffected and exits 0."
    verify: "npm test: test/due-dates.test.js, 'invalid TODO_TODAY 2026-02-30 fails list', 'invalid TODO_TODAY abc fails list', 'invalid TODO_TODAY (empty) fails list', the same three for 'fails add --due', and 'invalid TODO_TODAY does not affect plain add'; the empty case passes TODO_TODAY as an empty string in the child env, not by deleting it"
  - id: AC-10
    text: "With `TODO_TODAY` unset, `list` and `add x --due 2026-01-01` exit 0 (smoke test of the system-local-date path; it does not assert which date is used; a local-versus-UTC bug near midnight is a known, accepted gap)."
    verify: "npm test: test/due-dates.test.js, 'unpinned today: list and add --due exit 0'; the test removes TODO_TODAY from the child env"
  - id: AC-12
    text: "`add` rejects any argument that begins with `--due` other than exactly `--due` (for example `--due=2026-01-01` or `--duedate`): it exits non-zero, writes a stderr message naming the argument, and stores nothing, rather than treating it as part of the title."
    verify: "npm test: test/due-dates.test.js, 'add rejects --due=2026-01-01 and does not store it as a title' and 'add rejects --duedate'; each also checks list output is unchanged"
---

## Summary

The todo CLI supports an optional due date on each task, `list` shows each task's due date, and `list` shows overdue tasks first.

## Context

No todo CLI exists in this repo yet, and `npm test` is currently `echo ok`, so it cannot fail. This spec is blocked on a prerequisite spec, not yet written and not yet named, that provides a minimal CLI. The minimum contract this spec needs from it:

- `add <title>` and `list`, where `list` prints one task per line, and the line has the title and no trailing fields after it (so appending ` (due ...)` is unambiguous).
- Persistent storage across invocations, in a format that allows a task with no due-date field to be hand-written as a test fixture.
- Storage that tolerates a task carrying an unknown (due-date) field, so reverting this feature does not break loading of data it wrote.
- A real test runner wired to `npm test` that executes `test/due-dates.test.js` and makes `npm test` exit non-zero when a test fails or the file is missing, and reports individual test names so a verify is satisfied only if a test with that exact name ran and passed.
- The CLI can be run as a subprocess with environment variables and observed through exit code, stdout and stderr.
- No completed-task state and no existing sort semantics in `list` (if the prerequisite adds either, this spec's ordering must be revisited).

That prerequisite is not part of this spec, and its own spec should carry this contract as its acceptance criteria. The build of this spec must not start until it is merged, and the build authors `test/due-dates.test.js` (the named tests are created as part of the build, so the verify targets cannot pass vacuously: a missing file or test fails them). The entry point and storage path are whatever the prerequisite defines. The test file name `test/due-dates.test.js` is fixed by this spec; if the prerequisite's runner cannot pick it up, this spec is updated. When the prerequisite exists, also re-check the flag parsing, the `TODO_TODAY` clock override (if the prerequisite already has a clock mechanism, this spec and the ACs naming `TODO_TODAY` are revised before the build) and these assumptions against it.

## Open questions

- [x] Which spec or change provides the prerequisite CLI (language, entry point, storage path, test runner)? Answer: a separate spec, to be created (it does not exist or have an id yet). This spec names it as a prerequisite, states the minimum contract in Context, and does not fix language, entry point or storage path. Folding the CLI into this spec was not chosen.
- [x] Due date input syntax. Answer: `--due YYYY-MM-DD` flag on `add`, strict ISO format. Impossible dates such as `2026-02-30` are rejected, and so is year `0000` (not a valid year for this spec). Past dates are accepted.
- [x] `list` output format for the due date. Answer: suffix ` (due YYYY-MM-DD)` after the title; no suffix when there is no due date.
- [x] Is a task due today overdue? Answer: no. Overdue means strictly before today.
- [x] Timezone and clock pinning. Answer: "today" is the system-local calendar date. If the `TODO_TODAY` environment variable is set to `YYYY-MM-DD`, it overrides today; tests pin the clock this way.
- [x] Ordering. Answer: overdue tasks first, by due date ascending (ties in insertion order); then every other task, including due-today, future-dated and undated, in insertion order.
- [x] Must tasks stored without a due date still load? Answer: yes, the field is optional (AC-2).
- [x] What happens when `TODO_TODAY` is set but invalid? Answer: commands that need "today" (`list`, and `add` with `--due`) exit non-zero with a stderr message; plain `add` is unaffected; an empty value counts as set and invalid (AC-9).
- [x] How are unsupported `--due` forms handled? Answer: any argument beginning with `--due` other than exactly `--due` is an error (non-zero, stderr, nothing stored) so it cannot be swallowed into the title (AC-12).
- [x] What happens with a malformed due field already in storage? Answer: out of scope and unspecified; accepted that `list` may fail on hand-edited data.
- [x] Should the system-local-date path have a test? Answer: yes, a smoke test that with `TODO_TODAY` unset `list` and `add --due` exit 0 (AC-10).
- [x] What do a missing `--due` value and a repeated `--due` flag do? Answer: both are errors, handled like an invalid date: non-zero exit, stderr message, nothing stored (AC-5, AC-7).

## Design

- `add` accepts an optional `--due YYYY-MM-DD` flag. The value must match `^[0-9]{4}-[0-9]{2}-[0-9]{2}$` (ASCII digits), have a year other than `0000`, and be a real calendar date, leap years included (`2024-02-29` valid, `2023-02-29` invalid, AC-5, AC-6). A missing value or a repeated `--due` flag is invalid. Past dates are accepted.
- Validation of `--due` happens before anything is written. On an invalid value, `add` writes an error message to stderr, exits non-zero, and leaves storage untouched. The supported syntax is `--due <value>` after the title; any other argument beginning with `--due` (such as `--due=<value>`) is an error, handled like an invalid date, so it can never become part of the title (AC-12). Flag-before-title ordering and a value that looks like a flag are left to the prerequisite's argument parser.
- The due date is stored on the task as an optional field holding the `YYYY-MM-DD` string. Tasks without the field load as having no due date. No data migration is performed. A stored due field that is present but malformed (for example hand-edited) is out of scope and its behaviour is unspecified: only this CLI writes storage, and it validates first.
- "Today" is the system-local calendar date, overridden by `TODO_TODAY=YYYY-MM-DD` when set. `TODO_TODAY` is a supported override for users and tests alike. It is read only by commands that need "today": `list`, and `add` when `--due` is given. If it is set (an empty value counts as set) and is not a valid calendar date, such a command exits non-zero with a stderr message; plain `add` ignores it. Every test in `test/due-dates.test.js` sets a valid `TODO_TODAY` except the unpinned smoke test (AC-10) and the invalid-`TODO_TODAY` tests (AC-9).
- `list` prints a task's line as before, followed by ` (due YYYY-MM-DD)` at the end of the line when it has a due date. Order: tasks with due date < today first, sorted by due date ascending (stable, so ties keep insertion order); then all remaining tasks in insertion order. Comparison is done on the `YYYY-MM-DD` strings, which sort in date order. This changes `list` ordering for any stored data that has due dates; data without due dates lists in insertion order exactly as before.
- Storage, argument parsing library, entry point and test runner come from the prerequisite spec. The change is additive and optional, with no deletion or irreversible migration, so rollback is reverting the change, given the prerequisite's storage tolerates the extra field (see Context).

## Out of scope

- Building the base CLI, storage, or test runner (prerequisite, see Context).
- Editing or clearing due dates after creation.
- Marking tasks complete, or excluding completed tasks from ordering.
- Reminders, notifications, or recurring tasks.
- Relative or natural-language date parsing.
- Time-of-day on due dates.
- New `list` flags or filters, or output changes beyond showing the due date.
- Help or usage text, README or other documentation updates, and machine-readable (e.g. JSON) output.
- Handling of titles that themselves contain ` (due `: the resulting `list` ambiguity is accepted.
- Flag-before-title ordering and values that look like flags (left to the prerequisite's parser).
- Handling of a malformed due field already present in storage (hand-edited data): behaviour is unspecified and may fail `list`; accepted.

---
specforge: 1
id: todo-json-export
title: Todo JSON export and import
status: approved
acceptance:
  - id: AC-1
    text: "`todo export <file>` writes every existing task to the file as valid JSON in the export format (`{ \"version\": 1, \"tasks\": [...] }`), each task carrying every field of the task record (at minimum id, title, done), and exits 0."
    verify: "test/export-import.test.js: 'export writes all tasks in wrapper format' (adds 3 tasks with known titles via `todo add`, runs export, parses the file and asserts version is 1, tasks has length 3, and each task has the known title, a boolean done, and an id, with ids distinct)"
  - id: AC-2
    text: "Exporting when there are no tasks, including when the store file does not exist yet, writes `{ \"version\": 1, \"tasks\": [] }` and exits 0."
    verify: "test/export-import.test.js: 'export with no tasks writes empty list' with two subtests: 'nonexistent store' (TODO_STORE points at a path that does not exist) and 'empty store' (a TODO_STORE that exists but holds no tasks, in whatever form todo-cli-base defines)"
  - id: AC-3
    text: "After exporting a known set of tasks, clearing the store (the test deletes the TODO_STORE file), and running `todo import <file>`, re-exporting produces a tasks array deep-equal to the first export (every field, including id, unchanged and not coerced), and `todo list` output contains each task's title. The fixture imports a hand-written export file containing one task with a numeric id and one with a string id (when the id type allows both), so that coercion would be detected; the first export is the baseline."
    verify: "test/export-import.test.js: 'round trip preserves all fields and ids' and 'list shows imported titles'"
  - id: AC-4
    text: "Importing a file that is not valid JSON exits non-zero, writes a message beginning `error:` to stderr (no stack trace: stderr contains no stack-frame lines such as `    at fn (file:1:1)`), and leaves the store file byte-identical to before."
    verify: "test/export-import.test.js: 'import rejects invalid JSON and leaves store unchanged'"
  - id: AC-5
    text: "Importing a path that does not exist, or that is a directory, exits non-zero, writes a message beginning `error:` to stderr (no stack trace), and leaves the store file byte-identical to before."
    verify: "test/export-import.test.js: 'import rejects missing path and leaves store unchanged' and 'import rejects a directory and leaves store unchanged'"
  - id: AC-6
    text: "Importing a file that is valid JSON but not in the export format exits non-zero, writes a non-empty message beginning `error:` to stderr (no stack trace), and leaves the store file byte-identical to before. Table-driven cases, each its own subtest: top level not an object; `version` missing; `version` not 1; `tasks` missing; `tasks` not an array; a task not an object; a task missing id; missing title; missing done; title not a string; done not a boolean; id not a string or number. Concrete bad values: `id: null`, `id: true`, `title: 5`, `done: \"yes\"`. Cases that have a `tasks` array include a valid task alongside the bad one, to show nothing is partially imported."
    verify: "test/export-import.test.js: 'import rejects invalid export format: <case>' (node:test subtests, one per listed case, named with the case text, each with an inline fixture)"
  - id: AC-7
    text: "Importing a file in which two tasks share an id is rejected the same way as AC-6 (non-zero exit, stderr message beginning `error:`, store byte-identical). Ids `1` and `\"1\"` in the same file are distinct and accepted."
    verify: "test/export-import.test.js: 'import rejects duplicate ids' and 'import treats 1 and \"1\" as distinct ids'"
  - id: AC-8
    text: "A successful import replaces all existing tasks: tasks present before the import but absent from the file are gone afterwards, and importing `{ \"version\": 1, \"tasks\": [] }` leaves an empty store (observed by re-exporting). Task order in the file is preserved in the store and in later exports. On success import writes `replaced N tasks` (N = number of tasks imported) to stderr and exits 0."
    verify: "test/export-import.test.js: 'import replaces existing tasks', 'import of empty list empties the store', and 'import reports replaced count on stderr'"
  - id: AC-9
    text: "Exporting to a path that already exists overwrites it without prompting or requiring a flag (the test runs the CLI with stdin closed and a spawn timeout of 10 seconds against a pre-existing file containing a marker string; a timeout is a failure). Afterwards the exit code is 0, the file parses as the new export, and the marker is absent."
    verify: "test/export-import.test.js: 'export overwrites existing file'"
  - id: AC-10
    text: "Exporting to a path whose parent directory does not exist exits non-zero with a stderr message beginning `error:` and does not create the directory (asserted: non-zero exit and the parent path still does not exist)."
    verify: "test/export-import.test.js: 'export fails on missing parent dir'"
  - id: AC-11
    text: "Running `export` or `import` with no file argument exits non-zero with a stderr message beginning `usage:`. The `import` usage text matches /replaces all/i."
    verify: "test/export-import.test.js: 'export requires a file argument', 'import requires a file argument' and 'import usage warns it replaces tasks'"
  - id: AC-12
    text: "Fields not in the task model (the test uses a clearly foreign name, `__unknown_x`), at the top level or on a task, are ignored and do not cause rejection; they do not appear in a subsequent export."
    verify: "test/export-import.test.js: 'import ignores unknown fields' (import a file with extra fields, assert exit 0, re-export, assert the extras are absent)"
  - id: AC-13
    text: "After an import, `todo add` creates a task whose id differs from every imported id (fixture: imported ids equal the values the generator would produce next)."
    verify: "test/export-import.test.js: 'add after import does not reuse an imported id'"
---

## Summary

The todo CLI can export all tasks to a JSON file and import them back from such a file.

## Context

Came up while testing specforge in the sandbox; this is a dry run, so the spec is deliberately small.

Dependency: the repo currently has only README.md, package.json and specforge files, so there is no CLI, task storage or test runner (`npm test` is `echo ok`). This spec depends on a prerequisite spec, reserved id `todo-cli-base`, which does not exist yet. This spec must not be built until `todo-cli-base` has merged. `todo-cli-base` owns the base CLI, task storage and task model, and the change of the `test` script in package.json from `echo ok` to a real runner (`node --test`). Without that change the gate would pass this spec's tests vacuously. This spec does not design or implement any of that.

Assumed interface of `todo-cli-base` (the verify targets depend on it; if the real one differs, update this spec before building): a Node CLI `todo` with `add <title>` and `list` commands; a store location overridable with the `TODO_STORE` environment variable so tests can use a temp store; a task model with at least `id`, `title` and `done`, with the id type (string or number) defined by that spec; `list` prints at least each task's title and done state. The CLI's entry point (how tests spawn it) is also defined there. Tests use `node:test`. The store is a single file at the path in `TODO_STORE`; the module system (CJS/ESM) and minimum Node version are defined there too. `todo-cli-base` guarantees that `todo add` never produces an id that collides with an id already in the store (for example UUIDs, or deriving the next id from the stored tasks), so import never touches id-generator state; AC-13 is the regression test for that guarantee, using an import whose ids equal the generator's next values. It also defines the task model's field list and what an empty store looks like (re-verify the AC-2 'empty store' fixture). Before this spec is built, re-verify each assumed interface here against the merged `todo-cli-base`. Specforge has no machine-readable dependency field, so the block is stated in prose only.

## Open questions

- [x] File format: bare array or wrapper? Versioned? Answer: wrapper object `{ "version": 1, "tasks": [...] }`; the schema is versioned and import rejects any other version.
- [x] Command surface? Answer: `todo export <file>` and `todo import <file>` subcommands taking file paths only. No stdout/stdin support, no flags on `list`.
- [x] Import conflict behavior? Answer: import replaces all existing tasks; there is no merge and so no duplicate rule.
- [x] ID handling? Answer: ids are exported and preserved on import, not coerced. Because import replaces everything, collisions with existing ids cannot occur; ids duplicated within the file make the file invalid.
- [x] Malformed input beyond invalid JSON? Answer: reject the whole file if the shape is wrong, the version is unsupported, or any task lacks id, title or done or has a wrong type. Unknown extra fields are ignored. No skipping of bad entries.
- [x] Export to an existing file? Answer: overwrite silently.
- [x] Is import atomic? Answer: yes. The whole file is validated before the store is touched; any rejection leaves existing tasks unchanged.
- [x] Which fields are exported? Answer: all fields of the task record as defined by `todo-cli-base` (at minimum id, title, done). Import requires id, title and done. Other fields declared by the task model are preserved if present; fields not in the model are ignored and dropped.
- [x] Test stack and prerequisite handling? Answer: Node with `node:test`; the base CLI stays a separate prerequisite spec (`todo-cli-base`) and this one is blocked until it lands. That spec owns the `npm test` script change.

## Design

Commands:
- `todo export <file>`: reads all tasks from the store (an absent store counts as no tasks) and writes `{ "version": 1, "tasks": [ <task>, ... ] }` as JSON to `<file>`, overwriting any existing file. Each task is the full task record, including `id`. Exits 0. Does not create missing parent directories; any write failure prints a message to stderr and exits non-zero. The file is written to a temporary file in the same directory and renamed into place, so a failure cannot leave a truncated export.
- `todo import <file>`: reads `<file>`, parses it, validates it, and only then replaces the entire store contents with its tasks. Exits 0 on success. This is destructive: the previous tasks are not backed up, so a user who wants them back should `export` first. The usage/help text says so.
- Either command with no file argument prints a usage message to stderr and exits non-zero.

Validation (all before any write to the store): path exists and is a readable file; content is valid JSON; top level is an object with `version === 1` and a `tasks` array; every task is an object with `id` (string or number, per the task model; never coerced), `title` (string) and `done` (boolean); ids are unique within the file. Fields not in the task model are ignored. Any failure prints a non-empty error message to stderr, exits non-zero, and leaves the store untouched.

Atomicity: import builds the new task list in memory after validating, then writes it to a temporary file next to the store and renames it over the store, so a failure or crash cannot leave a partial import.

Reuse: if `todo-cli-base` provides store read/write helpers (including an atomic write), import and export reuse them rather than adding parallel ones. Temporary files are removed on failure.

Not covered by an AC: preservation of optional model fields (testable once the model is known), unreadable-file input, a `<file>` equal to the store path or a symlink (behaviour undefined), and the crash/write-failure safety of the temp-file-plus-rename (design intent; fault injection is out of proportion for this feature). Validation-failure atomicity is covered by AC-4 to AC-7. Temp file names are unique and must not clobber an existing user file.

Value rules: the duplicate-id check uses strict equality (so `1` and `"1"` are distinct); no other constraints on id or title values (empty strings allowed). Optional model fields are passed through without type validation. Adding a model field later does not bump `version`; only an incompatible change to the format does. A relative `<file>` resolves against the current directory.

Run command: `npm test` (once `todo-cli-base` makes it run `node --test`), or `node --test test/export-import.test.js`; expected result: exit 0, with no skipped or todo tests and at least one passing test per AC.

Tests: `test/export-import.test.js` using `node:test`, spawning the CLI with `child_process` against a temp store set via `TODO_STORE`. Tests clear the store by deleting the `TODO_STORE` file; no `clear` command exists. "Store unchanged" is checked by comparing the store file's bytes before and after.

## Out of scope

- Designing or implementing the base `add` / `list` commands, task storage, the task model, or the `npm test` script change (all owned by `todo-cli-base`).
- Formats other than JSON (CSV, etc.).
- Merge or duplicate-detection import modes.
- stdout/stdin piping.
- Schema migration (only version 1 is understood), export filters, confirmation/`--force` flags, store backups, and any guarantee about JSON formatting or field order.
- A `clear` command.
- File locking or concurrent runs (last writer wins), and symlinked store or export paths.
- Sync, remote storage, or scheduled exports.

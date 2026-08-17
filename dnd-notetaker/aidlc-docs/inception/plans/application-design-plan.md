# Application Design Plan — Sessions Page: Session Detail Panel

## Execution Checklist
- [x] Confirm component file organization (Question 1) — A: new `js/sessionPanel.js`
- [x] Confirm component code style / interface pattern (Question 2) — B: `SessionPanel` namespace object
- [x] Confirm panel/tab/split state location (Question 3) — B: reflected in URL query params (`requirements.md` NFR3 updated accordingly)
- [x] Generate `aidlc-docs/inception/application-design/components.md`
- [x] Generate `aidlc-docs/inception/application-design/component-methods.md`
- [x] Generate `aidlc-docs/inception/application-design/services.md`
- [x] Generate `aidlc-docs/inception/application-design/component-dependency.md`
- [x] Generate `aidlc-docs/inception/application-design/application-design.md` (consolidated)

## Note on Q3 Follow-through
Q3 confirmed URL-based persistence but didn't specify exactly which sub-state is URL-encoded. To avoid over-scoping, the design below makes an explicit assumption: `open` (which sessions have tabs) and `split` (which two are shown side-by-side) go in the URL; panel resize width stays in-memory/ephemeral (not shareable-meaningful). Flagged in `application-design.md` under Open Decisions for correction if wrong.

## Clarifying Questions

### Question 1 — Component File Organization
This project has no bundler/build step — every JS file is a plain `<script>` tag sharing global scope (`app.js`, `storage.js`, `sessions.js`, etc., per CLAUDE.md's file structure). The new panel/tab/split subsystem is a meaningfully-sized new piece of logic. Where should it live?

A) New file `js/sessionPanel.js`, loaded via its own `<script>` tag only on `sessions.html` (alongside `sessions.js`) — keeps the new subsystem visually and physically separate from the existing list-rendering code

B) Added directly into the existing `js/sessions.js` — keeps everything for this page in one file

C) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 2 — Component Code Style
Given there's no module system, how should the new component(s) be structured to avoid dumping a pile of loose global functions and variables into the shared scope?

A) Plain global functions + a few page-scoped variables — matches the app's current style everywhere else exactly (e.g. `renderSessions()`, module-level `let` variables), simplest and most consistent with the rest of the codebase

B) A single object/namespace (e.g. `const SessionPanel = { state: {...}, open(id), closeTab(id), switchTab(id), detachToSplit(id), resize(width), ... }`) so the panel's internal state and methods are grouped together instead of loose in global scope — still no build tooling required, just a JS object literal

C) Other (please describe after [Answer]: tag below)

[Answer]: B

### Question 3 — Panel/Tab/Split State Location
Where should "which sessions are open, which tab is active, split-view state" actually live while the page is open?

A) In-memory JS only (a plain object/variable) — refreshing the page closes all panels and resets to the list view. Matches NFR3 in requirements.md (UI state doesn't need to persist across reload).

B) Reflected in the URL's query params (similar to the existing `?campaign=camp_123` pattern) so a refresh preserves which session(s) are open

C) Other (please describe after [Answer]: tag below)

[Answer]: B

# Functional Design Plan — Unit: session-detail-panel

**Unit context**: No formal unit-of-work artifacts (Units Generation was skipped). Sourced directly from `aidlc-docs/inception/application-design/application-design.md` and `aidlc-docs/inception/user-stories/stories.md`.

## Execution Checklist
- [x] Resolve delete-while-panel-open edge case (Question 1) — A: auto-close tab
- [x] Confirm split-view pane cap (Question 2 + clarification) — capped at 3 panes
- [x] Confirm drag-to-split interaction model (Question 3 + clarification) — explicit drop zones between/beside each pane
- [x] Confirm autosave debounce delay (Question 4) — ~1.5-2s (implemented as 1500ms)
- [x] Generate `aidlc-docs/construction/session-detail-panel/functional-design/business-logic-model.md`
- [x] Generate `aidlc-docs/construction/session-detail-panel/functional-design/business-rules.md`
- [x] Generate `aidlc-docs/construction/session-detail-panel/functional-design/domain-entities.md`
- [x] Generate `aidlc-docs/construction/session-detail-panel/functional-design/frontend-components.md`

## Clarifying Questions

### Question 1 — Delete While Panel Is Open
Application Design flagged this as unresolved: what happens if a session gets deleted from the list card while its panel tab is currently open?

A) Auto-close that session's tab immediately when it's deleted (if it was the last/only tab, the whole panel closes)

B) Block deletion from the list while that session's panel is open — the delete button is disabled/hidden for a session that's currently open in a panel

C) Leave the tab open but show a "this session was deleted" placeholder state in that tab/pane instead of its normal editable content

D) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 2 — Split View Pane Cap
Requirements.md's FR10 says split view shows "two (or more) sessions." For this version, should split view be capped?

A) Exactly 2 panes max — dragging a third tab out just switches which one occupies the second pane (replaces it), keeping the layout simple

B) Allow more than 2 side-by-side panes (3+), sized to fit

C) Other (please describe after [Answer]: tag below)

[Answer]: B

### Question 3 — Drag-to-Split Interaction Model
How should "dragging a tab out to split" actually be triggered?

A) Explicit drop zone — dragging a tab into a specific zone (e.g. the right half of the panel, visually highlighted while dragging) triggers the split; dropping outside that zone snaps the tab back to the tab bar

B) Any drag past a small distance threshold (e.g. a few pixels off the tab bar) immediately triggers split — no distinct drop zone to aim for

C) Other (please describe after [Answer]: tag below)

[Answer]: A

### Question 4 — Autosave Debounce Delay
How long should the app wait after the user stops typing before saving?

A) Short (~500ms) — feels closer to instant, more frequent writes to localStorage

B) Longer (~1.5-2s) — fewer writes, still feels responsive for note-taking

C) Other (please describe after [Answer]: tag below)

[Answer]: B

## Notes (Not Asked — Reusing Existing Patterns)
- **Title/tags validation**: reuses the exact existing pattern from the new-session form handler (per CLAUDE.md): title defaults to `"Untitled Session"` if blank, tags parsed via `.split(",").map(s => s.trim())`. No new validation logic being invented here.
- **Autosave/delete race** (flagged in Application Design): resolved naturally — deleting removes the storage key; a pending debounced save for that session should check the key still exists before writing, otherwise skip (won't be asked as a question, this is a straightforward implementation rule, documented in business-rules.md).

# User Stories — Session Detail Panel

**Persona**: [The Player](personas.md) (single persona, all stories)
**Organization**: Feature-based
**Requirements source**: `aidlc-docs/inception/requirements/requirements.md` (FR1–FR10)

---

## Story 1: Open and edit a session in a resizable panel
**As a** Player, **I want to** double-click a session card to open it in a resizable side panel where I can edit every field, **so that** I have enough room to write real notes instead of squeezing edits into a small list card.

**Covers**: FR3, FR4, FR5, FR6, FR7

**Acceptance Criteria**:
- Double-clicking a session card opens a panel that slides in from the right edge of the screen
- The session list stays visible behind/beside the open panel
- The panel's edge can be dragged to resize it larger or smaller
- Title, date, inGameDate, summary, and tags are all visible and editable inside the panel
- The summary field is a plain-text textarea (no rich text/Markdown in this version)
- Edits auto-save (debounced) with no explicit Save button
- Closing or navigating away flushes any pending unsaved edit immediately, rather than losing it

**INVEST notes**: Independent of Stories 2–3 (a single panel works with zero tabs open); Small enough to implement and verify on its own before tab logic is layered on.

---

## Story 2: Manage multiple open sessions via tabs
**As a** Player, **I want to** open a second session without losing the first one, **so that** I can keep both available and switch between them.

**Covers**: FR8, FR9

**Acceptance Criteria**:
- Double-clicking a second session card while a panel is already open adds it as a new tab in the same panel, rather than replacing the first
- Clicking a tab switches the panel's content to that session
- Each tab reflects that session's own auto-save state independently (editing one tab's content doesn't touch another's)
- Closing a tab only closes that session's view, not the whole panel (if other tabs remain open)

**INVEST notes**: Depends on Story 1's panel existing; testable independently once Story 1 is done by opening a second session and checking tab behavior.

---

## Story 3: View two sessions side-by-side via split view
**As a** Player, **I want to** drag a tab out of the tab bar, **so that** I can view two sessions at once and cross-reference them without switching back and forth.

**Covers**: FR10

**Acceptance Criteria**:
- Dragging a tab out of the tab bar creates a second panel shown side-by-side with the first
- Both panels remain independently editable and auto-saving
- Dragging a tab back into a tab bar (or closing one panel) collapses back to a single panel with tabs
- Drag interaction has a visible affordance (cursor/drag handle change, drop-zone indication) per NFR1

**INVEST notes**: Depends on Story 2 (tabs must exist before one can be dragged out); this is the highest-complexity story and the most likely candidate to be re-scoped if Construction reveals it's bigger than expected (flagged in requirements.md).

---

## Story 4: Delete a session from the list
**As a** Player, **I want to** delete a session directly from its list card, with a confirmation step, **so that** I can remove a session without needing to open its panel first, and without risking an accidental delete.

**Covers**: FR1, FR2, FR2a

**Acceptance Criteria**:
- Session cards continue to show their summary always expanded (no preview/toggle)
- A delete button appears on a session card on hover
- There is no separate "edit mode" or "double-click state" on the list card — double-click always opens the panel (Story 1)
- Clicking delete does **not** immediately remove the session — the card itself swaps to (or reveals) a "Delete this session?" Confirm/Cancel state, in place, with no modal/popup/browser `confirm()` dialog
- Confirming removes the session from `storage.js` and the list re-renders without it; canceling reverts the card back to its normal state, untouched

**INVEST notes**: Fully independent of Stories 1–3 — can be implemented and verified first if desired, since it doesn't touch the panel at all.

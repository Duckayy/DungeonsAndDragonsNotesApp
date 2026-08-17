# Components — Sessions Page: Session Detail Panel

## Component: SessionListRenderer
**File**: `js/sessions.js` (existing, extended)

**Purpose**: Render a campaign's session cards in the list view and handle list-level interactions (opening a session, hover-delete with inline confirmation).

**Responsibilities**:
- Render each session as a card with summary always expanded (unchanged)
- Show a delete button on hover; on click, swap that card's content to an inline "Delete this session? Confirm/Cancel" state
- On confirm, delete via `storage.js` and re-render the list; on cancel, revert the card
- On double-click, hand off to `SessionPanel.open(sessionId)` — the list itself no longer has an inline edit mode

**Does NOT own**: any panel/tab/split state — that's entirely `SessionPanel`'s responsibility.

---

## Component: SessionPanel
**File**: `js/sessionPanel.js` (new)

**Purpose**: Owns the entire panel/tab/split subsystem — opening sessions in a resizable side drawer, tab management, drag-to-split, field editing, and autosave.

**Responsibilities**:
- Render the panel drawer (or two side-by-side drawers when split) with a tab bar
- Track which sessions are open, which tab is active, and split arrangement
- Sync open/split state to the URL query params (`open`, `split`) so refresh restores layout; restore from URL on page load
- Render all editable fields (title, date, inGameDate, summary, tags) for the active session per open tab/pane
- Debounce field edits and autosave via `storage.js`; after each save, trigger the list to re-render so the underlying card stays in sync
- Handle panel resize (in-memory only, not URL-persisted)
- Handle tab drag-to-split and merge-back-to-tab interactions

**Does NOT own**: session deletion (stays in `SessionListRenderer`), the session list rendering itself.

---

## Design Note (Open Decision)
Per the approved plan, `open`/`split` URL params are the only panel state persisted across reload; resize width is not. If this assumption is wrong, flag it during review and it'll be revised before Functional Design locks in the state machine.

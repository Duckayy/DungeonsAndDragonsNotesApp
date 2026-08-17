# Code Generation Plan — Unit: session-detail-panel

**Workspace Root**: `C:\Users\legas\Documents\GitHub\DungeonsAndDragonsNotesApp\dnd-notetaker`
**Project Type**: Brownfield, single package, no backend (vanilla HTML/CSS/JS, `storage.js` = localStorage)

## Grounding in Actual Code (found while preparing this plan)
Reverse Engineering was deferred earlier in favor of CLAUDE.md's docs. Before generating code, I read the actual current files and found two things the prior design docs didn't know about — noted here so the plan accounts for them, rather than surprising you mid-generation:

1. **The inline-edit system is shared, not sessions-only.** `.editing` / `.edit-fields` / `.save-btn` / `.cancel-btn` / `.delete-btn` and their CSS are a shared pattern across `.session-card`, `.campaign-card`, and `.character-card`. It's also how **"+ Create New Session" creates a draft card** (`addNewSessionCard` / `attachDraftSessionCardListeners`) — that flow is untouched by this feature and must keep working exactly as-is.
   - **Resolution**: Only change behavior for *existing/saved* session cards (remove their double-click-to-edit-inline path, replace with hover-delete+confirm and double-click-opens-panel). Draft-card creation keeps using `.editing`/`.edit-fields` exactly as today — no changes to `addNewSessionCard`, `attachDraftSessionCardListeners`, or the campaign/character card CSS rules.
2. **"Summary always expanded" was decided but never implemented.** The live code still truncates to a 100-char `.summary-preview` and toggles to `.summary-full` on click (`.expanded` class). FR1 assumed this was already done.
   - **Resolution**: Finish implementing the existing decision now — always render the full summary, remove the preview/toggle-on-click code and its now-dead CSS rules for `.session-card`. Frees up single-click on a saved card (no longer needed for anything).

Both resolutions are low-risk and reversible (pure UI behavior, no data model changes) — flag at plan approval if you'd rather handle either differently.

## Unit Context
- **Stories implemented**: Story 1 (open/edit/autosave), Story 2 (tabs), Story 3 (split view), Story 4 (delete) — see `aidlc-docs/inception/user-stories/stories.md`
- **Dependencies**: `storage.js` (used as-is, no changes)
- **No backend/API/repository/database layers exist in this project** — skipping those plan sections entirely (static site, localStorage only)
- **No automated test framework exists in this project** — skipping "Unit Testing" sub-steps; manual browser verification happens in the next stage (Build and Test), against `stories.md`'s acceptance criteria

## Steps

### Step 1: CSS Generation — `css/style.css`
- [x] Add: hover-visible delete button + inline confirm/cancel state for `.session-card` (FR2, FR2a, BR15-18)
- [x] Add: panel drawer, pane, tab bar, resize handle, split-view layout, drop-zone highlight styles (FR3, FR4, FR8-FR10, BR5-BR8)
- [x] Remove: `.session-card.expanded .summary-preview` / `.summary-full` toggle rules (dead once summary is always-expanded)
- **Story mapping**: Story 1, Story 3, Story 4

### Step 2: HTML Generation — `pages/sessions.html`
- [x] Add `#session-panel-container` element (SessionPanel renders into this)
- [x] Add `<script src="../js/sessionPanel.js"></script>` after the existing `sessions.js` script tag
- **Story mapping**: Story 1

### Step 3: Frontend Components Generation — `js/sessions.js` (modify in-place)
- [x] `buildSessionCardHTML`: always render full summary (drop the 100-char preview truncation); add hover-delete button + inline confirm/cancel markup for non-draft cards
- [x] `attachSessionCardListeners`: remove click-to-expand and dblclick-to-edit handlers for saved cards; add dblclick → `SessionPanel.open(sessionId)`; add delete button click → inline confirm state (BR18: cancels any other card's confirm first); add confirm/cancel handlers (BR15-17)
- [x] Remove `saveEditedSession` (only reachable via the retired inline-edit path)
- [x] Replace `deleteSession`'s `window.confirm()` popup with the new inline-confirm delete flow, wired to storage.deleteItem + re-render (BR16)
- [x] Leave `addNewSessionCard`, `attachDraftSessionCardListeners`, and all draft-card logic untouched
- [x] Verify `renderSessions()` stays callable with no arguments (SessionPanel calls it after autosave)
- **Story mapping**: Story 1 (open trigger), Story 4 (delete)

### Step 4: Frontend Components Generation — `js/sessionPanel.js` (new file)
- [x] `SessionPanel` namespace object with in-memory `panes` state (domain-entities.md `PanelState`)
- [x] `initFromURL()` — parse `open`/`split` params, reconstruct panes, drop missing session IDs (BR20)
- [x] `open(sessionId)` — new tab or activate existing (BR1)
- [x] `closeTab(sessionId)` — BR2/BR3 (switch to next tab, or close pane/panel if last)
- [x] `switchTab(sessionId)`
- [x] `detachToSplit(sessionId, position)` — boundary drop zones, cap at 3 panes (BR5-BR8)
- [x] `mergeSplit(sessionId)`
- [x] `resize(paneId, widthPx)` — in-memory only, not URL-persisted
- [x] `handleFieldChange(sessionId, field, value)` — draft update + 1500ms debounce (BR9, BR10), title/tags rules (BR12, BR13)
- [x] Debounce flush on tab-close/panel-close/navigation (BR11)
- [x] Autosave existence-check guard against delete race (BR14)
- [x] `_syncURL()` via `history.replaceState` (BR19)
- [x] Drag-and-drop wiring for tab drag-to-split/merge (Flow 3/4 in business-logic-model.md)
- [x] Delete-while-open handling: listen for the delete flow's completion (from sessions.js) and auto-close that tab (BR4) — implemented as `SessionPanel.closeTab()` called from `js/sessions.js`'s confirm-delete handler
- [x] Page-load wiring via `window.addEventListener("load", ...)` — **not** `window.onload =`, to avoid clobbering `sessions.js`'s existing `window.onload` assignment (known-bug pattern already documented in CLAUDE.md)
- [x] `data-testid` attributes on interactive elements: tabs (`session-panel-tab`), close button (`session-panel-tab-close`), resize handle (`session-panel-resize-handle`), field inputs (`session-panel-{field}-input`), drop zones (`session-panel-drop-zone`)
- **Story mapping**: Story 1, Story 2, Story 3

### Step 5: Frontend Components Summary
- [x] Create `aidlc-docs/construction/session-detail-panel/code/frontend-summary.md` documenting what was built and any deviations from the design docs

### Step 6: Documentation Generation — `CLAUDE.md` (modify in-place)
- [x] Decisions log: retire "Sessions are double-click-to-edit inline on the card..." entry; add entries for the panel/tab/split system, hover-delete+inline-confirm, and always-expanded summary now being actually implemented
- [x] Update Phase 2 status note to reflect this sub-feature's completion

## Explicitly Out of Scope (N/A for this project)
- Business Logic / API / Repository layers — no backend exists
- Database Migration Scripts — no schema changes (all fields already exist on Session)
- Automated Unit Testing — no test framework in this project; manual verification in Build and Test
- Deployment Artifacts — static GitHub Pages hosting, no build/deploy pipeline in scope

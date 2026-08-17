# Frontend Components — Unit: session-detail-panel

**No backend/API** — "integration points" below refer to `storage.js` (localStorage), not network endpoints.

## Component Hierarchy
```
sessions.html
├── #session-list (existing, extended)
│   └── .session-card (per session)
│       ├── normal state: title, date, tags, summary (always expanded)
│       ├── hover state: + delete button
│       └── confirming state (BR15): delete button replaced by "Delete this session? [Confirm] [Cancel]"
│
└── #session-panel-container (new, rendered/managed by sessionPanel.js)
    └── .panel-pane (1 to 3, per PanelState.panes)
        ├── .pane-tab-bar (tabs for sessions open in this pane)
        ├── .pane-resize-handle (drag to resize, FR4 — this pane only)
        └── .pane-content (active tab's editable fields)
            ├── title input
            ├── date input
            ├── inGameDate input
            ├── tags input
            └── summary textarea
```

## State Per Component

**`.session-card`**
- Props: session object
- Local UI state: `isConfirmingDelete` (boolean, from `DeleteConfirmState`)

**`#session-panel-container`**
- State: `PanelState.panes` (see domain-entities.md) — owned entirely by `SessionPanel`

**`.panel-pane`**
- Props: `paneId`, `tabs`, `activeTabSessionId`, `widthPx`
- Local UI state: drag-in-progress flag (for showing drop-zone highlights per BR6), current draft field values for the active tab (before debounce fires)

## User Interaction Flows
See `business-logic-model.md` for the full flows (Open, Switch Tab, Drag-to-Split, Merge, Edit/Autosave, Delete, Restore-from-URL). Summary of DOM-level triggers:
- `dblclick` on `.session-card` → `SessionPanel.open(sessionId)`
- `click` on delete button → confirm state (BR15/BR18)
- `click` Confirm/Cancel → BR16/BR17
- `click` on a tab → `SessionPanel.switchTab(sessionId)`
- `dragstart`/`dragover`/`drop` on a tab → `SessionPanel.detachToSplit()` / `mergeSplit()` per BR6/BR7
- `mousedown`+drag on `.pane-resize-handle` → `SessionPanel.resize(paneId, widthPx)` (in-memory only)
- `input` on any field in `.pane-content` → `SessionPanel.handleFieldChange()`

## Form Validation Rules
- Title: blank → `"Untitled Session"` (BR12)
- Tags: comma-split + trim (BR13)
- Date / inGameDate / summary: no validation (free text, matches existing session form behavior elsewhere in the app)

## Storage Integration Points
- `storage.loadItem(sessionId)` — populate a tab's fields when it's opened/restored from URL
- `storage.saveItem(sessionId, updatedSession)` — on debounced autosave (BR10, BR14)
- `storage.deleteItem(sessionId)` — on confirmed delete (BR16)
- `storage.listItems()` + `storage.loadItem(key)` per existing known-bug note in CLAUDE.md (listItems returns keys, not objects) — reused as-is by `renderSessions()`, no change needed here

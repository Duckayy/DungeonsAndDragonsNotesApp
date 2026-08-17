# Component Dependencies — Sessions Page: Session Detail Panel

## Dependency Matrix

| Component | Depends On | Depended On By |
|---|---|---|
| `SessionListRenderer` (sessions.js) | `storage.js`, `SessionPanel` (calls `.open()`) | `sessions.html` (script load) |
| `SessionPanel` (sessionPanel.js) | `storage.js`, `SessionListRenderer` (calls `renderSessions()`), `location`/URL API | `sessions.html` (script load) |
| `storage.js` | none (leaf) | `SessionListRenderer`, `SessionPanel`, `campaigns.js` (existing, unrelated to this feature) |

## Script Load Order (sessions.html)
```
storage.js → sessions.js → sessionPanel.js
```
`sessionPanel.js` loads after `sessions.js` since it calls `renderSessions()`; both depend on `storage.js` being loaded first (existing pattern already used by `sessions.js`).

## Communication Pattern
Direct function calls in shared global scope (no event bus, no framework) — consistent with the rest of the app (per CLAUDE.md: vanilla JS, no frameworks). `SessionPanel` is a global object (`window.SessionPanel` implicitly, via `const SessionPanel = {...}`), so `sessions.js` can call `SessionPanel.open(id)` directly, and `sessionPanel.js` can call the existing global `renderSessions(campaignId)` directly.

## Data Flow
1. Page load → `sessions.js` renders list for `?campaign=` → `SessionPanel.initFromURL()` restores any `open`/`split` panels
2. Double-click a card → `SessionPanel.open(id)` → panel renders, URL updates
3. Edit a field in the panel → `SessionPanel.handleFieldChange()` → debounced `storage.saveItem()` → `renderSessions()` refreshes the list card
4. Drag a tab out → `SessionPanel.detachToSplit(id)` → second pane renders, URL `split` param updates
5. Hover + click delete on a list card → inline confirm on the card → confirm → `storage.deleteItem()` → `renderSessions()` (panel, if that session was open, is unaffected unless explicitly closed too — Functional Design will define this edge case)

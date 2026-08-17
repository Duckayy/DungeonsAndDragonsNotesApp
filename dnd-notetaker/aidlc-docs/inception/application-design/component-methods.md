# Component Methods — Sessions Page: Session Detail Panel

**Note**: Signatures and high-level purpose only. Detailed business rules (exact debounce timing, drag-drop thresholds, state transition rules) are defined in Functional Design (Construction phase).

## SessionListRenderer (`js/sessions.js`)

| Method | Input | Output | Purpose |
|---|---|---|---|
| `renderSessions(campaignId)` | campaign id | (renders DOM) | Renders all session cards for a campaign, summary always expanded |
| `handleSessionDoubleClick(sessionId)` | session id | none | Calls `SessionPanel.open(sessionId)` |
| `handleDeleteClick(sessionId)` | session id | none | Swaps the card into inline confirm state |
| `confirmDelete(sessionId)` | session id | none | Deletes via `storage.js`, re-renders list |
| `cancelDelete(sessionId)` | session id | none | Reverts the card to its normal state |

## SessionPanel (`js/sessionPanel.js`) — namespace object

| Method | Input | Output | Purpose |
|---|---|---|---|
| `SessionPanel.initFromURL()` | none (reads `location.search`) | none (renders) | On page load, restores open tabs/split panes from `open`/`split` URL params |
| `SessionPanel.open(sessionId)` | session id | none | Opens a session as a new tab (or activates it if already open); updates URL |
| `SessionPanel.closeTab(sessionId)` | session id | none | Closes that session's tab; updates URL; if it was the last tab, panel closes entirely |
| `SessionPanel.switchTab(sessionId)` | session id | none | Makes that tab the active/visible one within its pane |
| `SessionPanel.detachToSplit(sessionId)` | session id | none | Drags a tab out into a second side-by-side pane; updates `split` URL param |
| `SessionPanel.mergeSplit(sessionId)` | session id | none | Drags a split pane's tab back into the main tab bar; clears `split` URL param |
| `SessionPanel.resize(paneId, widthPx)` | pane id, pixel width | none | Resizes a pane's drawer width (in-memory only, not URL-persisted) |
| `SessionPanel.handleFieldChange(sessionId, field, value)` | session id, field name, new value | none | Updates in-memory draft, debounces a `storage.js` save, then triggers `renderSessions()` so the list card stays current |
| `SessionPanel._syncURL()` | none | none (internal) | Writes current `open`/`split` state to the URL via `history.replaceState` |

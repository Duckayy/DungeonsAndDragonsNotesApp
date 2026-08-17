# Services — Sessions Page: Session Detail Panel

## Existing Service: Storage Service (`js/storage.js`)
No changes to its interface. Both `SessionListRenderer` and `SessionPanel` call it directly:
- `loadItem(key)` / `saveItem(key, value)` / `deleteItem(key)` / `listItems()`

## No New Orchestration Layer
Per the Application Design plan (Question 2: simple namespace object, not a separate controller layer), `SessionListRenderer` and `SessionPanel` each call `storage.js` directly rather than routing through an intermediate orchestration/controller service. This matches the rest of the codebase's existing pattern (no service layer exists elsewhere either) and keeps the feature consistent with the app's current architecture — no new abstraction layer is being introduced for this feature.

## Coordination Between the Two Components
`SessionListRenderer` and `SessionPanel` coordinate directly (not through a shared service):
- `SessionListRenderer` calls `SessionPanel.open(sessionId)` on double-click
- `SessionPanel` calls `renderSessions(campaignId)` (from `SessionListRenderer`) after a debounced save, so the list card reflects the latest edit

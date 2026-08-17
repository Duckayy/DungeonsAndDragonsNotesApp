# Application Design — Sessions Page: Session Detail Panel

**Consolidates**: components.md, component-methods.md, services.md, component-dependency.md

## Summary
Two components: `SessionListRenderer` (extends existing `sessions.js`) and a new `SessionPanel` namespace object in a new `js/sessionPanel.js` file. No new orchestration/service layer — both call `storage.js` directly and coordinate with each other via direct function calls, matching the app's existing no-framework, no-build-step architecture.

## Components
See [components.md](components.md) for full detail.
- **SessionListRenderer** (`js/sessions.js`, extended): session list, hover-delete + inline confirm, hands off double-click to `SessionPanel.open()`
- **SessionPanel** (`js/sessionPanel.js`, new): panel/tab/split subsystem, field editing, autosave, URL state sync

## Component Methods
See [component-methods.md](component-methods.md) for full signatures.

## Services
See [services.md](services.md). No new service layer — `storage.js` used directly by both components.

## Component Dependencies
See [component-dependency.md](component-dependency.md). Load order: `storage.js → sessions.js → sessionPanel.js`.

## Open Decisions / Assumptions to Verify
1. **URL param scope** (from plan Question 3 follow-through): `open` (comma-separated open session IDs) and `split` (which two are side-by-side) are URL-persisted; resize width is not. Flag if this split is wrong.
2. **Delete-while-open edge case**: What happens if a session is deleted from the list while its panel tab is currently open? Not yet defined — needs an explicit rule in Functional Design (e.g. auto-close that tab, or block delete while open, or show a "this session was deleted" state in the panel).
3. **Autosave-then-delete race**: If a debounced save is pending when a delete happens elsewhere, is there a conflict? Likely resolved naturally by delete removing the storage key, but worth Functional Design confirming the save doesn't recreate a deleted session.

These three feed directly into Functional Design as its starting point.

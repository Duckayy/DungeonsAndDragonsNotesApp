# Requirements — Sessions Page: Session Detail Panel

## Intent Analysis Summary
- **User Request**: "Once you click on a campaign, it should be similar to OneNote — each session is a card that opens up on the side if you double-click. It's a reconfigurable card that takes up a chunk of the site's space, and it should have the function to write in it."
- **Request Type**: Enhancement (to the in-progress Phase 2 Session Notes / Campaigns feature)
- **Scope Estimate**: Multiple Components (`sessions.html`, `sessions.js`, `css/style.css`; `storage.js` usage pattern changes via auto-save)
- **Complexity Estimate**: Complex — escalated from an initial "Moderate" estimate once clarifying answers revealed a tab-management + drag-to-split-view system, not just a single resizable drawer

## Functional Requirements

### Session list (campaign view)
- FR1: Session cards continue to show the summary always expanded (existing decision, unchanged).
- FR2: A delete button appears on a session card **on hover only**. There is no separate "edit mode" or "double-click state" on the list card anymore — this replaces the previous "double-click-to-edit inline" decision.
- FR2a: Clicking the delete button prompts a **confirmation shown on the card itself** — the card's content swaps to (or reveals) a "Delete this session?" Confirm/Cancel state in place. No modal, popup, or `window.confirm()` dialog — the confirmation stays inline on the card. No single click is destructive.

### Opening a session (the panel)
- FR3: Double-clicking a session card opens that session in a **side panel** — a drawer that slides in from the right edge of the screen, overlaying part of the page. The session list remains visible behind/beside it.
- FR4: The panel is **resizable** — the user can drag its edge to make it bigger or smaller.
- FR5: All session fields are visible and editable inside the panel: title, date, inGameDate, summary, tags.
- FR6: The summary field is a plain-text `<textarea>` for this version — no rich text or Markdown formatting (Markdown editing remains a separate, not-yet-started roadmap phase per CLAUDE.md).
- FR7: Edits made in the panel **auto-save** (debounced) directly to localStorage via `storage.js`. There is no explicit Save button/action.

### Multiple sessions open at once
- FR8: Double-clicking a second session while a panel is already open adds it as a **new tab** within the same panel system, rather than replacing the first.
- FR9: Tabs are **swappable** — clicking a tab switches which session's content is shown in the panel.
- FR10: A tab can be **dragged out** of the tab bar to create a **side-by-side split view**, showing two (or more) sessions' panels simultaneously.

## Non-Functional Requirements
- NFR1 (Usability): Drag interactions (panel resize, tab drag-to-split) must have clear visual affordances (cursor change, drag handle, drop-zone indication) since this is a new interaction pattern for the app.
- NFR2 (Data integrity): Auto-save must not lose data on rapid edits or rapid panel close — debounce should flush pending writes on close/navigation, not just on a timer.
- NFR3 (Consistency, revised during Application Design): Panel state — which session(s) are open and the split-view arrangement — is reflected in the URL's query params, so a page refresh restores the same panel/tab/split layout. This matches the existing `?campaign=camp_123` pattern (shareable, refresh-safe) and requires no `storage.js`/localStorage schema changes — it's URL-only, not persisted data. Transient UI chrome (panel resize width) is NOT persisted and resets to a default on reload.
- NFR4 (Extensions — Property-Based Testing, Partial): No new pure/serialization functions are anticipated here beyond existing `storage.js` save/load, which are already in scope for PBT per `aidlc-state.md`. No PBT-specific new obligations from this feature.
- Security Baseline / Resiliency Baseline: N/A (both off per project configuration — no auth, no cloud infra).

## Architectural / Technical Considerations
- This introduces a genuinely new stateful UI subsystem — a panel/tab manager — that doesn't map cleanly onto the existing simple render-function style of `sessions.js`. It likely warrants its own **Application Design** pass to define it as a component with clear methods (open, closeTab, switchTab, detachToSplit, resize, autosave-on-change) rather than growing organically inside `renderSessions()`.
- The existing decision-log entry "Sessions are double-click-to-edit inline on the card; entering edit mode reveals a delete button on the card" is **superseded** by this feature and should be updated once implementation lands (double-click → opens panel; delete → hover-only on card).
- Drag-to-split is the highest-complexity single piece of this request (essentially a small window-manager). Given the project's MVP-first principle, this is being built as specified now (per your explicit confirmation), but it's worth calling out as the most likely place scope could balloon during Construction — I'll flag if it does.

## Summary
Sessions gain a OneNote-style detail panel: double-click opens a resizable, all-fields-editable, auto-saving side drawer; opening multiple sessions creates swappable tabs; tabs can be dragged out into a side-by-side split view. The old inline-card-edit interaction is retired in favor of this panel, and the delete button moves to hover-only on the list card.

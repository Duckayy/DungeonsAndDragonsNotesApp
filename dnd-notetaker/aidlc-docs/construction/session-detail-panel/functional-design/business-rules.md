# Business Rules — Unit: session-detail-panel

## Panel & Tabs
- BR1: Double-clicking a session already open in some pane just activates that tab (switches to it) — does not open a duplicate tab.
- BR2: Closing a tab that isn't the last one in its pane switches that pane's active tab to the next remaining one (order-based, e.g. previous tab in the list).
- BR3: Closing the last tab in a pane removes that pane entirely; if it was the only pane, the whole panel closes and the view returns to the plain session list.
- BR4: Deleting a session that has an open tab (from Q1=A) auto-closes that tab immediately, following BR2/BR3 for what happens to its pane.

## Split View
- BR5: Maximum of 3 panes at once (Functional Design clarification). While 3 panes are already open, drag-to-split drop zones are not shown/active — dragging a tab while at cap just snaps it back to its own pane's tab bar (no-op).
- BR6: Drop zones for creating a new pane appear at each boundary: before the first pane, between each pair of adjacent panes, and after the last pane. Dropping in a boundary zone creates a new pane at that position, containing only the dragged tab (it's removed from its origin pane, applying BR2/BR3 there).
- BR7: Drop zones are only for *creating a new pane*, not for reordering already-split panes — dropping a tab back within its own pane's boundary zones is a no-op/snap-back.
- BR8: If dragging a tab out empties its origin pane (BR3), the origin pane disappears and remaining panes reflow to fill the freed width.

## Editing & Autosave
- BR9: Field edits (title, date, inGameDate, summary, tags) update an in-memory draft immediately (so the field feels responsive) and trigger a debounced save.
- BR10: Autosave debounce delay: 1500ms after the last keystroke in any field.
- BR11: Closing a tab, closing the panel, or navigating away flushes any pending debounced save immediately rather than discarding it.
- BR12: Title defaults to `"Untitled Session"` if left blank — reuses the exact rule from the existing new-session form handler.
- BR13: Tags are parsed via `.split(",").map(s => s.trim())` — reuses the exact existing pattern, same as BR12.
- BR14: Before an autosave write executes, check the session's storage key still exists (`storage.loadItem` returns non-null). If it was deleted in the meantime (race with BR4), skip the write instead of recreating a deleted session.

## Delete Confirmation (list card)
- BR15: Clicking a card's delete button swaps that card's content to an inline "Delete this session? Confirm/Cancel" state (FR2a) — no popup/modal.
- BR16: Confirming deletes via `storage.deleteItem()`, applies BR4 if that session had an open tab, then re-renders the list.
- BR17: Canceling reverts the card to its normal display; no other card's state is affected.
- BR18: Only one card can be in the confirm state at a time — clicking delete on a different card while one is already confirming cancels the first one automatically.

## URL State Sync
- BR19: `open` and `split` URL params update via `history.replaceState` (not `pushState`) after every panel state change — panel interactions don't create new browser-history entries (matches the existing `?campaign=` pattern's behavior of not spamming back-button history).
- BR20: On page load, `SessionPanel.initFromURL()` parses `open`/`split` and reconstructs panes; if a referenced session ID no longer exists in storage (e.g. deleted from another tab/session), that ID is silently dropped from the reconstructed state rather than erroring.

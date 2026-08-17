# Business Logic Model — Unit: session-detail-panel

## Flow 1: Open a Session
1. User double-clicks a session card in the list
2. `SessionPanel.open(sessionId)` runs
3. If `sessionId` is already open in some pane (BR1) → activate that tab, done
4. Otherwise → add `sessionId` as a new tab in the main pane (creating the panel/pane if none exists yet), make it the active tab
5. Sync `open`/`split` URL params (BR19)

## Flow 2: Switch Tabs
1. User clicks a tab within a pane
2. `SessionPanel.switchTab(sessionId)` sets that pane's `activeTabSessionId`
3. Re-render that pane's content only

## Flow 3: Drag Tab to Split
1. User starts dragging a tab
2. If panes are already at cap (3) → no drop zones shown, drag ends in a snap-back (BR5)
3. Otherwise → boundary drop zones (before/between/after existing panes) highlight (BR6)
4. On drop in a valid zone → `SessionPanel.detachToSplit(sessionId, position)`:
   - Remove `sessionId` from its origin pane's tabs (applying BR2/BR3/BR8 to that pane)
   - Create a new pane at `position` containing only `sessionId` as its single tab
5. Sync URL (`split` param now includes this pane's anchor session)

## Flow 4: Merge Pane Back to Tab Bar
1. User drags a pane's only/active tab back into an adjacent pane's tab bar (or the pane naturally empties per BR8 during Flow 3 elsewhere)
2. `SessionPanel.mergeSplit(sessionId)` moves that tab into the target pane's tab list, removes the now-empty origin pane
3. Sync URL

## Flow 5: Edit a Field (Autosave)
1. User types in a field (title/date/inGameDate/summary/tags) inside the active tab of some pane
2. `SessionPanel.handleFieldChange(sessionId, field, value)`:
   - Applies BR12 (title default) / BR13 (tags parsing) if applicable
   - Updates in-memory draft for that session immediately (field feels live)
   - (Re)starts a 1500ms debounce timer (BR10) for that session
3. On timer fire → BR14 existence check → `storage.saveItem()` → `renderSessions(campaignId)` so the list card reflects the change
4. On tab close / panel close / navigation → flush pending timer immediately (BR11)

## Flow 6: Delete a Session (List Card)
1. User hovers a card → delete button appears (FR2)
2. Click → BR18 (cancel any other card's confirm) → card swaps to inline Confirm/Cancel (BR15)
3. **Cancel** → card reverts (BR17)
4. **Confirm** →
   - `storage.deleteItem(sessionId)`
   - If `sessionId` has an open tab anywhere → BR4 auto-close flow (→ Flow "Close Tab", reusing BR2/BR3/BR8)
   - `renderSessions(campaignId)` re-renders the list without it

## Flow 7: Page Load / Restore from URL
1. `sessions.js` renders the list for `?campaign=`
2. `SessionPanel.initFromURL()` parses `open`/`split`, drops any session IDs no longer in storage (BR20), reconstructs panes and tabs accordingly, renders the panel(s) if any remain

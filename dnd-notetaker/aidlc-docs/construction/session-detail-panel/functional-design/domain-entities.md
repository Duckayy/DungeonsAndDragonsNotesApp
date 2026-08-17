# Domain Entities — Unit: session-detail-panel

## Session (existing, unchanged)
```js
{
  id: "session_...",
  title: "The Mines of Kharduun",
  date: "2025-03-01",
  inGameDate: "14th of Mirtul",   // optional
  summary: "...",
  tags: ["combat", "loot"],
  createdAt: 1715000000000,
  campaignId: "camp_..."
}
```
No schema changes. Persisted via `storage.js`.

## PanelState (new, transient — in-memory + partially URL-mirrored)
Not persisted to `storage.js`. Lives only for the current page view.

```js
{
  panes: [
    {
      paneId: "pane_1",              // stable per pane while it exists
      tabs: ["session_a", "session_b"], // ordered session IDs open in this pane
      activeTabSessionId: "session_a",  // which tab is currently shown
      widthPx: null                     // in-memory only, null = default width, NOT URL-persisted
    }
    // up to 3 panes total (business-rules.md: max pane cap)
  ]
}
```

**URL mirroring** (query params on `sessions.html?campaign=...`):
- `open`: comma-separated list of ALL open session IDs across all panes, in the order they were opened (e.g. `open=session_a,session_b`)
- `split`: comma-separated list of one session ID per pane, identifying which session anchors each additional pane beyond the first (e.g. `split=session_b` means session_b is peeled into its own pane). The first/main pane is implicit (whatever's left in `open` that isn't listed in `split`).
- `widthPx` is never URL-persisted (business-rules.md).

## DeleteConfirmState (new, transient — per list card)
Not a global object — effectively a per-card boolean/flag tracked via a DOM data-attribute or a small in-memory Set of session IDs currently showing their inline confirm state.
```js
// conceptually:
confirmingDeleteIds: Set<sessionId>
```

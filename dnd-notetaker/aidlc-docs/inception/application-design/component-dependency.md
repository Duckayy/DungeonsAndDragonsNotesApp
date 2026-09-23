# Component Dependencies — Full Stack Pivot (Phase 0)

## Dependency Matrix

| Component | Depends On |
|---|---|
| `supabaseClient.js` | (none — leaf component, just SDK config) |
| `auth.js` | `supabaseClient.js` |
| `storage.js` | `supabaseClient.js`, `auth.js` (to scope queries to current user) |
| `visibilityToggle.js` | `storage.js` |
| `revisionHistory.js` | `storage.js` |
| `campaignInvites.js` | `storage.js`, `auth.js` |
| `sessions.js` / `sessionPanel.js` | `storage.js`, `visibilityToggle.js`, `revisionHistory.js`, `campaignInvites.js` |
| `app.js` | `auth.js` (for auth-aware nav) |
| `characters.js` / `world.js` (future, Phase 3/4) | `storage.js`, `visibilityToggle.js`, `revisionHistory.js` (same reuse pattern as sessions) |

## Communication Pattern
Strictly layered, no circular dependencies:

```
supabaseClient.js
      ↑
   auth.js
      ↑
  storage.js  ←──────────────┐
      ↑                       │
visibilityToggle.js   revisionHistory.js   campaignInvites.js
      ↑                       ↑                    ↑
      └───────────── sessionPanel.js / sessions.js ┘
                              ↑
                           app.js (nav only)
```

## Notes
- No component below `storage.js` in this chain ever imports the Supabase SDK directly (see `services.md` orchestration rules).
- `characters.js`/`world.js` are placeholders in this dependency graph — they don't exist yet, but when Phase 3/4 are built they slot into the same position as `sessions.js`, reusing the same UI components rather than duplicating visibility/revision/invite logic.

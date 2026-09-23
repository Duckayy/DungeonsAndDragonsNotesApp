# Services — Full Stack Pivot (Phase 0)

This app has no separate backend server — Supabase itself (Postgres + Auth + RLS) is the "service
layer" in the traditional sense. What's documented here is orchestration on the frontend: which
component talks to Supabase directly vs. through another component.

## Orchestration Rules
- **Only `supabaseClient.js` touches the Supabase SDK directly.** Every other component goes through either `storage.js` (data) or `auth.js` (identity) — neither `sessions.js`, `sessionPanel.js`, `visibilityToggle.js`, `revisionHistory.js`, nor `campaignInvites.js` import the Supabase SDK themselves.
- **`storage.js` is the only data-access path** for sessions/campaigns/characters/world/personal-notes/revisions. `visibilityToggle.js`, `revisionHistory.js`, and `campaignInvites.js` all call through `storage.js`, not Supabase directly — this keeps the "swap the backend later" seam intact for whatever comes after Supabase, if anything ever does.
- **`auth.js` is the only identity path.** Pages check `auth.getCurrentUser()` / `auth.onAuthChange()` rather than querying Supabase Auth directly.
- **RLS is enforced server-side regardless of what the frontend does.** The orchestration rules above are for code organization and the seam-preservation goal — they are not the security boundary. Even if a component bypassed `storage.js` and called Supabase directly, RLS policies still apply.

## Data Flow (typical case: DM edits a session)
1. `sessionPanel.js` calls `storage.saveItem('session', updatedSession)`
2. `storage.js` calls `supabaseClient.getClient()` and issues the write
3. Supabase's RLS policy checks the authenticated user (from `auth.js`'s session) owns that campaign row → allows the write
4. On success, `storage.js` also writes a new row via the revisions mechanism (Story 9) so history stays current

## Data Flow (typical case: Player views a campaign)
1. Page loads, calls `auth.getCurrentUser()` to confirm logged in
2. Calls `storage.listItems('session')` scoped to the campaign
3. Supabase RLS filters results server-side: only rows where `visible_to_players = true` (or the player's own personal notes) come back — the frontend never receives hidden rows to begin with, it doesn't have to filter them out itself

# Component Methods — Full Stack Pivot (Phase 0)

Method signatures only — business rules (e.g., exact validation, error handling) are defined later
in Functional Design, per unit.

## `storage.js` (unchanged signatures)
- `saveItem(type, item)` → saves a session/campaign/etc.; now writes to Supabase
- `loadItem(type, id)` → returns one item by id
- `deleteItem(type, id)` → deletes one item
- `listItems(type)` → returns keys/ids for a type (existing gotcha applies: caller still needs `loadItem` per key — unchanged behavior, see CLAUDE.md known bugs)

## `supabaseClient.js`
- `getClient()` → returns the singleton configured Supabase client instance

## `auth.js`
- `signup(email, password)` → creates a Supabase Auth account
- `login(email, password)` → authenticates, sets session
- `logout()` → clears session
- `getCurrentUser()` → returns current logged-in user (or null)
- `onAuthChange(callback)` → subscribes to login/logout events, for pages that need to react (e.g., redirect, update nav)

## `visibilityToggle.js`
- `renderVisibilityToggle(container, note, onChange)` → renders a toggle control for a given note; calls `onChange(newVisibility)` when changed
- `isVisibleToPlayers(note)` → reads the note's visibility flag

## `revisionHistory.js`
- `renderRevisionHistory(container, noteId)` → renders the list of past revisions for a note
- `restoreRevision(noteId, revisionId)` → restores a prior revision non-destructively (creates a new revision on top, per Story 10)

## `campaignInvites.js`
- `inviteMember(campaignId, email)` → invites a player by email
- `revokeMember(campaignId, memberId)` → revokes a player's access
- `listMembers(campaignId)` → returns active/pending/revoked members for the DM's management view

# Components — Full Stack Pivot (Phase 0)

## Existing Components (responsibility unchanged, implementation changes)

### `storage.js`
- **Responsibility**: The single public data-access API the rest of the app calls. Unchanged surface: `saveItem`, `loadItem`, `deleteItem`, `listItems`.
- **Change**: Internally now calls Supabase instead of reading/writing `localStorage`. Callers (`sessions.js`, `sessionPanel.js`, future `characters.js`/`world.js`) need no changes.

### `sessions.js` / `sessionPanel.js`
- **Responsibility**: Unchanged (session list rendering, session detail panel/tabs/autosave).
- **Change**: Session cards/panel now import and render the new `visibilityToggle.js` and `revisionHistory.js` UI pieces.

### `app.js`
- **Responsibility**: Dashboard/home screen logic. Out of Phase 0's core scope, but nav needs to become auth-aware (show login/logout, current user).

## New Components

### `supabaseClient.js`
- **Responsibility**: Owns Supabase SDK initialization (URL + public key) and exports a single configured client instance. Nothing else touches the Supabase SDK directly — everything goes through `storage.js` or `auth.js`.

### `auth.js`
- **Responsibility**: Login/signup/logout and current-session state. Exposes `getCurrentUser()`, `login()`, `signup()`, `logout()`, `onAuthChange()`. Pages import this to gate UI (e.g., hide edit controls, redirect to login).

### `visibilityToggle.js`
- **Responsibility**: Reusable UI component: DM-facing control to mark a session/character/world page visible or hidden to players (Stories 5/6/6b). Reused by `sessionPanel.js` now, and by future `characters.js`/`world.js`.

### `revisionHistory.js`
- **Responsibility**: Reusable UI component: view a note's revision list and restore an earlier version non-destructively (Stories 9/10). Reused across note types.

### `campaignInvites.js`
- **Responsibility**: Reusable UI component: DM invites a player by email, sees pending/active/revoked members, and revokes access (Stories 3/7).

### RLS Policies (Supabase, not a JS file)
- **Responsibility**: The actual enforcement layer for every permission rule in `stories.md` — DM full access to their own campaign rows, player read-only access gated by the `visible_to_players` flag, player full access to their own personal-notes rows only, zero access once revoked. Documented as its own component (per Q4) because it's the real security boundary — the JS-level UI checks (hiding buttons, etc.) are UX convenience, not the actual protection.

## Deferred (not built in Phase 0)
- `characters.js`, `world.js` — remain stubs; they'll consume `storage.js`, `auth.js`, `visibilityToggle.js`, and `revisionHistory.js` unchanged when Phase 3/4 are picked up.

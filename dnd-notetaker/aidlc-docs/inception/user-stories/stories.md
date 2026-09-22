# User Stories — Full Stack Pivot (Phase 0: Backend Migration)

Format: Given/When/Then acceptance criteria (per Q1 answer). Scope: Phase 0 only.

## Persona Map
| Story | Ashton (DM) | Player |
|---|---|---|
| 1. Sign up / log in | ✅ | ✅ |
| 2. Create a campaign | ✅ | |
| 3. Invite a player to a campaign | ✅ | |
| 4. Accept an invite / access a shared campaign | | ✅ |
| 5. Mark a note/page as visible to players | ✅ | |
| 6. View DM notes/pages marked visible, read-only | | ✅ |
| 6b. Hidden DM notes/pages are invisible to players (UI + database) | ✅ (verifies) | ✅ (attempts) |
| 7. Revoke a player's access | ✅ | |
| 8. Edit sessions/characters/world (DM's own notes) | ✅ | |
| 9. View revision history for a note | ✅ | |
| 10. Restore a previous revision | ✅ | |
| 11. Migrate existing localStorage data to Supabase | ✅ | |
| 12. Create/edit/delete own personal notes | | ✅ |
| 13. Personal notes are isolated from DM's session notes | ✅ (verifies) | ✅ (attempts) |

---

### Story 1 — Account creation and login
**As** Ashton or a Player, **I want** to sign up and log in with an account, **so that** my campaign data is tied to me and not just whichever browser I happen to be using.

- Given I don't have an account, When I sign up with an email and password, Then a Supabase Auth account is created and I'm logged in.
- Given I have an account, When I log in with correct credentials, Then I reach the app's dashboard.
- Given I enter incorrect credentials, When I try to log in, Then I see an error and am not logged in.

### Story 2 — Create a campaign
**As** Ashton (DM), **I want** to create a new campaign, **so that** I have a place to store that campaign's sessions and world info.

- Given I'm logged in, When I create a campaign with a name, Then it's saved to Supabase with me as the owner.
- Given I own a campaign, When I view my campaign list, Then I see it listed.

### Story 3 — Invite a player to a campaign
**As** Ashton (DM), **I want** to invite a player to a campaign I own, **so that** they can follow along with notes between sessions.

- Given I own a campaign, When I invite a player by email, Then that player gains view-only access to that campaign once they accept.
- Given I invite someone not yet registered, When they later sign up with that email, Then the pending invite resolves and grants access (or: the invite requires them to already have an account — **[needs confirmation before Phase 0 build]**, see Open Items below).

### Story 4 — Accept an invite / access a shared campaign
**As** a Player, **I want** to accept a campaign invite, **so that** I can see that campaign's notes.

- Given I've been invited to a campaign, When I log in, Then I see that campaign in my accessible campaign list.
- Given I have not been invited to a campaign, When I browse campaigns, Then I cannot see or discover it (per Q2 answer — invite-only visibility, no discovery).

### Story 5 — Mark a note/page as visible to players
**As** Ashton (DM), **I want** to mark a specific session, character entry, or world/location entry as visible to players, **so that** I can deliberately share things like a map or a character portrait while keeping story-critical notes hidden by default.

- Given I own a note/page in my campaign, When I create it, Then it defaults to hidden from players (not visible unless I opt it in).
- Given I own a note/page, When I mark it "visible to players," Then invited players with campaign access can view it.
- Given a note/page is marked visible, When I later mark it hidden again, Then players immediately lose the ability to view it.
- Given I have multiple note/pages in a campaign (some session notes, a map, character portraits), When I set visibility, Then each is controlled independently — there is no single campaign-wide "share everything" switch.

### Story 6 — View DM notes/pages marked visible, read-only
**As** a Player, **I want** to view the specific DM notes/pages the DM has chosen to share (e.g., a map, character portraits), **so that** I can reference what the DM intends me to see, without being exposed to hidden, story-critical notes.

- Given a note/page has been marked visible to players, When I open it, Then I can read it.
- Given I have access to a campaign, When I browse it, Then I only see the notes/pages marked visible — hidden ones don't appear in any list, search, or navigation, not just their content.
- Given I view a visible note/page, When I look for edit controls (save, delete), Then none are shown to me.

### Story 6b — Hidden DM notes/pages are invisible to players (defense in depth)
**As** the system, **I want** to reject any read (and write) attempt from a Player against a DM note/page not marked visible, **so that** story-critical secrets can't leak even if the UI has a bug, a direct link is guessed/shared, or someone queries Supabase directly.

- Given a DM note/page is not marked visible to players, When a Player's read request reaches Supabase (regardless of UI state or a guessed direct URL), Then the Postgres Row Level Security policy returns nothing for that row.
- Given a DM note/page is marked visible, When a Player reads it, Then the RLS policy allows read but not write.
- Given a Player has only view access, When a write request against any DM note/page (visible or hidden) reaches Supabase, Then the RLS policy rejects it — visibility controls read access only, never write.
- Given Ashton owns a campaign's notes, When Ashton reads or writes them, Then the RLS policy allows it regardless of the visibility flag (visibility is a player-facing restriction, not a DM restriction).
- (Contrast with Story 12/13: a Player *can* write to their own personal notes — the RLS policy distinguishes "DM's notes" from "this player's own notes" as separate row ownership, not a single campaign-wide read/write toggle.)

### Story 7 — Revoke a player's access
**As** Ashton (DM), **I want** to revoke a player's access to a campaign, **so that** I can remove someone who's no longer in the game.

- Given a player has access to my campaign, When I revoke their access, Then they immediately lose all access — no read or write — to that campaign's DM notes and to their own personal notes within it, enforced at the RLS level, not just hidden in the UI.
- Given access has been revoked, When that player later logs in, Then the campaign no longer appears in their list at all.

### Story 8 — Edit sessions/characters/world
**As** Ashton (DM), **I want** to create, edit, and delete notes in my campaign, **so that** I can keep the campaign record up to date — same capability the app already has today, now backed by Supabase instead of localStorage.

- Given I own a campaign, When I create/edit/delete a session (or character/world entry, once those phases exist), Then the change is saved to Supabase and visible to invited players (read-only) immediately.

### Story 9 — View revision history for a note
**As** Ashton (DM), **I want** to see previous versions of a note I've edited, **so that** I can recall what changed or when.

- Given a note has been edited more than once, When I open its revision history, Then I see a list of prior versions with timestamps.
- Given a note has never been edited, When I open its revision history, Then I see only the current (single) version.

### Story 10 — Restore a previous revision
**As** Ashton (DM), **I want** to restore an earlier version of a note, **so that** I can undo an unwanted change without losing anything.

- Given I'm viewing a note's revision history, When I choose to restore an earlier version, Then that version becomes the current content AND a new revision entry is created capturing what the note looked like just before the restore (per Q4 — non-destructive; nothing is silently dropped).
- Given I restore a revision, When I view the history afterward, Then both the restored version and the pre-restore version are still visible in history.

### Story 11 — Migrate existing localStorage data to Supabase
**As** Ashton, **I want** to move my existing campaigns/sessions from localStorage into Supabase, **so that** I don't lose the notes I've already written before this migration.

- Given I have existing campaign/session data in localStorage, When I run the migration step, Then that data appears under my account in Supabase, owned by me.
- Given the migration has run once, When I run it again, Then it does not duplicate already-migrated data (idempotent, or a one-time-only guard — **[needs a decision during Phase 0 Functional Design, not blocking here]**).

### Story 12 — Create/edit/delete own personal notes
**As** a Player, **I want** my own notes within a campaign I'm part of, **so that** I can keep theories, reminders, or in-character journal entries without touching the DM's canon session notes.

- Given I have access to a campaign, When I create a personal note, Then it's saved under my account, scoped to that campaign.
- Given I have personal notes in a campaign, When I edit or delete one, Then the change applies only to my own note.
- Given another player is also in the campaign, When I view my personal notes, Then I do not see that other player's personal notes (each player's notes are isolated from other players too, not just from the DM).

### Story 13 — Personal notes are isolated from DM's session notes (defense in depth)
**As** the system, **I want** a Player's personal notes to live in a separate, distinctly-permissioned space from the DM's session notes, **so that** a player's read/write access to their own notes never accidentally grants write access to the DM's canon notes.

- Given a Player writes to their own personal note, When the request reaches Supabase, Then the RLS policy allows it because they own that row.
- Given a Player attempts to write to a DM-owned session note using the same code path as Story 12, When the request reaches Supabase, Then the RLS policy rejects it, because DM notes and personal notes are separate tables/row-ownership, not a single shared permission flag.

---

## Open Items (flagged for Phase 0 Functional Design, not blocking Story approval)
- Story 3: exact invite mechanics for a not-yet-registered email (invite-then-signup vs. signup-required-first) — noted inline above.
- Story 11: exact re-run/idempotency behavior for the migration helper.
- Story 12: whether the DM can read (not edit) a player's personal notes, or they're fully private to that player. Doesn't change which stories exist, only an RLS/UI detail — safe to decide during Phase 0 design rather than now.
- Story 5/6: exact visibility granularity is per note/page (a session, a character entry, a location entry) per the DM's map/character-image examples — confirmed, not open. What's still open for Functional Design: whether visibility is a simple boolean per note, or needs finer control later (e.g., visible-to-all-players vs. visible-to-specific-players) — Phase 0 only needs the boolean; per-player visibility is a possible future enhancement, not required now.

These are implementation-detail questions appropriate for Functional Design when Phase 0 is picked up, not Requirements/Stories.

## Note on Scope Beyond Phase 0
Ashton indicated this should be planned as a fully-fledged app rather than a minimal MVP — this shifts how ambitiously Workflow Planning should scope Phases 3-5 and revisit previously-deferred items (realtime sync, offline/PWA support, Security Baseline extension). That's a Workflow Planning / roadmap-breadth concern, not a Phase 0 story — captured here so it carries forward, addressed next stage.

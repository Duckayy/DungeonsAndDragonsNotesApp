# Story Generation Plan — Full Stack Pivot (Phase 0 focus)

## Scope
Stories cover **Phase 0 (Backend Migration)** only — the new DM/player accounts, permissions, and
revision history. Phases 3/4/5 (Characters, World-Building, Polish) keep their existing informal
scope from CLAUDE.md and will get their own stories later, per-unit, when picked up — writing detailed
stories for unbuilt, unscoped features now would be speculative.

## Personas (draft, to confirm via questions below)
- **Ashton (DM / Campaign Owner)** — creates campaigns, writes/edits all notes, invites players
- **Player** — invited to a specific campaign, can view sessions/characters/world for that campaign, cannot edit

## Story Breakdown Approach
**Persona-Based**, grouped by DM stories vs. Player stories, since the entire point of this stage is
nailing down the boundary between those two roles. (Feature-based was considered but would scatter
the DM/player permission boundary across unrelated feature groups.)

## Execution Checklist
- [x] Generate `aidlc-docs/inception/user-stories/personas.md` (DM, Player)
- [x] Generate `aidlc-docs/inception/user-stories/stories.md` covering:
  - [x] Account creation / login (DM and Player)
  - [x] Campaign creation and ownership (DM)
  - [x] Inviting a player to a campaign (DM)
  - [x] Accepting an invite / accessing a shared campaign (Player)
  - [x] Viewing sessions/characters/world in a shared campaign, read-only (Player)
  - [x] Attempting to edit as a Player is blocked, both in UI and at the database level (Player + DM, negative case)
  - [x] Revoking a player's access to a campaign (DM) — added per Q3 answer, in scope for Phase 0
  - [x] Editing sessions/characters/world (DM)
  - [x] Viewing revision history for a note (DM)
  - [x] Restoring a previous revision (DM)
  - [x] One-time migration of existing localStorage campaign/session data into Supabase (Ashton, one-off)
- [x] Each story follows INVEST criteria, with acceptance criteria as a Given/When/Then list
- [x] Map each story to its persona(s) in a table at the top of stories.md

## Clarifying Questions

### Q1: Acceptance criteria format
A) Given/When/Then (Gherkin-style) — more formal, reads like a test spec
B) Simple checklist bullets ("Player can view X", "Player cannot edit Y") — faster to read, less formal
C) Other (describe)

[Answer]: A

### Q2: Can players see *which* campaigns they're in, or only campaigns they're explicitly invited to?
A) Only campaigns they've been explicitly invited to (no discovery/browsing of other campaigns)
B) Other (describe)

[Answer]: A

### Q3: When a player is removed from a campaign (or an invite is revoked), what should happen?
A) Out of scope for Phase 0 — revoking access isn't needed yet, add later if it comes up
B) Must be in scope now — DM can revoke a player's access to a campaign
C) Other (describe)

[Answer]: B

### Q4: Should the "restore a previous revision" story overwrite the current note, or create a new revision on top (so nothing is ever truly lost)?
A) Restoring creates a new revision on top of history (non-destructive, preferred default for a note-history feature)
B) Restoring overwrites the current version directly (simpler, but the pre-restore version could be lost if not itself in history)
C) Other (describe)

[Answer]: A

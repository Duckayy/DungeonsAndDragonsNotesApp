# Personas — Full Stack Pivot (Phase 0)

## Ashton — DM / Campaign Owner
- **Role**: Creates and runs D&D campaigns; the app's original and primary user.
- **Goals**: Keep all session notes, characters, and world info in one place; let players follow along between sessions without giving up edit control; never lose a note to an accidental overwrite (motivates revision history).
- **Technical context**: Building the app himself — a beginner JS developer, so Phase 0 must keep `storage.js`'s existing call shape stable for him to reason about.
- **Permissions**: Full read/write on every campaign they own; can invite and revoke player access.

## Player — Invited Campaign Member
- **Role**: A player in Ashton's D&D game, invited to a specific campaign.
- **Goals**: Recap what happened last session, look up their character or a location, without needing to ask the DM to re-explain — and keep their own personal notes (theories, reminders, in-character journal entries) without being able to touch the DM's canon session notes.
- **Technical context**: Not a developer — expects a simple login, no special setup.
- **Permissions**:
  - **DM's session notes** (campaign sessions/characters/world as written by the DM): view-only, and **only for individual notes/pages the DM has explicitly marked visible to players**. Hidden is the default for any DM note/page — a session, a character entry, or a world/location entry only becomes visible to players once the DM opts it in (e.g., a map or character portrait the DM wants to share), so story-critical notes stay invisible unless deliberately shared. This is enforced at the database level, not just hidden UI — an unmarked page cannot be viewed even via a direct link.
  - **Their own personal notes**: full read/write — create, edit, delete their own notes within a campaign they're invited to. (**Open item, non-blocking**: whether the DM can read a player's personal notes too, or they're fully private. Deferred to Phase 0 Functional Design like the other open items below — not something that needs deciding at the Stories level, and the answer doesn't change which stories exist, only an RLS policy detail.)
  - No visibility into campaigns they aren't invited to; access can be revoked by the DM at any time.

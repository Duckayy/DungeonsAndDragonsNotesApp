# Personas — Session Detail Panel

## Persona: The Player (Campaign Note-Taker)

**Who they are**: A D&D player (not a DM — DM features aren't built yet) using the app solo to record what happens in their campaigns, replacing a scattered pile of Google Docs.

**Goals**:
- Quickly find a past session and remember what happened
- Jot down a recap right after a session, with minimal friction
- Revisit and correct/expand a session's notes weeks later
- Occasionally cross-reference two sessions at once (e.g. "what happened last time vs. two sessions ago")

**Behaviors**:
- Opens the app during or right after a session to write notes
- Comes back later to edit a session's summary as they remember more details
- Browses a campaign's full session list looking for a specific past event
- Wants to compare two sessions without losing their place in either

**Frustrations this feature addresses**:
- The old inline-edit-on-card interaction is cramped for writing anything beyond a couple lines
- No way to view two sessions side by side to cross-reference
- Editing a session loses easy access to its date/tags — everything felt bolted onto a small card

**Technical context**: Desktop browser primary; localStorage-only app, single device, no account/sync. UI state (which panels/tabs are open) doesn't need to survive a page reload.

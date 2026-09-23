# Application Design Plan — Full Stack Pivot

## Scope
High-level component identification for the Phase 0 backend migration (Supabase, auth, RLS,
revisions, personal notes, visibility toggle) — the pieces that will exist across all future units,
not per-unit business logic (that's Functional Design, later, per unit).

## Plan Checklist
- [x] Generate `components.md` — new/changed components and their responsibilities
- [x] Generate `component-methods.md` — method signatures for `storage.js`'s (unchanged) public API plus any new modules
- [x] Generate `services.md` — how components orchestrate (e.g., who calls Supabase directly vs. through `storage.js`)
- [x] Generate `component-dependency.md` — dependency matrix + data flow
- [x] Generate `application-design.md` — consolidated summary of the above

## Clarifying Questions

### Q1: Should `storage.js` stay one file handling everything, or split by domain as scope grows?
Today `storage.js` is one small file with `saveItem`/`loadItem`/`deleteItem`/`listItems`. Phase 0 adds
auth, campaign membership, revisions, personal notes, and visibility — a lot more surface area.
A) Keep `storage.js` as the single public API (same 4 functions), with a new internal `supabaseClient.js` just for SDK setup — everything else stays as-is from the callers' perspective
B) Split into per-domain files now (e.g., `sessionsStore.js`, `campaignsStore.js`, `revisionsStore.js`) that `storage.js` re-exports from
C) Other (describe)

[Answer]:A

### Q2: Where should login/auth state live?
A) New `auth.js` module — exposes `getCurrentUser()`, `login()`, `logout()`, `onAuthChange()`; pages import it directly when they need to check who's logged in
B) Folded into `app.js` (currently the dashboard-only router/shared logic file)
C) Other (describe)

[Answer]:A

### Q3: Should the new UI pieces (DM visibility toggle, revision history viewer, invite management) be their own component files, or built into the existing `sessionPanel.js`?
A) Separate files (e.g., `visibilityToggle.js`, `revisionHistory.js`, `campaignInvites.js`) that `sessionPanel.js` and future `characters.js`/`world.js` all import and reuse
B) Built directly into `sessionPanel.js` since that's the only place they're needed right now, split out later if `characters.js`/`world.js` need the same UI
C) Other (describe)

[Answer]: A

### Q4: Should RLS policies be treated as their own tracked "component" (with a components.md entry, documented per table), or just noted inline wherever a table is described?
A) Own dedicated section/component — RLS is the entire enforcement mechanism for the DM/player permission model, worth documenting explicitly and reviewing on its own
B) Inline notes per table are enough

[Answer]: A

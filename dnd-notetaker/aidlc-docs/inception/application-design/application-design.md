# Application Design — Full Stack Pivot (Phase 0) — Consolidated

See individual docs for full detail: `components.md`, `component-methods.md`, `services.md`, `component-dependency.md`.

## Summary
Three new leaf/mid-layer modules (`supabaseClient.js`, `auth.js`, and `storage.js`'s internals) replace the
localStorage backend without changing `storage.js`'s public API. Three new reusable UI components
(`visibilityToggle.js`, `revisionHistory.js`, `campaignInvites.js`) implement the DM/player permission
UX and are designed to be reused unchanged by the not-yet-built `characters.js`/`world.js` in Phase 3/4.
Row Level Security policies in Supabase — not any JS file — are the actual permission enforcement and
are documented as their own component per Ashton's Q4 answer.

## Design Decisions (from application-design-plan.md answers)
1. `storage.js` stays the single public data API (4 unchanged functions); a new `supabaseClient.js` owns SDK setup internally.
2. Auth state lives in a new `auth.js` module, not folded into `app.js`.
3. New UI pieces (visibility toggle, revision history, invites) are separate reusable component files, not built directly into `sessionPanel.js`.
4. RLS policies are documented as their own dedicated component, not just inline notes — they're the real security boundary for the whole DM/player model in `stories.md`.

## Scope Boundary
This is component identification only — method-level business rules, exact Postgres schema/column
types, and RLS policy SQL are Functional Design work, done per-unit (starting with Phase 0a) when
that unit is picked up for Construction.

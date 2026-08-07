# DD NoteTaker — Project Context

## What this is
A personal D&D campaign note-taking web app (replacing Google Docs), built by Ashton,
a beginner JS developer. Player-facing first, DM features planned later. Also a resume/
portfolio piece for the STEM Advantage General Scholars program (CS/Software Engineering
track) — so clean, complete phases matter as much as functionality.

## Stack
Vanilla HTML / CSS / JS. Storage: localStorage via a `storage.js` abstraction layer
(deliberately chosen so swapping to Supabase/Firebase later is a clean migration, not a
rewrite). Multi-page app pattern — each HTML page is its own screen. Hosting: GitHub Pages
(planned). No frameworks yet.

## File structure
```
dnd-notetaker/
  index.html        <- landing / dashboard
  css/style.css      <- all styles
  js/
    app.js           <- router & shared logic
    storage.js        <- localStorage wrapper (save/load/delete/list)
    sessions.js       <- session notes logic
    characters.js      <- character tracker logic (not started)
    world.js           <- world-building logic (not started)
  pages/
    sessions.html
    sessions-new.html
    characters.html
    world.html
  assets/icons/
```

## Current status
**Phase 1 — Foundation: COMPLETE**
- `storage.js`: `saveItem`, `loadItem`, `deleteItem`, `listItems` — working.
- `app.js`: `updateDashboard` — working.
- `index.html` dashboard, `style.css` dark fantasy tavern palette, skeleton pages for
  sessions/characters/world — all confirmed working in browser.

**Phase 2 — Session Notes: IN PROGRESS**
- `renderSessions()` in `sessions.js` — confirmed working.
- `sessions.html` and `sessions-new.html` — structured.
- New-session form handler — approach established: `event.preventDefault()`, title
  defaults to `"Untitled Session"` if blank, tags parsed via
  `.split(",").map(s => s.trim())`.
- **New feature in progress (not yet built):** Campaigns layer above sessions.
  - Campaign list lives on a **new `campaigns.html`** page (index.html becomes a
    simple home/welcome screen).
  - Current campaign is tracked via **URL query param**:
    `sessions.html?campaign=camp_123` (shareable, refresh-safe — not localStorage).
  - Clicking a campaign shows its sessions with **summary always expanded** (not the
    preview/expand toggle currently in `.session-card`).
  - Nav bar changes depending on whether a campaign is selected.
  - Sessions are **double-click-to-edit** inline on the card; entering edit mode
    reveals a delete button on the card.
  - Home button and clicking a campaign both route to the campaign page.

**Not started:** Phase 3 (Character Tracker), Phase 4 (World-Building /
Leaflet.js maps), Phase 5 (Markdown editing, tag org, polish), backend migration to
Supabase/Firebase.

## Data models (from project roadmap)

Session:
```js
{
  id: "session_1715000000000",
  title: "The Mines of Kharduun",
  date: "2025-03-01",
  inGameDate: "14th of Mirtul",       // optional
  summary: "We explored the abandoned dwarven mine...",
  tags: ["combat", "loot", "Kharduun"],
  createdAt: 1715000000000,
  campaignId: "camp_..."               // NEW — needed for campaigns feature
}
```

Campaign (new, not yet formalized — propose fields, confirm with Ashton before building):
```js
{
  id: "camp_1715000000000",
  name: "The Sunken Citadel Saga",
  createdAt: 1715000000000
}
```

Character (Phase 3, not started):
```js
{
  id: "char_1715000000000",
  name: "Theron Ashvale",
  type: "NPC",              // "PC" or "NPC"
  race: "Half-Elf",
  class: "Ranger",          // nullable for NPCs
  location: "Silverymoon",
  status: "alive",          // alive | dead | missing | unknown
  description: "...",
  notes: "...",
  tags: ["ally", "quest-giver"],
  linkedSessions: ["session_..."],
  createdAt: 1715000000000
}
```

Location (Phase 4, not started):
```js
{
  id: "loc_1715000000000",
  name: "The Sunken Citadel",
  type: "dungeon",          // city | dungeon | region | tavern | wilderness | other
  parentLocation: "loc_...", // nullable, allows nesting
  description: "...",
  notes: "...",
  tags: ["dangerous", "undead"],
  linkedCharacters: ["char_..."],
  linkedSessions: ["session_..."],
  createdAt: 1715000000000
}
```

## Decisions
One line per architecture/design decision, appended as they happen — no timestamps,
no ceremony. Check here before re-deciding something already settled.
- Campaigns feature: current campaign tracked via URL query param
  (`sessions.html?campaign=camp_123`), not localStorage — shareable and refresh-safe.
- Campaign list lives on a new `campaigns.html` page; `index.html` becomes a simple
  home/welcome screen.

## Bugs already hit and resolved (don't reintroduce)
- `window.onload` conflict between `app.js` and `sessions.js` — each page should only
  load the scripts it needs.
- `app.js` on non-dashboard pages caused null reference errors — don't include `app.js`
  on pages other than `index.html`.
- `listItems()` returns **keys**, not objects — must call `loadItem(key)` inside the
  loop to get actual data.
- Duplicate `const` declarations inside loops.

## Gotchas to watch for going forward
Event listener timing, closures/scope, async/await, DOM-not-loaded errors — flag these
proactively when relevant to a change.

## How to work with Ashton on this project
- Give full working code directly (not just hints/API references) — Ashton wants
  finished work for a resume portfolio. Always comment code line-by-line or by section
  so it stays a learning tool.
- Don't make key design/architecture decisions unilaterally. If a real decision point
  comes up (structure, naming, approach), ask first. Otherwise just write the code.
- Default to the simpler approach unless Ashton asks for the more robust one.
- Don't over-plan upfront — point to a working base and let Ashton iterate.
- If clarifying stalls, ask Ashton to paste the actual current code rather than
  reasoning from description alone.
- Explain bugs conceptually (why it broke), not just the fix.
- Always name the specific file and function a change belongs in.
- Keep responses concise — no padding or preamble.
- Don't flag re-asked questions.
- If Ashton labels something a "syntax question," just answer directly, no Socratic
  back-and-forth.
- Principle underlying the whole project: MVP-first (localStorage → backend later) is
  intentional architecture, not a shortcut — finishing phases cleanly beats an ambitious
  incomplete rewrite, especially for scholarship/resume credibility.
- Maintain the **Decisions** section above — append a one-line entry whenever an
  architecture/design decision gets made, so it's never re-litigated in a later session.
- Before writing code that touches 2+ files, state a one-line heads-up on which
  files/functions will be touched, so Ashton can redirect before generation.

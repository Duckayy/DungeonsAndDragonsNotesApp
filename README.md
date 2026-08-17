# D&D Notes

A personal campaign note-taking web app for Dungeons & Dragons players — built to replace a scattered pile of Google Docs with something organized around campaigns, sessions, and characters.

## Features

- **Campaigns** — create and manage multiple campaigns; everything else (sessions, world, characters) is scoped to whichever campaign you're currently viewing
- **Sessions** — log what happened in each session (title, date, summary), with inline create/edit/delete on card-style entries
- **Characters** — track PCs and NPCs as card-style entries within a campaign
- **World** — placeholder page for future location/world-building notes
- **Persistent storage** — everything is saved to the browser's `localStorage`, so your notes are there when you come back

## Tech Stack

Vanilla HTML, CSS, and JavaScript — no frameworks, no build step, no dependencies. Data persistence goes through a small `storage.js` abstraction layer over `localStorage`, deliberately kept thin so a future move to a real backend (e.g. Supabase or Firebase) is a clean swap rather than a rewrite.

## Getting Started

No installation or build step required. Serve the `dnd-notetaker/` folder with any static file server and open it in a browser:

```bash
cd dnd-notetaker
python -m http.server 8000
```

Then visit `http://localhost:8000/index.html`. (Opening `index.html` directly via `file://` also works, since everything runs client-side.)

## Project Structure

```
dnd-notetaker/
  index.html          Landing / welcome screen
  css/style.css        All styles
  js/
    storage.js          localStorage abstraction (save/load/delete/list)
    campaigns.js         Campaign list logic
    sessions.js          Session notes logic (list, create, edit, delete)
    characters.js         Character tracker logic
    nav.js                Shared nav bar / campaign-scoped breadcrumb
  pages/
    campaigns.html
    sessions.html
    characters.html
    world.html
  assets/icons/
```

## Status

Campaigns, Sessions, and Characters are functional. World-building is a placeholder for a future phase (planned to include a map-based interface). See `dnd-notetaker/CLAUDE.md` for the detailed development log, data models, and architectural decisions.

## About

A solo project built as both a practical tool and a software engineering portfolio piece.

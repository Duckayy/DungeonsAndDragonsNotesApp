# Build Instructions

## No Build Step
This is a static HTML/CSS/vanilla-JS site — no bundler, transpiler, or package manager. There is nothing to "build." The files in `dnd-notetaker/` (`index.html`, `css/`, `js/`, `pages/`, `assets/`) are served as-is, including on the planned GitHub Pages hosting.

## Previewing Locally
`localStorage` works fine directly over `file://`, but a local HTTP server is more reliable (matches how it'll actually be hosted, avoids occasional `file://` quirks) and is what this stage's verification used.

### Option A: Python (used for this stage's verification)
```bash
cd dnd-notetaker
python -m http.server 8791
```
Then open `http://localhost:8791/pages/campaigns.html`.

### Option B: Any static file server
Node's `npx serve`, VS Code's Live Server extension, etc. all work identically — there's no server-side logic to configure.

## Verify It's Working
- The dark tavern palette (`--color-bg`, `--color-accent`, etc. from `css/style.css`) should render — if the page looks unstyled, `style.css` isn't loading (check the relative path from wherever you're serving).
- Create a campaign, then a session, and confirm they persist across a page reload (localStorage working).

## A `.claude/launch.json` was added
Points a `static-site` preview config at `python -m http.server 8791` so future sessions can reopen this quickly via the Browser pane's preview tooling.

# Requirements Clarification Questions — Sessions Page: Session Detail Card

Please answer each question by filling in the letter after `[Answer]:`. If none of the options fit, use the last option and describe your preference.

## Question 1
This request describes double-click opening a **side panel** to view/write a session's content. The project's existing decision log says sessions are "double-click-to-edit inline on the card" (editing happens in place, in the list). How should these relate?

A) Replace it — double-click now opens the side panel instead of inline editing; inline edit-on-card goes away

B) Keep both — single-click (or some other trigger) still does inline edit-on-card for quick tweaks (e.g. just the title), while double-click opens the side panel for the full writing experience

C) The side panel *is* the new home for what used to be "edit mode" — same trigger (double-click), just a different UI (panel instead of inline)

D) Other (please describe after [Answer]: tag below)

[Answer]: A

## Question 2
How should the side panel actually appear on screen (like OneNote's page view)?

A) Slide-in drawer from the right, overlaying part of the page; session list stays visible on the left/behind it

B) Split view — session list narrows to a sidebar/column, and the panel permanently occupies the rest of the screen while a session is open (closer to OneNote's actual layout: notebook sections on the left, page content filling the rest)

C) Full-screen-ish modal that covers most of the page, session list hidden while it's open

D) Other (please describe after [Answer]: tag below)

[Answer]: A but you can reconfigure as in make it bigger by extending it

## Question 3
You called the card "reconfigurable" — what does that mean here?

A) Resizable — user can drag an edge/corner to make the panel bigger or smaller

B) Just "large and roomy" compared to the small list card — not literally draggable/resizable by the user, just a bigger fixed layout

C) Resizable AND repositionable (drag to move it, not just resize)

D) Other (please describe after [Answer]: tag below)

[Answer]: A

## Question 4
What should "write in it" mean for this first version?

A) Plain text — a big `<textarea>` for the summary, same as today's data model, just a bigger/nicer input surface

B) Rich text / Markdown editing — pulls forward some of the Phase 5 "Markdown editing" work described in CLAUDE.md's roadmap

C) Other (please describe after [Answer]: tag below)

[Answer]: A

## Question 5
Which fields should be visible/editable inside the expanded panel?

A) Just the summary (the "writing" part) — title/date/tags stay list-card-only for now

B) Everything — title, date, inGameDate, summary, and tags, all editable in the panel

C) Other (please describe after [Answer]: tag below)

[Answer]: B

## Question 6
How should edits made in the panel get saved?

A) Auto-save as you type (e.g. debounced save to localStorage), no explicit save button

B) Explicit "Save" button/action — edits aren't committed until you click it

C) Other (please describe after [Answer]: tag below)

[Answer]: A

## Question 7
How does the panel close, and can more than one be open at once?

A) Only one session panel open at a time; opening another auto-closes the current one; closes via an X button or clicking outside it

B) Only one at a time, closes via X button only (no click-outside-to-close)

C) Other (please describe after [Answer]: tag below)

[Answer]: If you attempt to open another panel it opens it up but as like a new tab that you can swap from either session. You should then also be allowed to drag it out to have it show alongside the other session

## Question 8
The current decision log says entering edit mode reveals a delete button on the card. With the new panel-based approach, where should deleting a session live?

A) Delete button inside the open side panel

B) Delete button stays on the list card itself (visible on hover or double-click state), separate from the panel

C) Both — available in both places

D) Other (please describe after [Answer]: tag below)

[Answer]: B

# Requirements Clarification Questions — Sessions Page: Session Detail Card

I found one ambiguity and one scope check worth confirming before writing the requirements doc.

## Ambiguity 1: Delete button trigger vs. double-click now opening the panel
You answered Q1 with "Replace it" (double-click now opens the side panel; inline edit-on-card goes away entirely), but Q8 said the delete button stays on the list card, "visible on hover or double-click state." Since double-click's job is now "open the panel," it's unclear what a separate "double-click state" on the card would still mean.

### Clarification Question 1
When should the delete button appear on a list card now?

A) On hover only — no separate "double-click state" on the card anymore, since double-click always opens the panel

B) While that session's panel is open — the card is visually marked "active/open" (not a text-edit mode) and shows the delete button then, in addition to hover

C) Other (please describe after [Answer]: tag below)

[Answer]: A

## Scope Check: Multi-panel tabs + drag-to-split (Question 7 answer)
Your answer to Q7 describes a bigger feature than the rest of your answers implied: opening a second session while one is already open creates a **tab within the panel** that you can swap between, and you can **drag a tab out to view two sessions side-by-side**. That's effectively a small window-manager (tab bar, tab switching, drag-out-to-split layout, independently resizable/positioned panes) layered on top of the resizable drawer from Q2/Q3 — a meaningfully bigger build than "one resizable side panel."

This project's CLAUDE.md leans MVP-first: ship a clean, working phase before layering on more complexity. Want to check before scoping Construction around the full tabbed/split system.

### Clarification Question 2
How do you want to handle this for the first version?

A) Build the full thing now — tabs + swap + drag-to-split, as described

B) Ship a simpler v1 first: opening a second session auto-swaps the panel to show it (replacing the first, no tabs) — then add tabs/drag-to-split as a later enhancement once the base panel is solid

C) Middle ground: support switching between multiple open sessions via a simple tab bar (click a tab to swap), but skip drag-to-split-side-by-side for now — that part becomes the later enhancement

D) Other (please describe after [Answer]: tag below)

[Answer]: A

# Functional Design Clarification Questions — Unit: session-detail-panel

## Ambiguity: Split View Cap & Multi-Pane Drop Zones (Question 2 + Question 3)
You chose "allow more than 2 side-by-side panes (3+)" for split view, and an "explicit drop zone" for triggering a split. With only 2 panes possible, the drop zone is simple ("the right half of the panel"). With 3+ panes allowed, that needs to generalize — is there a practical maximum, and where do drop zones appear once multiple panes already exist?

### Clarification Question 1
Is there a practical maximum number of simultaneous side-by-side panes, or should this scale to however many the user drags out?

A) Cap at a small fixed maximum for now (e.g. 3 panes) — enough to compare a few sessions without engineering unlimited responsive tiling

B) Truly unbounded — panes just keep getting narrower as more are added, however many the user opens

C) Other (please describe after [Answer]: tag below)

[Answer]: A

### Clarification Question 2
Once 2+ panes already exist, where do the drop zones for dragging out an additional pane appear?

A) A drop zone appears between/beside each existing pane's boundary (drop between pane 1 and 2 to insert a new pane there, etc.) — most flexible, most engineering effort

B) One persistent drop zone at the far edge (e.g. far right) — new panes always get appended there in the order you drag them out — simpler, fixed insertion order

C) Other (please describe after [Answer]: tag below)

[Answer]: A

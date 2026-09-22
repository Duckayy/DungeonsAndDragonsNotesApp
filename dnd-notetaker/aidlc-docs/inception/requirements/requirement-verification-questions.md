# Clarifying Questions — Full Stack Pivot (Cloud Storage + Version Control)

Your last message expands the roadmap request from "plan the remaining localStorage-based phases" to
"make this full stack" with cloud note storage and version control. This reverses a decision already
logged in `CLAUDE.md` ("MVP-first: localStorage → backend later is intentional architecture, not a
shortcut"). That's fine to change — but per the project's collaboration rule, I won't pick the backend,
auth model, or version-control approach for you. Please answer below.

Fill in each `[Answer]:` tag with a letter (A, B, C...), or "E) Other" with a short description.

---

### Q1: What does "version control" mean for this app?
A) Git/GitHub for the codebase only — already in place, nothing new to build
B) In-app revision history for notes (e.g., view/restore earlier versions of a session's summary or a character's notes)
C) Both A and B
D) Other (describe)

[Answer]:B

---

### Q2: Which cloud backend/database should the tech stack target?
A) Supabase (Postgres + built-in auth + realtime) — this is the option CLAUDE.md already named as the likely migration target
B) Firebase (Firestore + Auth) — also named in CLAUDE.md as an alternative
C) Custom backend (e.g., Node/Express) + a separately hosted database
D) Other (describe)

[Answer]:A

---

### Q3: Should cloud storage fully replace localStorage, or run alongside it?
A) Full replacement — `storage.js` calls the cloud backend directly, no local fallback
B) Hybrid — keep localStorage for offline use, sync to cloud when online
C) Not sure — want a recommendation based on tradeoffs

[Answer]: A

---

### Q4: Does this require user accounts / authentication?
A) Yes — single user (just you), simple login to gate access to your own data
B) Yes — multi-user (you + players/DM could each have their own account/campaign access)
C) No auth — data is cloud-hosted but not access-gated
D) Other (describe)

[Answer]: B

---

### Q5: Where should the backend migration sit relative to the remaining feature phases (Character Tracker, World-Building, Polish)?
A) Do the backend/cloud migration first, then build Phases 3-5 on top of it
B) Finish Phases 3-5 on localStorage first, then migrate everything to the cloud in one pass at the end
C) Treat it as its own track — describe your preferred placement

[Answer]: A

---

## Follow-Up Questions (Round 2)

Your answers to Q4 (multi-user) and Q3 (full replacement, no local fallback) open two new gaps below.

### Q6: With multi-user accounts, what should DM vs. player permissions look like?
A) DM (campaign owner) has full edit rights; invited players get view-only access to sessions/characters/world
B) DM has full edit rights; invited players can also edit (fully collaborative notes)
C) Everyone with an account creates their own campaigns; sharing/access is per-campaign, explicit invite only, with the inviter choosing view or edit per invite
D) Other (describe)

[Answer]: A

---

### Q7: Full replacement means no localStorage fallback — is offline access needed (e.g., at the table without wifi)?
A) No — always-online is fine
B) Yes — need some offline capability (would require a hybrid/service-worker approach layered on later)
C) Not a priority now — revisit if it becomes a real problem in practice

[Answer]: B

---

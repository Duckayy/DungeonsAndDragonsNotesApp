function renderSessions(){
    const container = document.getElementById("session-list");
    const campaignId = getCampaignIdFromUrl();

    if (!campaignId){
        container.innerHTML = `<p>Select a campaign to view its sessions. <a href="campaigns.html">Go to Campaigns</a></p>`;
        setNewSessionControlsEnabled(false);
        return;
    }

    setNewSessionControlsEnabled(true);

    const sessionKeys = listItems("session_")
        .filter(key => loadItem(key).campaignId === campaignId);

    if (!sessionKeys || sessionKeys.length === 0){
        container.innerHTML = "<p>No sessions yet for this campaign - create one!</p>";
        return;
    }

    container.innerHTML = "";
    sessionKeys.forEach(key => {
        const session = loadItem(key);
        container.insertAdjacentHTML("beforeend", buildSessionCardHTML(session, false));
    });

    attachSessionCardListeners(container);
}

// isNew renders the card already in edit mode with no Delete button, for the
// "create by filling in a blank card" flow.
function buildSessionCardHTML(session, isNew){
    const summaryText = session.summary || "No summary written yet.";
    const cardClasses = "session-card" + (isNew ? " editing new-card" : "");

    return `
    <div class="${cardClasses}" data-id="${session.id || ""}">
            <h2 class="field-title">${escapeHtml(session.title)}</h2>
            <p class="field-date">${escapeHtml(session.date || "")}</p>
            <p class="summary-preview">${escapeHtml(summaryText.substring(0, 100))}...</p>
            <p class="summary-full">${escapeHtml(summaryText)}</p>

            <div class="edit-fields">
                <label>Title</label>
                <input type="text" class="edit-title" value="${escapeHtml(session.title)}">
                <label>Date</label>
                <input type="date" class="edit-date" value="${escapeHtml(session.date || "")}">
                <label>Summary</label>
                <textarea class="edit-summary">${escapeHtml(session.summary || "")}</textarea>
                <div class="edit-actions">
                    <button type="button" class="save-btn">Save</button>
                    <button type="button" class="cancel-btn">Cancel</button>
                    <button type="button" class="delete-btn">Delete</button>
                </div>
            </div>
        </div>
    `;
}

// Attaches listeners to already-saved session cards (expand/edit/delete).
// Draft cards (still unsaved) get their own listeners from addNewSessionCard.
function attachSessionCardListeners(container){
    container.querySelectorAll(".session-card").forEach(card => {
        if (card.classList.contains("new-card")) return;

        // Expand/collapse the summary on click
        card.addEventListener("click", () => {
            if (card.classList.contains("editing")) return;
            card.classList.toggle("expanded");
        });

        // Double-clicking the visible text enters edit mode
        card.querySelectorAll(".field-title, .field-date, .summary-preview, .summary-full")
            .forEach(field => {
                field.addEventListener("dblclick", () => {
                    card.classList.add("editing");
                });
            });

        card.querySelector(".save-btn").addEventListener("click", (event) => {
            event.stopPropagation();
            saveEditedSession(card);
        });

        card.querySelector(".cancel-btn").addEventListener("click", (event) => {
            event.stopPropagation();
            card.classList.remove("editing");
        });

        card.querySelector(".delete-btn").addEventListener("click", (event) => {
            event.stopPropagation();
            deleteSession(card);
        });
    });
}

function saveEditedSession(card){
    const sessionId = card.dataset.id;
    const session = loadItem(sessionId);

    session.title = card.querySelector(".edit-title").value.trim() || "Untitled Session";
    session.date = card.querySelector(".edit-date").value;
    session.summary = card.querySelector(".edit-summary").value.trim() || "No summary written yet.";

    saveItem(sessionId, session);
    renderSessions();
}

function deleteSession(card){
    const sessionId = card.dataset.id;
    const session = loadItem(sessionId);

    if (!window.confirm(`Delete "${session.title}"? This can't be undone.`)) return;

    deleteItem(sessionId);
    renderSessions();
}

// Disables session creation when no campaign is selected (nothing to attach the session to).
function setNewSessionControlsEnabled(enabled){
    const createBtn = document.getElementById("new-session-btn");
    if (createBtn) createBtn.hidden = !enabled;
}

// "+ Create New Session" - inserts a blank card already in edit mode.
function addNewSessionCard(){
    const container = document.getElementById("session-list");
    if (!container) return;

    if (!container.querySelector(".session-card")){
        container.innerHTML = "";
    }

    const draftHTML = buildSessionCardHTML({ id: "", title: "", date: "", summary: "" }, true);
    container.insertAdjacentHTML("afterbegin", draftHTML);

    const draftCard = container.querySelector(".session-card.new-card");
    attachDraftSessionCardListeners(draftCard);
    draftCard.querySelector(".edit-title").focus();
}

function attachDraftSessionCardListeners(card){
    card.querySelector(".save-btn").addEventListener("click", () => {
        const campaignId = getCampaignIdFromUrl();
        if (!campaignId) return; // button is hidden without a campaign, but guard anyway

        const session = {
            id: "session_" + Date.now(),
            campaignId: campaignId,
            title: card.querySelector(".edit-title").value.trim() || "Untitled Session",
            date: card.querySelector(".edit-date").value,
            summary: card.querySelector(".edit-summary").value.trim() || "No summary written yet.",
            createdAt: Date.now()
        };

        saveItem(session.id, session);
        renderSessions();
    });

    card.querySelector(".cancel-btn").addEventListener("click", () => {
        card.remove();
        if (!document.querySelector("#session-list .session-card")){
            renderSessions();
        }
    });
}

window.onload = function() {
    if (document.getElementById("session-list")) {
        migrateSessionsToDefaultCampaign();
        renderSessions();
    }

    const createBtn = document.getElementById("new-session-btn");
    if (createBtn) {
        createBtn.addEventListener("click", addNewSessionCard);
    }
};

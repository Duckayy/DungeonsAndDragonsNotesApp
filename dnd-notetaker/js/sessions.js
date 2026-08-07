// Basic HTML-escaping so session text can't break card markup or attributes.
function escapeHtml(str){
    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

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
        const summaryText = session.summary || "No summary written yet.";

        const cardHTML = `
        <div class="session-card" data-id="${session.id}">
                <h2 class="field-title">${escapeHtml(session.title)}</h2>
                <p class="field-date">${escapeHtml(session.date)}</p>
                <p class="summary-preview">${escapeHtml(summaryText.substring(0, 100))}...</p>
                <p class="summary-full">${escapeHtml(summaryText)}</p>

                <div class="edit-fields">
                    <label>Title</label>
                    <input type="text" class="edit-title" value="${escapeHtml(session.title)}">
                    <label>Date</label>
                    <input type="date" class="edit-date" value="${escapeHtml(session.date || "")}">
                    <label>Summary</label>
                    <textarea class="edit-summary">${escapeHtml(summaryText)}</textarea>
                    <div class="edit-actions">
                        <button type="button" class="save-session-btn">Save</button>
                        <button type="button" class="cancel-edit-btn">Cancel</button>
                        <button type="button" class="delete-session-btn">Delete</button>
                    </div>
                </div>
            </div>
        `;

        container.insertAdjacentHTML("beforeend", cardHTML);
    });

    attachSessionCardListeners(container);
}

// Attaches all card-level listeners after cards are added to the DOM.
function attachSessionCardListeners(container){
    const cards = container.querySelectorAll(".session-card");

    cards.forEach(card => {
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

        card.querySelector(".save-session-btn").addEventListener("click", (event) => {
            event.stopPropagation();
            saveEditedSession(card);
        });

        card.querySelector(".cancel-edit-btn").addEventListener("click", (event) => {
            event.stopPropagation();
            card.classList.remove("editing");
        });

        card.querySelector(".delete-session-btn").addEventListener("click", (event) => {
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
    const toggleBtn = document.getElementById("toggle-new-session-btn");
    if (toggleBtn) toggleBtn.hidden = !enabled;

    if (!enabled){
        document.getElementById("new-session-form").hidden = true;
    }
}

// Shows/hides the new-session form when the toggle button is clicked
function toggleNewSessionForm(){
    const form = document.getElementById("new-session-form");
    form.hidden = !form.hidden; // flips true/false each click
}

// Handles the new-session form submit, now inline on sessions.html
function handleNewSessionSubmit(event){
    event.preventDefault(); // stop the browser's default full-page-reload form submission

    const campaignId = getCampaignIdFromUrl();
    if (!campaignId) return; // form is hidden without a campaign, but guard anyway

    const titleInput = document.getElementById("title");
    const dateInput = document.getElementById("date");
    const inGameDateInput = document.getElementById("inGameDate");
    const summaryInput = document.getElementById("summary");
    const tagsInput = document.getElementById("tags");

    const session = {
        id: "session_" + Date.now(),
        campaignId: campaignId,
        title: titleInput.value.trim() || "Untitled Session",
        date: dateInput.value,
        inGameDate: inGameDateInput.value,
        summary: summaryInput.value.trim() || "No summary written yet.",
        tags: tagsInput.value.split(",").map(s => s.trim()).filter(Boolean),
        createdAt: Date.now()
    };

    saveItem(session.id, session);

    event.target.reset(); // clears all form fields back to blank
    document.getElementById("new-session-form").hidden = true; // hide form again after save
    renderSessions(); // re-render the list in place to show the new card — no page redirect needed
}

window.onload = function() {
    if (document.getElementById("session-list")) {
        migrateSessionsToDefaultCampaign();
        renderSessions();
    }

    const toggleBtn = document.getElementById("toggle-new-session-btn");
    if (toggleBtn) {
        toggleBtn.addEventListener("click", toggleNewSessionForm);
    }

    const newSessionForm = document.getElementById("new-session-form");
    if (newSessionForm) {
        newSessionForm.addEventListener("submit", handleNewSessionSubmit);
    }
};

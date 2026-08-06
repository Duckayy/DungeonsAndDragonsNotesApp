function renderSessions(){
    const container = document.getElementById("session-list");
    const sessionKeys = listItems("session_");

    if (!sessionKeys || sessionKeys.length === 0){
        container.innerHTML = "<p>No sessions yet - create one! </p>";
        return;
    }

    container.innerHTML = "";

    sessionKeys.forEach(key => {
        const session = loadItem(key);
        const summaryText = session.summary || "No summary written yet.";

        const cardHTML = `
        <div class="session-card">
                <h2>${session.title}</h2>
                <p>${session.date}</p>
                <p class="summary-preview">${summaryText.substring(0, 100)}...</p>
                <p class="summary-full">${summaryText}</p>
            </div>
        `;

        container.insertAdjacentHTML("beforeend", cardHTML);
    });

    // Attach click listeners to every card AFTER they're added to the DOM.
    // This must run after insertAdjacentHTML, not before — the cards don't
    // exist yet until the loop above finishes.
    const cards = container.querySelectorAll(".session-card");
    cards.forEach(card => {
        card.addEventListener("click", () => {
            card.classList.toggle("expanded");
        });
    });
}

// Shows/hides the new-session form when the toggle button is clicked
function toggleNewSessionForm(){
    const form = document.getElementById("new-session-form");
    form.hidden = !form.hidden; // flips true/false each click
}

// Handles the new-session form submit, now inline on sessions.html
function handleNewSessionSubmit(event){
    event.preventDefault(); // stop the browser's default full-page-reload form submission

    const titleInput = document.getElementById("title");
    const dateInput = document.getElementById("date");
    const inGameDateInput = document.getElementById("inGameDate");
    const summaryInput = document.getElementById("summary");
    const tagsInput = document.getElementById("tags");

    const session = {
        id: "session_" + Date.now(),
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
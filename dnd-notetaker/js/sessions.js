function renderSessions(){
    const container = document.getElementById("session-list");
    const sessionKeys = listItems("session_");

    if (!sessionKeys || sessionKeys.length === 0){
        container.innerHTML = "<p>No sessions yet - create one! </p>";
        return;
    }

    sessionKeys.forEach(key => {
        const session = loadItem(key);

        // Defensive fallback: covers old data saved before summary defaults existed
        const summaryText = session.summary || "No summary written yet.";

        const cardHTML = `
        <div class="session-card">
                <h2>${session.title}</h2>
                <p>${session.date}</p>
                <p>${summaryText.substring(0, 100)}...</p>
            </div>
        `;
        container.insertAdjacentHTML("beforeend", cardHTML);
    });
}
// NEW: handles the new-session form submit on sessions-new.html
function handleNewSessionSubmit(event){
    event.preventDefault(); // stop the browser's default full-page-reload form submission

    // Grab the form field elements by their id (update these ids to match your actual HTML)
    const titleInput = document.getElementById("title");
    const dateInput = document.getElementById("date");
    const inGameDateInput = document.getElementById("inGameDate");
    const summaryInput = document.getElementById("summary");
    const tagsInput = document.getElementById("tags");

    // Build the session object from form data
    const session = {
        id: "session_" + Date.now(), // unique id based on timestamp
        title: titleInput.value.trim() || "Untitled Session", // fallback if left blank
        date: dateInput.value,
        inGameDate: inGameDateInput.value,
        // Fallback: if summary is left blank, store a placeholder instead of ""
        // This guarantees session.summary is NEVER undefined or empty downstream
        summary: summaryInput.value.trim() || "No summary written yet.",
        tags: tagsInput.value.split(",").map(s => s.trim()).filter(Boolean), // filter(Boolean) drops empty strings from trailing commas
        createdAt: Date.now()
    };

    saveItem(session.id, session); // persist to localStorage via storage.js

    window.location.href = "sessions.html"; // redirect back to the session list after saving
}

window.onload = function() {
    if (document.getElementById("session-list")) {
        renderSessions();
    }

    const newSessionForm = document.getElementById("new-session-form");
    if (newSessionForm) {
        newSessionForm.addEventListener("submit", handleNewSessionSubmit);
    }
};
function renderSessions(){
    const container = document.getElementById("session-list");
    const sessions = listItems("sessions_");

    if (!sessions || sessions.length === 0){
        container.innerHTML = "<p>No sessions yet - create one! </p>";
        return;
    }

    sessions.forEach(session => {
        const cardHTML = `
        <div class="session-card">
                <h2>${session.title}</h2>
                <p>${session.date}</p>
                <p>${session.summary.substring(0, 100)}...</p>
            </div>
        `;
    });
}
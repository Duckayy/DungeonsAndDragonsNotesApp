function renderSessions(){
    const container = document.getElementById("session-list");
    const sessionKeys = listItems("session_");

    if (!sessionKeys || sessionKeys.length === 0){
        container.innerHTML = "<p>No sessions yet - create one! </p>";
        return;
    }

    sessionKeys.forEach(key => {
        const session = loadItem(key);
        const cardHTML = `
        <div class="session-card">
                <h2>${session.title}</h2>
                <p>${session.date}</p>
                <p>${session.summary.substring(0, 100)}...</p>
            </div>
        `;

        container.insertAdjacentHTML("beforeend", cardHTML);
    });
}
window.onload = renderSessions;
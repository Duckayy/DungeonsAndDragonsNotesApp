// Renders campaign cards into the given container id.
// Clicking a card navigates to that campaign's sessions.
function renderCampaigns(containerId){
    const container = document.getElementById(containerId);
    if (!container) return;

    const campaignKeys = listItems("campaign_");

    if (!campaignKeys || campaignKeys.length === 0){
        container.innerHTML = "<p>No campaigns yet - create one!</p>";
        return;
    }

    container.innerHTML = "";

    campaignKeys.forEach(key => {
        const campaign = loadItem(key);
        const sessionCount = listItems("session_")
            .filter(sk => loadItem(sk).campaignId === campaign.id).length;

        const cardHTML = `
        <div class="campaign-card" data-id="${campaign.id}">
            <h2>${campaign.name}</h2>
            <p>${campaign.description || ""}</p>
            <p class="campaign-session-count">${sessionCount} session${sessionCount === 1 ? "" : "s"}</p>
        </div>
        `;

        container.insertAdjacentHTML("beforeend", cardHTML);
    });

    container.querySelectorAll(".campaign-card").forEach(card => {
        card.addEventListener("click", () => {
            window.location.href = pagesPrefix() + "sessions.html?campaign=" + card.dataset.id;
        });
    });
}

// Shows/hides the new-campaign form when the toggle button is clicked
function toggleNewCampaignForm(){
    const form = document.getElementById("new-campaign-form");
    form.hidden = !form.hidden;
}

function handleNewCampaignSubmit(event){
    event.preventDefault();

    const nameInput = document.getElementById("campaign-name");
    const descriptionInput = document.getElementById("campaign-description");

    const campaign = {
        id: "campaign_" + Date.now(),
        name: nameInput.value.trim() || "Untitled Campaign",
        description: descriptionInput.value.trim(),
        createdAt: Date.now()
    };

    saveItem(campaign.id, campaign);

    event.target.reset();
    document.getElementById("new-campaign-form").hidden = true;
    renderCampaigns("campaign-list");
}

// Uses addEventListener (not window.onload) so this coexists with other
// scripts' onload handlers on pages that include more than one, like index.html.
window.addEventListener("load", function(){
    migrateSessionsToDefaultCampaign();

    if (document.getElementById("campaign-list")){
        renderCampaigns("campaign-list");
    }

    const toggleBtn = document.getElementById("toggle-new-campaign-btn");
    if (toggleBtn){
        toggleBtn.addEventListener("click", toggleNewCampaignForm);
    }

    const newCampaignForm = document.getElementById("new-campaign-form");
    if (newCampaignForm){
        newCampaignForm.addEventListener("submit", handleNewCampaignSubmit);
    }
});

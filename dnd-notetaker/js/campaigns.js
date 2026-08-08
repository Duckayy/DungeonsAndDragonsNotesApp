// Renders campaign cards into the given container id.
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
        container.insertAdjacentHTML("beforeend", buildCampaignCardHTML(campaign, false));
    });

    attachCampaignCardListeners(container);
}

// isNew renders the card already in edit mode with no Delete button, for the
// "create by filling in a blank card" flow.
function buildCampaignCardHTML(campaign, isNew){
    const sessionCount = isNew ? 0 : listItems("session_")
        .filter(sk => loadItem(sk).campaignId === campaign.id).length;
    const cardClasses = "campaign-card" + (isNew ? " editing new-card" : "");

    return `
    <div class="${cardClasses}" data-id="${campaign.id || ""}">
        <h2 class="field-name">${escapeHtml(campaign.name)}</h2>
        <p class="field-description">${escapeHtml(campaign.description || "")}</p>
        <p class="campaign-session-count">${sessionCount} session${sessionCount === 1 ? "" : "s"}</p>

        <div class="edit-fields">
            <label>Name</label>
            <input type="text" class="edit-name" value="${escapeHtml(campaign.name)}">
            <label>Description</label>
            <textarea class="edit-description">${escapeHtml(campaign.description || "")}</textarea>
            <div class="edit-actions">
                <button type="button" class="save-btn">Save</button>
                <button type="button" class="cancel-btn">Cancel</button>
                <button type="button" class="delete-btn">Delete</button>
            </div>
        </div>
    </div>
    `;
}

// Attaches listeners to already-saved campaign cards (view/edit/delete/navigate).
// Draft cards (still unsaved) get their own listeners from addNewCampaignCard.
function attachCampaignCardListeners(container){
    container.querySelectorAll(".campaign-card").forEach(card => {
        if (card.classList.contains("new-card")) return;

        // Clicking the card navigates to its sessions, unless the click
        // started on the editable text or the edit form itself.
        card.addEventListener("click", (event) => {
            if (card.classList.contains("editing")) return;
            if (event.target.closest(".field-name, .field-description, .edit-fields")) return;
            window.location.href = pagesPrefix() + "sessions.html?campaign=" + card.dataset.id;
        });

        card.querySelectorAll(".field-name, .field-description").forEach(field => {
            field.addEventListener("dblclick", (event) => {
                event.stopPropagation();
                card.classList.add("editing");
            });
        });

        card.querySelector(".save-btn").addEventListener("click", (event) => {
            event.stopPropagation();
            saveEditedCampaign(card);
        });

        card.querySelector(".cancel-btn").addEventListener("click", (event) => {
            event.stopPropagation();
            card.classList.remove("editing");
        });

        card.querySelector(".delete-btn").addEventListener("click", (event) => {
            event.stopPropagation();
            deleteCampaign(card);
        });
    });
}

function saveEditedCampaign(card){
    const campaignId = card.dataset.id;
    const campaign = loadItem(campaignId);

    campaign.name = card.querySelector(".edit-name").value.trim() || "Untitled Campaign";
    campaign.description = card.querySelector(".edit-description").value.trim();

    saveItem(campaignId, campaign);
    renderCampaigns("campaign-list");
}

function deleteCampaign(card){
    const campaignId = card.dataset.id;
    const campaign = loadItem(campaignId);

    if (!window.confirm(`Delete "${campaign.name}"? Its sessions and characters will be kept but orphaned.`)) return;

    deleteItem(campaignId);
    renderCampaigns("campaign-list");
}

// "+ Create New Campaign" - inserts a blank card already in edit mode.
function addNewCampaignCard(){
    const container = document.getElementById("campaign-list");
    if (!container) return;

    if (!container.querySelector(".campaign-card")){
        container.innerHTML = "";
    }

    const draftHTML = buildCampaignCardHTML({ id: "", name: "", description: "" }, true);
    container.insertAdjacentHTML("afterbegin", draftHTML);

    const draftCard = container.querySelector(".campaign-card.new-card");
    attachDraftCampaignCardListeners(draftCard);
    draftCard.querySelector(".edit-name").focus();
}

function attachDraftCampaignCardListeners(card){
    card.querySelector(".save-btn").addEventListener("click", () => {
        const campaign = {
            id: "campaign_" + Date.now(),
            name: card.querySelector(".edit-name").value.trim() || "Untitled Campaign",
            description: card.querySelector(".edit-description").value.trim(),
            createdAt: Date.now()
        };

        saveItem(campaign.id, campaign);
        renderCampaigns("campaign-list");
    });

    card.querySelector(".cancel-btn").addEventListener("click", () => {
        card.remove();
        if (!document.querySelector("#campaign-list .campaign-card")){
            renderCampaigns("campaign-list");
        }
    });
}

// Uses addEventListener (not window.onload) so this coexists with other
// scripts' onload handlers on pages that include more than one.
window.addEventListener("load", function(){
    migrateSessionsToDefaultCampaign();

    if (document.getElementById("campaign-list")){
        renderCampaigns("campaign-list");
    }

    const createBtn = document.getElementById("new-campaign-btn");
    if (createBtn){
        createBtn.addEventListener("click", addNewCampaignCard);
    }
});

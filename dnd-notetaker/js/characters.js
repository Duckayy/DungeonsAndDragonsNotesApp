function renderCharacters(){
    const container = document.getElementById("character-list");
    const campaignId = getCampaignIdFromUrl();

    if (!campaignId){
        container.innerHTML = `<p>Select a campaign to view its characters. <a href="campaigns.html">Go to Campaigns</a></p>`;
        setNewCharacterControlsEnabled(false);
        return;
    }

    setNewCharacterControlsEnabled(true);

    const characterKeys = listItems("char_")
        .filter(key => loadItem(key).campaignId === campaignId);

    if (!characterKeys || characterKeys.length === 0){
        container.innerHTML = "<p>No characters yet for this campaign - create one!</p>";
        return;
    }

    container.innerHTML = "";
    characterKeys.forEach(key => {
        const character = loadItem(key);
        container.insertAdjacentHTML("beforeend", buildCharacterCardHTML(character, false));
    });

    attachCharacterCardListeners(container);
}

// isNew renders the card already in edit mode with no Delete button, for the
// "create by filling in a blank card" flow.
function buildCharacterCardHTML(character, isNew){
    const tags = character.tags || [];
    const tagsHTML = tags.map(tag => `<span class="tag-pill">${escapeHtml(tag)}</span>`).join("");
    const cardClasses = "character-card" + (isNew ? " editing new-card" : "");

    return `
    <div class="${cardClasses}" data-id="${character.id || ""}">
        <h2 class="field-name">${escapeHtml(character.name)}</h2>
        <p class="field-description">${escapeHtml(character.description || "")}</p>
        <div class="tag-list">${tagsHTML}</div>

        <div class="edit-fields">
            <label>Name</label>
            <input type="text" class="edit-name" value="${escapeHtml(character.name)}">
            <label>Description</label>
            <textarea class="edit-description">${escapeHtml(character.description || "")}</textarea>
            <label>Tags (comma-separated)</label>
            <input type="text" class="edit-tags" value="${escapeHtml(tags.join(", "))}">
            <div class="edit-actions">
                <button type="button" class="save-btn">Save</button>
                <button type="button" class="cancel-btn">Cancel</button>
                <button type="button" class="delete-btn">Delete</button>
            </div>
        </div>
    </div>
    `;
}

// Attaches listeners to already-saved character cards (edit/delete).
// Draft cards (still unsaved) get their own listeners from addNewCharacterCard.
function attachCharacterCardListeners(container){
    container.querySelectorAll(".character-card").forEach(card => {
        if (card.classList.contains("new-card")) return;

        card.querySelectorAll(".field-name, .field-description, .tag-list").forEach(field => {
            field.addEventListener("dblclick", () => {
                card.classList.add("editing");
            });
        });

        card.querySelector(".save-btn").addEventListener("click", (event) => {
            event.stopPropagation();
            saveEditedCharacter(card);
        });

        card.querySelector(".cancel-btn").addEventListener("click", (event) => {
            event.stopPropagation();
            card.classList.remove("editing");
        });

        card.querySelector(".delete-btn").addEventListener("click", (event) => {
            event.stopPropagation();
            deleteCharacter(card);
        });
    });
}

function parseTags(str){
    return str.split(",").map(s => s.trim()).filter(Boolean);
}

function saveEditedCharacter(card){
    const characterId = card.dataset.id;
    const character = loadItem(characterId);

    character.name = card.querySelector(".edit-name").value.trim() || "Unnamed Character";
    character.description = card.querySelector(".edit-description").value.trim();
    character.tags = parseTags(card.querySelector(".edit-tags").value);

    saveItem(characterId, character);
    renderCharacters();
}

function deleteCharacter(card){
    const characterId = card.dataset.id;
    const character = loadItem(characterId);

    if (!window.confirm(`Delete "${character.name}"? This can't be undone.`)) return;

    deleteItem(characterId);
    renderCharacters();
}

// Disables character creation when no campaign is selected (nothing to attach the character to).
function setNewCharacterControlsEnabled(enabled){
    const createBtn = document.getElementById("new-character-btn");
    if (createBtn) createBtn.hidden = !enabled;
}

// "+ Create New Character" - inserts a blank card already in edit mode.
function addNewCharacterCard(){
    const container = document.getElementById("character-list");
    if (!container) return;

    if (!container.querySelector(".character-card")){
        container.innerHTML = "";
    }

    const draftHTML = buildCharacterCardHTML({ id: "", name: "", description: "", tags: [] }, true);
    container.insertAdjacentHTML("afterbegin", draftHTML);

    const draftCard = container.querySelector(".character-card.new-card");
    attachDraftCharacterCardListeners(draftCard);
    draftCard.querySelector(".edit-name").focus();
}

function attachDraftCharacterCardListeners(card){
    card.querySelector(".save-btn").addEventListener("click", () => {
        const campaignId = getCampaignIdFromUrl();
        if (!campaignId) return; // button is hidden without a campaign, but guard anyway

        const character = {
            id: "char_" + Date.now(),
            campaignId: campaignId,
            name: card.querySelector(".edit-name").value.trim() || "Unnamed Character",
            description: card.querySelector(".edit-description").value.trim(),
            tags: parseTags(card.querySelector(".edit-tags").value),
            createdAt: Date.now()
        };

        saveItem(character.id, character);
        renderCharacters();
    });

    card.querySelector(".cancel-btn").addEventListener("click", () => {
        card.remove();
        if (!document.querySelector("#character-list .character-card")){
            renderCharacters();
        }
    });
}

window.addEventListener("load", function(){
    if (document.getElementById("character-list")){
        renderCharacters();
    }

    const createBtn = document.getElementById("new-character-btn");
    if (createBtn){
        createBtn.addEventListener("click", addNewCharacterCard);
    }
});

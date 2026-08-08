//Storage for data


function saveItem(key, data){
    //set key
    //assign data to a string
    let asString = JSON.stringify(data)
    //Saves the new string to local storage
    localStorage.setItem(key,asString)
}

function loadItem(key){
    //get string
    let asString = localStorage.getItem(key)
    //turn string into object
    let asObject = JSON.parse(asString)
    //return object
    return asObject
}

function deleteItem(key){
    //find item and delete
    localStorage.removeItem(key)

}

function listItems(prefix){
    //Create variables
    //finds how many items in that list
    //loop to print or get every item within that list
    let myList = []
    for (let i = 0; i < localStorage.length; i++){
        let key = localStorage.key(i)
        if (key.startsWith(prefix)){
            myList.push(key)
        }
    }

    return myList

}

const DEFAULT_CAMPAIGN_ID = "campaign_default";

// Makes sure a "Default Campaign" exists and every session has a campaignId.
// Safe to call on every page load - does nothing once everything is migrated.
function migrateSessionsToDefaultCampaign(){
    const sessionKeys = listItems("session_");
    const needsDefault = sessionKeys.some(key => !loadItem(key).campaignId);

    if (needsDefault && !loadItem(DEFAULT_CAMPAIGN_ID)){
        saveItem(DEFAULT_CAMPAIGN_ID, {
            id: DEFAULT_CAMPAIGN_ID,
            name: "Default Campaign",
            description: "Sessions created before campaigns existed.",
            createdAt: Date.now()
        });
    }

    sessionKeys.forEach(key => {
        const session = loadItem(key);
        if (!session.campaignId){
            session.campaignId = DEFAULT_CAMPAIGN_ID;
            saveItem(key, session);
        }
    });
}

// "pages/" when called from the site root (index.html), "" when already
// inside pages/ - lets shared JS build correct relative links from either.
function pagesPrefix(){
    return window.location.pathname.includes("/pages/") ? "" : "pages/";
}

// Reads ?campaign=<id> from the current page's URL, or null if absent.
function getCampaignIdFromUrl(){
    const params = new URLSearchParams(window.location.search);
    return params.get("campaign");
}

// Basic HTML-escaping so stored text can't break card markup or attributes.
function escapeHtml(str){
    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}
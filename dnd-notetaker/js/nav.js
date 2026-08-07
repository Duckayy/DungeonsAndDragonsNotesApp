// Scopes the Sessions/World/Characters nav links to the current campaign
// (?campaign=<id>) and shows a breadcrumb with the campaign name, linking
// back to the campaign list. Does nothing if no campaign is in the URL.
window.addEventListener("load", function(){
    const campaignId = getCampaignIdFromUrl();
    if (!campaignId) return;

    const scopedPages = ["sessions.html", "world.html", "characters.html"];
    document.querySelectorAll("nav a").forEach(link => {
        const href = link.getAttribute("href");
        if (!href || !scopedPages.some(page => href.endsWith(page))) return;

        const separator = href.includes("?") ? "&" : "?";
        link.setAttribute("href", href + separator + "campaign=" + campaignId);
    });

    const breadcrumb = document.getElementById("nav-breadcrumb");
    const campaign = loadItem(campaignId);
    if (breadcrumb && campaign){
        breadcrumb.innerHTML = ` &raquo; <a href="${pagesPrefix()}campaigns.html">${campaign.name}</a>`;
    }
});

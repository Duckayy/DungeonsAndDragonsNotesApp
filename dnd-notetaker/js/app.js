function updateDashboard(){
    //get counts
    sessionCnt = listItems("session_").length
    charCnt = listItems("char_").length
    //update HTML elements
    document.getElementById("session-count").textContent = sessionCnt
    document.getElementById("char-count").textContent = charCnt
}

// runs when the page has fully loaded
window.onload = function() {
    updateDashboard()
}
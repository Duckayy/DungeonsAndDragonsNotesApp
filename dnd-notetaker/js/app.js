function updateDashboard(){
    //get counts
    let sessionCnt = listItems("session_").length
    let charCnt = listItems("char_").length
    //update HTML elements
    document.getElementById("session-count").textContent = sessionCnt
    document.getElementById("char-count").textContent = charCnt
}

// runs when the page has fully loaded
window.onload = function() {
    updateDashboard()
}
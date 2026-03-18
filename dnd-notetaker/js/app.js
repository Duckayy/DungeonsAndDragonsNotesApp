function updateDashboard(){
    //get counts
    listItems("session_").length
    listItems("char_").length
    //update HTML elements
}

// runs when the page has fully loaded
window.onload = function() {
    updateDashboard()
}
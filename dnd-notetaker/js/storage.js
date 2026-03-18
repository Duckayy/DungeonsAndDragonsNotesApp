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
chrome.contextMenus.onClicked.addListener(insertTimestamp) 
/*
The above broken down:
    chrome: the global object provided by chrome's extension system
    contextMenus: this is a property of 'chrome' that represents the context menu API we will be using to add our 
        extension's capabilities to the right click menu
    onClicked: this is an event that triggers when you click something, in our case: our context menu button
    addListener: this is something that will watch out for the 'onClicked' event and call the function 'genericOnClick' 
*/
function insertTimestamp() {
    //timestamp functionality
    console.log("Timestamp Clicked!!")
}

chrome.runtime.onInstalled.addListener(function() {
    chrome.contextMenus.create({
        title: 'Insert Time Stamp',  //this will show up in the context menu
        contexts: ['editable'],      //this is used to tell when our context menu item should be displayed, I believe editable will restrict it to text boxes and the like
        id: 'timestamp'
    });
})

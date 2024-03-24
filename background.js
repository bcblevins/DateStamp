
//chrome.contextMenus: API provided by chrome to allow adding to context (right click) menu in chrome
chrome.contextMenus.create({

    //'title' will show up in the context menu
    title: 'Insert Date Stamp',

    //'contexts' is used to tell when our context menu item should be displayed, 
    //editable will restrict it to text boxes and the like
    contexts: ['editable'],
    
    //'id' is used to refer to our menu item in our code.
    id: 'dateStamp'
});


//onClicked: this is an event that triggers when you click something, in this case: the context menu
//addListener: this is something that will watch out for the 'onClicked' event and call the function
chrome.contextMenus.onClicked.addListener(function (info, tab) {

    //check if the item that was clicked was the menu item we created
    if (info.menuItemId === "dateStamp") {

        //TODO: figure this one out
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            function: insertTextFunction
        });
    }
});


function insertTextFunction() {
    let now = new Date()
    var activeElement = document.activeElement;
    if (activeElement.tagName.toLowerCase() === "input" || activeElement.tagName.toLowerCase() === "textarea") {
        activeElement.value += now.toLocaleString();
    }
}

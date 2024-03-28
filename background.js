//[1]
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

//[1]
//onClicked: this is an event that triggers when you click something, in this case: the context menu
//addListener: this is something that will watch out for the 'onClicked' event and call the function
chrome.contextMenus.onClicked.addListener(function (info, tab) {

    //check if the item that was clicked was the menu item we created
    if (info.menuItemId === "dateStamp") {
        
        //[2]
        //chrome.scripting: an API that allows scripts to be injected into websites.
        //executeScript: does the above, specificaly from a function rather than a file.
        chrome.scripting.executeScript({

            //selects where the script should be injected to and what functino to call
            target: { tabId: tab.id },
            function: insertTimeStamp
        });
    }
});

//Adds Keyboard shortcut capability
chrome.commands.onCommand.addListener(function (info, tab) {
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            function: insertTimeStamp
        });
    
});

//function that is called above
function insertTimeStamp() {

    //[3],[4]
    //document.activeElement: returns the element in the DOM that currently has focus by the user. 
    //DOM: data representation of the structure of a webpage that acts as an interface for programs to interact with the webpage
    var activeElement = document.activeElement;

    //[5]
    //determines if the activeElement is something that we can inject text into.
    if (activeElement.tagName.toLowerCase() === "input" || activeElement.tagName.toLowerCase() === "textarea") {

        //adds date to the end of the selected editable element
        //TODO: make the text insert at the cursor instead of at the end of the editable element
        let now = new Date()
        activeElement.value += now.toLocaleString();
    }
}



//SOURCES FOR NOTES:

//[1] Context Menus:
//https://developer.chrome.com/docs/extensions/reference/api/contextMenus

//[2] Scripting:
//https://developer.chrome.com/docs/extensions/reference/api/scripting

//[3] DOM:
//https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model/Introduction

//[4] document.activeElement:
//https://developer.mozilla.org/en-US/docs/Web/API/Document/activeElement

//[5] activeElement.tagName:
//https://developer.mozilla.org/en-US/docs/Web/API/Element/tagName

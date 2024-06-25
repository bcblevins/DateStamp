//[1]
chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
    
        //'title' will show up in the context menu
        title: 'Insert Date Stamp',
    
        //'contexts' is used to tell when our context menu item should be displayed, 
        //editable will restrict it to text boxes and the like
        contexts: ['editable'],
        
        //'id' is used to refer to our menu item in our code.
        id: 'dateStamp'
    });

    chrome.contextMenus.create({

        //'title' will show up in the context menu
        title: 'Insert Pending Stamp',

        //'contexts' is used to tell when our context menu item should be displayed, 
        //editable will restrict it to text boxes and the like
        contexts: ['editable'],

        //'id' is used to refer to our menu item in our code.
        id: 'pendingStamp'
    });

    chrome.contextMenus.create({

        //'title' will show up in the context menu
        title: 'Format',

        //'contexts' is used to tell when our context menu item should be displayed, 
        //editable will restrict it to text boxes and the like
        contexts: ['editable'],

        //'id' is used to refer to our menu item in our code.
        id: 'format'
    });

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
    if (info.menuItemId === "pendingStamp") {

        chrome.scripting.executeScript({

            target: { tabId: tab.id },
            function: insertPendingStamp
        });
    }
    if (info.menuItemId === "format") {

        chrome.scripting.executeScript({

            target: { tabId: tab.id },
            function: formatText
        });
    }
});

//Adds Keyboard shortcut capability
chrome.commands.onCommand.addListener(function (command, tab) {
    if (command === "run-insertTimeStamp") {
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            function: insertTimeStamp
        });
    }
    if (command === "run-insertPendingStamp") {
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            function: insertPendingStamp
        });
    }
});

//function that is called above
function insertTimeStamp() {
    console.log("hello");
    let now = new Date();
    let stamp = now.toLocaleString();
    //
    document.execCommand('insertText', false, stamp);
}

function insertPendingStamp() {
    var activeElement = document.activeElement;
    if (activeElement.tagName.toLowerCase() === "input" || activeElement.tagName.toLowerCase() === "textarea") {
        let now = new Date();
        let shortDate = (now.getMonth() + 1) + "/" + now.getDate();
        let pendingStamp = "PENDING " + shortDate;
	
	if (activeElement.value.substring(0,15).includes("PENDING")) {
	    let dateIndex = activeElement.value.indexOf("\n");
	    activeElement.value = pendingStamp + activeElement.value.substring(dateIndex);
	} else {
            activeElement.value = pendingStamp + "\n\n" + activeElement.value;
	}
    }
}

function formatText() {
    var activeElement = document.activeElement;
    const re = /\d{1,2}\/\d{1,2}\/\d{4}, \d{1,2}:\d{2}:\d{2} [a-zA-Z]{2}/;
    let matchIndexes = [];
    if (activeElement.tagName.toLowerCase() === "input" || activeElement.tagName.toLowerCase() === "textarea") {
        while ((match = re.exec(str)) != null) {
            matchIndexes.push(match.index)
        }

        for (let matchIndex of matchIndexes) {
            activeElement.value = activeElement.value.substring(0, matchIndex) + "\n--\n" + activeElement.value.substring(matchIndex)
        }
    }
}

//SOURCES FOR NOTES:

//[1] Context Menus:
//https://developer.chrome.com/docs/extensions/reference/api/contextMenus

//[2] Scripting:
//https://developer.chrome.com/docs/extensions/reference/api/scripting



////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Toggle context menu options

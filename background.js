//[1]
chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        //'title' will show up in the context menu
        title: "Insert Date Stamp",

        //'contexts' is used to tell when our context menu item should be displayed,
        //editable will restrict it to text boxes and the like
        contexts: ["editable"],

        //'id' is used to refer to our menu item in our code.
        id: "dateStamp",
    });

    chrome.contextMenus.create({
        title: "Insert Pending Stamp",

        contexts: ["editable"],

        id: "pendingStamp",
    });

    chrome.contextMenus.create({
        title: 'Insert "In Progress" Stamp',

        //'browser_action is a very rare context, so here we are essentially adding the command and turning it off, so that we can control which site it is available on
        contexts: ["browser_action"],

        id: "prependInitials",
    });

    chrome.storage.sync.set({ highlighted: false });
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
            function: insertTimeStamp,
        });
    }
    if (info.menuItemId === "pendingStamp") {
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            function: insertPendingStamp,
        });
    }
    if (info.menuItemId === "prependInitials") {
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            function: prependInitials,
        });
    }
});

//Adds Keyboard shortcut capability
chrome.commands.onCommand.addListener(function (command, tab) {
    if (command === "run-insertTimeStamp") {
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            function: insertTimeStamp,
        });
    }
    if (command === "run-insertPendingStamp") {
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            function: insertPendingStamp,
        });
    }
    if (command === "run-insertInProgress") {
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            function: prependInitials,
        });
    }
});

//function that is called above
function insertTimeStamp() {
    let now = new Date();
    let stamp = now.toLocaleString();
    //
    document.execCommand("insertText", false, stamp);
}

function insertPendingStamp() {
    var activeElement = document.activeElement;
    if (
        activeElement.tagName.toLowerCase() === "input" ||
        activeElement.tagName.toLowerCase() === "textarea"
    ) {
        let now = new Date();
        let shortDate = now.getMonth() + 1 + "/" + now.getDate();
        let pendingStamp = "PENDING " + shortDate;

        if (activeElement.value.substring(0, 15).includes("PENDING")) {
            let dateIndex = activeElement.value.indexOf("\n");
            activeElement.value =
                pendingStamp + activeElement.value.substring(dateIndex);
        } else {
            activeElement.value = pendingStamp + "\n\n" + activeElement.value;
        }
    }
}

function prependInitials() {
    let activeElement = document.activeElement;
    if (
        activeElement.tagName.toLowerCase() === "input" ||
        activeElement.tagName.toLowerCase() === "textarea"
    ) {
        if (activeElement.value.substring(3, 17).includes("in progress\n\n")) {
            activeElement.value = activeElement.value.substring(16);
        } else {
            let initialsElement = document.querySelector(
                "#header > div.sc-gtsrHT.sc-jQAxuV.sc-fuISkM.dqwRck.hsWAsh.cHQuCr > div.sc-fcmMJX.cWiLXV > div > div:nth-child(6) > div > label"
            );

            let initials = (initialsElement.innerText === "JJ") ? "Q" : initialsElement.innerText;

            activeElement.value =
                initials + " in progress" + "\n\n" + activeElement.value;
        }
    }
}

function formatText() {
    var activeElement = document.activeElement;
    const re = /\d{1,2}\/\d{1,2}\/\d{4}, \d{1,2}:\d{2}:\d{2} [a-zA-Z]{2}/;
    let matchIndexes = [];
    if (
        activeElement.tagName.toLowerCase() === "input" ||
        activeElement.tagName.toLowerCase() === "textarea"
    ) {
        while ((match = re.exec(str)) != null) {
            matchIndexes.push(match.index);
        }

        for (let matchIndex of matchIndexes) {
            activeElement.value =
                activeElement.value.substring(0, matchIndex) +
                "\n--\n" +
                activeElement.value.substring(matchIndex);
        }
    }
}

// Messages
chrome.runtime.onMessage.addListener((request) => {
    if (request === "openShortcuts") {
        chrome.tabs.create({ url: "chrome://extensions/shortcuts" });
    }
    if (request === "enableInProgressStamp") {
        chrome.contextMenus.update('prependInitials', {
            contexts: ['editable']
        });
    }
});

//SOURCES FOR NOTES:

//[1] Context Menus:
//https://developer.chrome.com/docs/extensions/reference/api/contextMenus

//[2] Scripting:
//https://developer.chrome.com/docs/extensions/reference/api/scripting

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Toggle context menu options

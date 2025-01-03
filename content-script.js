let menuHidden = false;
let interval = null;
let pendingPreviousColor = "rgba(151, 255, 255, 0.705)";
let pendingTodayColor = "rgba(151, 255, 255, 0.22)";
let updatedColor = "#fffca8"

function toggleMenu() {
  menu.classList.toggle("hidden");
  bubble.classList.toggle("flat-top");
}

function toggleActive(element) {
  element.classList.toggle("active");
}

function highlightPending() {



  // If dashboard not active, skip highlighting
  let tabs = document.querySelectorAll(".recordTab")
  for (let tab of tabs) {
    if (tab.childNodes[tab.childNodes.length - 1].innerText === "Dashboard") {
      // dashboard background color will be this specific color if active
      if (tab.style.backgroundColor === "rgb(251, 201, 19)") {
        break;
      } else {
        return;
      }
    }
  }

  // If communication sub-tab not active, skip highlighting
  let subTabs = document.querySelectorAll(".subTabLabel")
  for (let subTab of subTabs) {
    if (subTab.innerText === "Communication") {
      if (!Array.from(subTab.parentNode.parentNode.classList).includes("active")) {
        return;
      }
    }
  }

  let comms = document.querySelectorAll(".showMoreContent");

  let now = new Date();
  let today = now.getMonth() + 1 + "/" + now.getDate();

  for (let com of comms) {
    let cell = com.parentNode.parentNode.parentNode.parentNode.parentNode;
    let headerCell = cell.previousElementSibling;

    if (com.innerText.includes("PENDING " + today)) {
      cell.style.backgroundColor = pendingTodayColor;
      headerCell.style.backgroundColor = pendingTodayColor;
    } else if (com.innerText.includes("PENDING")) {
      cell.style.backgroundColor = pendingPreviousColor;
      headerCell.style.backgroundColor = pendingPreviousColor;
    } else if (com.innerText.includes("UPDATED")) {
      cell.style.backgroundColor = updatedColor;
      headerCell.style.backgroundColor = updatedColor;
    }
  }
}

// Create bubble
const bubble = document.createElement("div");
bubble.classList.add("bubble");
bubble.innerText = "D";

// Create Menu
const menu = document.createElement("div");
menu.classList.add("datestamp-menu");
menu.classList.add("hidden");

const heading = document.createElement("h1");
heading.innerText = "Date Stamp";
heading.classList.add("datestamp-heading");

const pendingButton = document.createElement("button");
pendingButton.innerText = "Highlight Comms";
pendingButton.id = "pending-button";
pendingButton.addEventListener("click", toggleConstantHighlight);

const shortcutsButton = document.createElement("button");
shortcutsButton.innerText = "Set Shortcuts";
shortcutsButton.id = "shortcuts-button";

menu.appendChild(heading);
menu.appendChild(shortcutsButton);
menu.appendChild(pendingButton);

// events
bubble.addEventListener("click", () => toggleMenu());

shortcutsButton.addEventListener("click", () => {
  chrome.runtime.sendMessage("openShortcuts");
});

// pendingButton.addEventListener("click", () => toggleActive(pendingButton))

// Add elements to page
document.body.appendChild(bubble);
document.body.appendChild(menu);

// EXPERIMENT
async function toggleConstantHighlight() {
  chrome.storage.sync.get("highlighted", (data) => {
    constantHighlight(!data.highlighted);
    chrome.storage.sync.set({ highlighted: !data.highlighted });
  });
}

async function constantHighlight(highlighted) {
  if (highlighted) {
    interval = setInterval(highlightPending, 1000)
    pendingButton.style.backgroundColor = "rgba(151, 255, 255, 0.705)";
    bubble.style.boxShadow = "0px 2px 5px 2px rgba(151, 255, 255, 0.705)";
  } else {
    clearInterval(interval)
    pendingButton.style.backgroundColor = "white";
    bubble.style.boxShadow = "0px 2px 5px #04243a9c";
  }
}

chrome.storage.sync.get("highlighted", (data) => {
  constantHighlight(data.highlighted);
});

chrome.runtime.sendMessage("enableInProgressStamp")

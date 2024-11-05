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

  // If comms tab not active, skip highlighting
  let tabs = document.querySelectorAll(".subTabLabel")
  for (let tab of tabs) {
      if (tab.innerText === "Communication") {
	  if (!Array.from(tab.parentNode.parentNode.classList).includes("active")) {
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
bubble.id = "bubble";
bubble.innerText = "D";

// Create Menu
const menu = document.createElement("div");
menu.id = "datestamp-menu";
menu.classList.add("hidden");

const heading = document.createElement("h1");
heading.innerHTML = "Date Stamp";
heading.id = "datestamp-heading";

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
    if(highlighted) {
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

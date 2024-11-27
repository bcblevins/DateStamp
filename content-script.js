// 1. Global Variables
// 2. Utility Functions
// 3. Create UI
// 4. Events
// 5. Storage
// 6. Messaging


//////////////////////////////////////////////////////////////////////////////////////////
// 1. Global Variables
//////////////////////////////////////////////////////////////////////////////////////////

// Main

let menuHidden = false;
let interval = null;
let pendingPreviousColor = "rgba(151, 255, 255, 0.705)";
let pendingTodayColor = "rgba(151, 255, 255, 0.22)";
let updatedColor = "#fffca8"

// Macros

let macroMenuVisible = false;
let actionsList = [
  { name: 'Insert text', code: 'txt' },
  { name: 'Insert timestamp', code: 'ts' },
  { name: 'Insert/update pending stamp', code: 'ps' },
  { name: 'Toggle "in progress" stamp', code: 'ips' },
  { name: 'Remove pending stamp', code: 'rps' },
  { name: 'Remove "updated" stamp', code: 'rus' }
]

let activeTemplateList = [];


//////////////////////////////////////////////////////////////////////////////////////////
// 2. Utility Functions
//////////////////////////////////////////////////////////////////////////////////////////

// Dom creation //////////////////////////////////////////////////////////////////////////

// Main
function createBubble() {
  const bubble = document.createElement("div");
  bubble.classList.add("bubble");
  bubble.innerText = "D";
  return bubble
}

function createMainMenu() {
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

  const macroMenuButton = document.createElement("button");
  macroMenuButton.innerText = "Set Macros";
  macroMenuButton.id = "open-macros";
  macroMenuButton.addEventListener("click", toggleMacroMenu);

  menu.append(heading, shortcutsButton, pendingButton, macroMenuButton);

  return menu;
}

// Macros

function createMacroMenu() {
  let macroMenu = document.createElement("div")
  macroMenu.classList.add("datestamp-menu", "macro-menu")
  macroMenu.style.display = "none"; //hide menu by default

  let macroHeading = createHeading("h1", "Macros", "datestamp-heading")
  let instructions = createMacroInstructions("Quis aliqua veniam eu sit nostrud mollit tempor officia cillum. Ut nisi et et velit veniam sunt cillum minim dolor velit sint. Laborum nulla occaecat laborum incididunt consequat nulla ut Lorem aliquip.");
  let templateHeading = createHeading("h2", "Template", null)
  let templateSection = createTemplateSection();
  let saveButton = createSaveButton();
  let actionsHeading = createHeading("h2", "Actions", null)
  let actions = createActions(actionsList);

  macroMenu.append(
    macroHeading,
    instructions,
    templateHeading,
    templateSection,
    saveButton,
    actionsHeading,
    actions
  )

  return macroMenu;
}

function createMacroInstructions(text) {
  let instructions = document.createElement("p")
  instructions.innerText = text
  return instructions;
}

function createHeading(headingType, text, className) {
  let heading = document.createElement(headingType);
  heading.innerText = text;
  if (className != null) {
    heading.classList.add(className)
  }

  return heading;
}

function createTemplateSection() {
  let template = document.createElement("div");
  return template;
}

function createSaveButton() {
  let saveButton = document.createElement("button")
  saveButton.innerText = "Save";
  saveButton.addEventListener("click", saveTemplate)
  return saveButton;
}

function createActions(actionsList) {
  let actions = document.createElement("ul")
  actions.id = "actions";

  for (let action of actionsList) {
    console.log(action)
    let actionLi = document.createElement("li")
    actionLi.innerText = action.name;

    let code = document.createElement("span");
    code.innerText = action.code;

    actionLi.appendChild(code);
    actionLi.addEventListener("click", () => {
      createTemplatePiece(action.code)
    })

    actions.appendChild(actionLi)
  }

  return actions;
}

// Dom Manipulation ////////////////////////////////////////////////////////////////////////

// Menus

function toggleMenu() {
  menu.classList.toggle("hidden");
  bubble.classList.toggle("flat-top");
}

function toggleActive(element) {
  element.classList.toggle("active");
}

function toggleMacroMenu() {
  if (macroMenuVisible) {
    macroMenuVisible = false;
    macroMenuButton.style.backgroundColor = "white";
    macroMenu.style.display = "none"
  } else {
    macroMenuVisible = true;
    macroMenuButton.style.backgroundColor = "rgba(151, 255, 255, 0.705)";
    macroMenu.style.display = "block";
  }
}

// Highlighting Comms

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

// Macros

function createTemplatePiece(code) {
  if (activeTemplateList.includes(code)) {
    return;
  }
  activeTemplateList.push(code);
  let piece
  if (code === "txt") {
    piece = document.createElement("input")
    piece.type = "text"
  } else {
    piece = document.createElement("span")
    piece.innerText = code
  }
  template.appendChild(piece);
}

function saveTemplate() {
  let macroString = "";
  for (let macro of activeTemplateList) {
    macroString += macro;
  }
  chrome.runtime.sendMessage({
    action: "saveMacro",
    macroString: macroString
  })
  // Remove all template pieces
  while (template.firstChild) {
    template.removeChild(template.firstChild)
  }
  activeTemplateList = [];
}

//////////////////////////////////////////////////////////////////////////////////////////
// 3. Create UI
//////////////////////////////////////////////////////////////////////////////////////////

// Create bubble
const bubble = createBubble();

// Create Menu
const menu = createMainMenu();

// Create Macro Menu
const macroMenu = createMacroMenu();
menu.appendChild(macroMenu)

// Add all to dom
document.body.append(
  bubble,
  menu
)

//////////////////////////////////////////////////////////////////////////////////////////
// 4. Events
//////////////////////////////////////////////////////////////////////////////////////////

bubble.addEventListener("click", () => toggleMenu());

shortcutsButton.addEventListener("click", () => {
  chrome.runtime.sendMessage("openShortcuts");
});

window.addEventListener("unload", () => {
  clearInterval(interval);
});


//////////////////////////////////////////////////////////////////////////////////////////
// 5. Storage
//////////////////////////////////////////////////////////////////////////////////////////


chrome.storage.sync.get("highlighted", (data) => {
  constantHighlight(data.highlighted);
});

//////////////////////////////////////////////////////////////////////////////////////////
// 6. Messaging
//////////////////////////////////////////////////////////////////////////////////////////


chrome.runtime.sendMessage("enableInProgressStamp")


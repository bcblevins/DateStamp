let menuHidden = false;

function toggleElement(element) {
    element.classList.toggle("hidden")
}

function toggleActive(element) {
    element.classList.toggle("active")

}

// Create bubble
const bubble = document.createElement("div");
bubble.id = "bubble"
bubble.innerText = "D";



// Create Menu
const menu = document.createElement("div");
menu.id = "datestamp-menu";
menu.classList.add("hidden");

const heading = document.createElement("h1");
heading.innerHTML = "Date Stamp"
heading.id = "datestamp-heading"

const pendingButton = document.createElement("button")
pendingButton.innerText = "Highlight Pending"
pendingButton.id = "pending-button"

const shortcutsButton = document.createElement("button")
shortcutsButton.innerText = "Set Shortcuts"
shortcutsButton.id = "shortcuts-button"

menu.appendChild(heading);
menu.appendChild(shortcutsButton);
menu.appendChild(pendingButton);

// events
bubble.addEventListener("click", () => toggleElement(menu))

shortcutsButton.addEventListener("click", () => {
    chrome.runtime.sendMessage("openShortcuts")
})

pendingButton.addEventListener("click", () => toggleActive(pendingButton))


// Add elements to page
document.body.appendChild(bubble);
document.body.appendChild(menu)



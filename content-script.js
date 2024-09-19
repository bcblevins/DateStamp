let menuHidden = false;

function toggleMenu() {
    menu.classList.toggle("hidden")
    bubble.classList.toggle("flat-top")
}

function toggleActive(element) {
    element.classList.toggle("active")
}

function toggleHighlightPending() {
    let comms = document.querySelectorAll(".showMoreContent")

    let now = new Date();
    let today = (now.getMonth() + 1) + "/" + now.getDate();
    let yesterday = (now.getMonth() + 1) + "/" + (now.getDate() - 1);

    let blue3 = "rgba(90, 245, 245, 0.61)"
    let blue2 = "rgba(110, 255, 255, 0.473)"
    let blue1 = "rgba(110, 255, 255, 0.233)"
    

    for (let com of comms) {

        let cell = com.parentNode.parentNode.parentNode

        if (com.innerText.includes("PENDING " + today)) {
            cell = blue1
        } else if (com.innerText.includes("PENDING " + yesterday)) {
            cell = blue2
        } else if (com.innerText.includes("PENDING")) {
            cell = blue3
        }
        // com.style.backgroundColor = "#0844b4"
        // console.log(com)
    }
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
pendingButton.addEventListener("click", toggleHighlightPending)

const shortcutsButton = document.createElement("button")
shortcutsButton.innerText = "Set Shortcuts"
shortcutsButton.id = "shortcuts-button"

menu.appendChild(heading);
menu.appendChild(shortcutsButton);
menu.appendChild(pendingButton);

// events
bubble.addEventListener("click", () => toggleMenu())

shortcutsButton.addEventListener("click", () => {
    chrome.runtime.sendMessage("openShortcuts")
})

// pendingButton.addEventListener("click", () => toggleActive(pendingButton))


// Add elements to page
document.body.appendChild(bubble);
document.body.appendChild(menu)



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

    let blue2 = "rgba(151, 255, 255, 0.705)"
    let blue1 = "rgba(151, 255, 255, 0.22)"
    

    for (let com of comms) {

        let cell = com.parentNode.parentNode.parentNode.parentNode.parentNode
        let headerCell = cell.previousElementSibling;

        if (com.innerText.includes("PENDING " + today)) {
            cell.style.backgroundColor = blue1
            headerCell.style.backgroundColor = blue1
        } else if (com.innerText.includes("PENDING")) {
            cell.style.backgroundColor = blue2
            headerCell.style.backgroundColor = blue2
        } else {
            // cell.style.borderBottom = "1px solid black"
            // headerCell.style.borderTop = "1px solid black"
            cell.style.borderInline = "1px solid black"
            headerCell.style.borderInline = "1px solid black"
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



let menuHidden = false;

function toggleElement(element) {
    element.classList.toggle("hidden")
}

// Create bubble
const bubble = document.createElement("div");
bubble.id = "bubble"
bubble.innerText = "D";


// Create Menu
const menu = document.createElement("div");
menu.id = "menu";

const heading = document.createElement("h1");
heading.innerHTML = "Date Stamp"

const toggleContainer = document.createElement("div")

const checkbox = document.createElement("input")
checkbox.type = "checkbox"
checkbox.name = "highlight"
checkbox.id = "highlight-toggle"

const label = document.createElement("label");
label.setAttribute("for", "highlight")
label.classList.add("toggle-label")
label.innerText = "Highlight Pending"

const button = document.createElement("button")
button.innerText = "Set Shortcuts"

toggleContainer.appendChild(checkbox)
toggleContainer.appendChild(label)

menu.appendChild(heading);
menu.appendChild(toggleContainer);
menu.appendChild(button);

// scripting
bubble.addEventListener("click", toggleElement(menu))


// Add elements to page
document.body.appendChild(bubble);
document.body.appendChild(menu)



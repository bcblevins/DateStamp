// Create a new div element for the floating button
const fab = document.createElement("div");
fab.id = "floating-action-button";
fab.innerText = "D";

// Append the floating button to the body
document.body.appendChild(fab);

const menu = document.createElement("div");
menu.id = "floating-action-menu";

let text = "";
const dateRegex = /(\d{1,2}[\/-]\d{1,2}[\/-]\d{2,4})/g;

// Add a click event listener to the button
fab.addEventListener("click", async () => {
    try {
      // Read the text from the clipboard
      text = await navigator.clipboard.readText();
      console.log(text);
    } catch (err) {
      console.error('Failed to read clipboard contents: ', err);
    }

    let sections = text.split(dateRegex)
    console.log(sections);
    // Remove any existing menu items
    while (menu.firstChild) {
        menu.removeChild(menu.firstChild);
    }

    // Create an element for each section
    for (let i = 0; i < sections.length; i++) {
        const section = sections[i].trim();
        if (section !== "") {
            const menuItem = document.createElement("div");
            menuItem.style = "border: 2px solid black; padding: 5px; margin: 5px; cursor: pointer;";
            menuItem.innerText = section;
            menu.appendChild(menuItem);
        }
    }

    // Append the menu to the body
    document.body.appendChild(menu);

  });

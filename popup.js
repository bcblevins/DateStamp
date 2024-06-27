let timestamp = document.getElementById("timestamp");
let pending = document.getElementById("pending");

timestamp.addEventListener('change', function() {
    chrome.contextMenus.update('dateStamp', {
        contexts: this.checked ? ['editable'] : ['browser_action']           // using 'browser_action' for off since this context is rare
    });
    if (this.checked) {
        console.log('Date Stamp is checked');
    } else {
        console.log('Date Stamp is unchecked');
    }
});

pending.addEventListener('change', function() {
    chrome.contextMenus.update('pendingStamp', {
        contexts: this.checked ? ['editable'] : ['browser_action']
    });
    if (this.checked) {
        console.log('Pending is checked');
        chrome.runtime.sendMessage({ msg: "enablePending" })
    } else {
        console.log('Pending is unchecked');
        chrome.runtime.sendMessage({ msg: "disablePending" })
    }
});


const saveOptions = () => {
    const timestamp = document.getElementById('timestamp').checked;
    const pending = document.getElementById('pending').checked;
  
    chrome.storage.sync.set(
      { timestampEnabled: timestamp, pendingEnabled: pending}
    );
  };

  const restoreOptions = () => {
    chrome.storage.sync.get(
        { timestampEnabled: true, pendingEnabled: true},
        (items) => {
            document.getElementById('timestamp').checked = items.timestampEnabled;
            document.getElementById('pending').checked = items.pendingEnabled;
        }
    )
  }

  document.addEventListener('DOMContentLoaded', restoreOptions);
  document.getElementById('timestamp').addEventListener('click', saveOptions);
  document.getElementById('pending').addEventListener('click', saveOptions);

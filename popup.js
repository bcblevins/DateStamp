let timestamp = document.getElementById("timestamp");
let pending = document.getElementById("pending");
let format = document.getElementById("format");

timestamp.addEventListener('change', function() {
    chrome.contextMenus.update('dateStamp', {
        visible: this.checked
    });
    if (this.checked) {
        console.log('Date Stamp is checked');
    } else {
        console.log('Date Stamp is unchecked');
    }
});

pending.addEventListener('change', function() {
    chrome.contextMenus.update('pendingStamp', {
        visible: this.checked
    });
    if (this.checked) {
        console.log('Pending is checked');
        chrome.runtime.sendMessage({ msg: "enablePending" })
    } else {
        console.log('Pending is unchecked');
        chrome.runtime.sendMessage({ msg: "disablePending" })
    }
});

format.addEventListener('change', function() {
    chrome.contextMenus.update('format', {
        visible: this.checked
    });
    if (this.checked) {
        console.log('Format is checked');
        chrome.runtime.sendMessage({ msg: "enableFormat" })
    } else {
        console.log('Format is unchecked');
        chrome.runtime.sendMessage({ msg: "disableFormat" })
    }
});

const saveOptions = () => {
    const timestamp = document.getElementById('timestamp').checked;
    const pending = document.getElementById('pending').checked;
    const format = document.getElementById('format').checked;
  
    chrome.storage.sync.set(
      { timestampEnabled: timestamp, pendingEnabled: pending, formatEnabled: format }
    );
  };

  const restoreOptions = () => {
    chrome.storage.sync.get(
        { timestampEnabled: true, pendingEnabled: true, formatEnabled: true},
        (items) => {
            document.getElementById('timestamp').checked = items.timestampEnabled;
            document.getElementById('pending').checked = items.pendingEnabled;
            document.getElementById('format').checked = items.formatEnabled;
        }
    )
  }

  document.addEventListener('DOMContentLoaded', restoreOptions);
  document.getElementById('timestamp').addEventListener('click', saveOptions);
  document.getElementById('pending').addEventListener('click', saveOptions);
  document.getElementById('format').addEventListener('click', saveOptions);

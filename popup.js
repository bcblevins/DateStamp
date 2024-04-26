document.addEventListener('DOMContentLoaded', function() {
    var currentTimeElement = document.getElementById('current-time');

    function getCurrentTime() {
        let now = new Date();

    
        currentTimeElement.textContent = now.toLocaleString();
    }

    getCurrentTime();

});
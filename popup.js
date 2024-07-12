document.addEventListener('DOMContentLoaded', function() {
  var siteInput = document.getElementById('site');
  var blockBtn = document.getElementById('blockBtn');
  var statusDiv = document.createElement('div');
  document.body.appendChild(statusDiv);

  // Get the current blocked site when popup opens
  chrome.runtime.sendMessage({action: "getBlockedSite"}, function(response) {
    siteInput.value = response.site || '';
    updateButtonText();
  });

  function updateButtonText() {
    blockBtn.textContent = siteInput.value ? "Unblock" : "Block";
  }

  siteInput.addEventListener('input', updateButtonText);

  blockBtn.addEventListener('click', function() {
    var site = siteInput.value.trim();
    chrome.runtime.sendMessage({action: "updateBlockedSite", site: site}, function(response) {
      if (response.status === "updated") {
        statusDiv.textContent = site ? `Blocked: ${site}` : "No site blocked";
        updateButtonText();
      }
    });
  });
});
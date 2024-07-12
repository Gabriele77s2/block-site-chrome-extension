document.addEventListener('DOMContentLoaded', function() {
  var siteInput = document.getElementById('site');
  var blockBtn = document.getElementById('blockBtn');
  var unblockBtn = document.getElementById('unblockBtn');
  var statusDiv = document.getElementById('status');

  // Get the current blocked site when popup opens
  chrome.runtime.sendMessage({action: "getBlockedSite"}, function(response) {
    siteInput.value = response.site || '';
    updateStatus(response.site);
  });

  function updateStatus(site) {
    statusDiv.textContent = site ? `Currently blocked: ${site}` : "No site blocked";
  }

  blockBtn.addEventListener('click', function() {
    var site = siteInput.value.trim();
    if (site) {
      chrome.runtime.sendMessage({action: "blockSite", site: site}, function(response) {
        if (response.status === "blocked") {
          updateStatus(site);
        }
      });
    }
  });

  unblockBtn.addEventListener('click', function() {
    chrome.runtime.sendMessage({action: "unblockSite"}, function(response) {
      if (response.status === "unblocked") {
        siteInput.value = '';
        updateStatus('');
      }
    });
  });
});
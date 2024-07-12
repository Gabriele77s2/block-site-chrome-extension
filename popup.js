document.addEventListener('DOMContentLoaded', function() {
  var siteInput = document.getElementById('site');
  var blockBtn = document.getElementById('blockBtn');

  chrome.storage.sync.get(['blockedSite'], function(result) {
    siteInput.value = result.blockedSite || '';
  });

  blockBtn.addEventListener('click', function() {
    var site = siteInput.value;
    chrome.runtime.sendMessage({action: "updateBlockedSite", site: site});
    window.close();
  });
});
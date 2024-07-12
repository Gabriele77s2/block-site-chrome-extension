document.addEventListener('DOMContentLoaded', function() {
  const siteInput = document.getElementById('site');
  const blockBtn = document.getElementById('blockBtn');
  const blockedSitesDiv = document.getElementById('blockedSites');

  function updateBlockedSitesList() {
    chrome.runtime.sendMessage({action: "getBlockedSites"}, function(response) {
      blockedSitesDiv.innerHTML = '';
      response.sites.forEach(site => {
        const siteItem = document.createElement('div');
        siteItem.className = 'site-item';
        siteItem.innerHTML = `
          <span>${site}</span>
          <button class="unblockBtn" data-site="${site}">Unblock</button>
        `;
        blockedSitesDiv.appendChild(siteItem);
      });

      // Add event listeners to unblock buttons
      document.querySelectorAll('.unblockBtn').forEach(btn => {
        btn.addEventListener('click', function() {
          const site = this.getAttribute('data-site');
          chrome.runtime.sendMessage({action: "unblockSite", site: site}, updateBlockedSitesList);
        });
      });
    });
  }

  blockBtn.addEventListener('click', function() {
    const site = siteInput.value.trim();
    if (site) {
      chrome.runtime.sendMessage({action: "blockSite", site: site}, function(response) {
        if (response.status === "blocked") {
          siteInput.value = '';
          updateBlockedSitesList();
        }
      });
    }
  });

  updateBlockedSitesList();
});
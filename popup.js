document.addEventListener('DOMContentLoaded', function() {
  const siteInput = document.getElementById('site');
  const blockBtn = document.getElementById('blockBtn');
  const blockedSitesDiv = document.getElementById('blockedSites');

  function updateBlockedSitesList() {
    chrome.runtime.sendMessage({action: "getBlockedSites"}, function(response) {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError);
        return;
      }
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

      document.querySelectorAll('.unblockBtn').forEach(btn => {
        btn.addEventListener('click', function() {
          const site = this.getAttribute('data-site');
          unblockSite(site);
        });
      });
    });
  }

  function blockSite(site) {
    // Remove protocol and www if present
    site = site.replace(/^(https?:\/\/)?(www\.)?/, '');
    // Remove path and query parameters
    site = site.split('/')[0];
    
    chrome.runtime.sendMessage({action: "blockSite", site: site}, function(response) {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError);
        return;
      }
      if (response.status === "blocked") {
        siteInput.value = '';
        updateBlockedSitesList();
      }
    });
  }

  function unblockSite(site) {
    chrome.runtime.sendMessage({action: "unblockSite", site: site}, function(response) {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError);
        return;
      }
      updateBlockedSitesList();
    });
  }

  function handleBlockAction() {
    const site = siteInput.value.trim();
    if (site) {
      blockSite(site);
    }
  }

  // Event listener for the Block button
  blockBtn.addEventListener('click', handleBlockAction);

  // Event listener for the Enter key on the input field
  siteInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
      event.preventDefault(); // Prevent form submission
      handleBlockAction();
    }
  });

  updateBlockedSitesList();
});
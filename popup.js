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
let blockedSites = [];

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.get(['blockedSites'], function(result) {
    blockedSites = result.blockedSites || [];
    updateBlockRules();
  });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch (request.action) {
    case "blockSite":
      if (!blockedSites.includes(request.site)) {
        blockedSites.push(request.site);
        updateBlockRules();
        updateStorage();
        sendResponse({status: "blocked", sites: blockedSites});
      }
      break;
    case "unblockSite":
      blockedSites = blockedSites.filter(site => site !== request.site);
      updateBlockRules();
      updateStorage();
      sendResponse({status: "unblocked", sites: blockedSites});
      break;
    case "getBlockedSites":
      sendResponse({sites: blockedSites});
      break;
  }
  return true; // Keeps the message channel open for sendResponse
});

function updateStorage() {
  chrome.storage.sync.set({blockedSites: blockedSites}, function() {
    if (chrome.runtime.lastError) {
      console.error('Error updating storage:', chrome.runtime.lastError);
    }
  });
}

function updateBlockRules() {
  chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: blockedSites.map((_, index) => index + 1),
    addRules: blockedSites.map((site, index) => ({
      id: index + 1,
      priority: 1,
      action: { type: "block" },
      condition: { urlFilter: `||${site}`, resourceTypes: ["main_frame"] }
    }))
  }, () => {
    if (chrome.runtime.lastError) {
      console.error('Error updating rules:', chrome.runtime.lastError);
    }
  });
}
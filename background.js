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
  return true;
});

function updateStorage() {
  chrome.storage.sync.set({blockedSites: blockedSites}, function() {
    if (chrome.runtime.lastError) {
      console.error('Error updating storage:', chrome.runtime.lastError);
    }
  });
}

function updateBlockRules() {
  const rules = blockedSites.flatMap((site, index) => {
    const baseRule = {
      id: index * 2 + 1,
      priority: 1,
      action: { type: "block" },
      condition: { urlFilter: `||${site}`, resourceTypes: ["main_frame"] }
    };
    
    // Additional rule for subdomains
    const subdomainRule = {
      id: index * 2 + 2,
      priority: 1,
      action: { type: "block" },
      condition: { urlFilter: `||*.${site}`, resourceTypes: ["main_frame"] }
    };

    return [baseRule, subdomainRule];
  });

  chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: rules.map(rule => rule.id),
    addRules: rules
  }, () => {
    if (chrome.runtime.lastError) {
      console.error('Error updating rules:', chrome.runtime.lastError);
    }
  });

  // Additional check for already open tabs
  chrome.tabs.query({}, (tabs) => {
    tabs.forEach((tab) => {
      const blockedSite = blockedSites.find(site => tab.url.includes(site));
      if (blockedSite) {
        chrome.tabs.update(tab.id, {url: "blocked.html"});
      }
    });
  });
}

// Listen for tab updates to catch any blocked sites that might slip through
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    const blockedSite = blockedSites.find(site => tab.url.includes(site));
    if (blockedSite) {
      chrome.tabs.update(tabId, {url: "blocked.html"});
    }
  }
});
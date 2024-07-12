chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.set({ blockedSites: [] });
  });
  
  chrome.webRequest.onBeforeRequest.addListener(
    function(details) {
      return { cancel: true };
    },
    { urls: [] },
    ["blocking"]
  );
  
  chrome.storage.onChanged.addListener((changes, namespace) => {
    if (changes.blockedSites) {
      const blockedSites = changes.blockedSites.newValue.map(site => `*://${site}/*`);
      chrome.declarativeNetRequest.updateDynamicRules({
        removeRuleIds: [1],
        addRules: [
          {
            id: 1,
            priority: 1,
            action: { type: "block" },
            condition: { urlFilter: blockedSites.join('|') }
          }
        ]
      });
    }
  });
  
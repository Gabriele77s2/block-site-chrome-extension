chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ blockedSites: [] });
  updateBlockRules([]);
});

chrome.storage.onChanged.addListener((changes) => {
  if (changes.blockedSites) {
    const blockedSites = changes.blockedSites.newValue.map(site => `*://${site}/*`);
    updateBlockRules(blockedSites);
  }
});

function updateBlockRules(blockedSites) {
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

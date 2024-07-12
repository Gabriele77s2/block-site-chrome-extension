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
    removeRuleIds: [1],  // We are using rule ID 1 for simplicity
    addRules: blockedSites.length > 0 ? [
      {
        id: 1,
        priority: 1,
        action: { type: "block" },
        condition: { urlFilter: `|${blockedSites.join('|')}` }
      }
    ] : []
  });
}

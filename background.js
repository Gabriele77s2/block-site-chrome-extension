let blockedSites = new Set();

chrome.runtime.onInstalled.addListener(async () => {
  const { blockedSites: storedSites } = await chrome.storage.sync.get('blockedSites');
  blockedSites = new Set(storedSites || []);
  updateBlockRules();
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch (request.action) {
    case "blockSite":
      blockedSites.add(request.site);
      break;
    case "unblockSite":
      blockedSites.delete(request.site);
      break;
    case "getBlockedSites":
      sendResponse({ sites: Array.from(blockedSites) });
      return true;
  }
  updateBlockRules();
  chrome.storage.sync.set({ blockedSites: Array.from(blockedSites) });
});

async function updateBlockRules() {
  const rules = Array.from(blockedSites).map((site, index) => ({
    id: index + 1,
    priority: 1,
    action: { type: "block" },
    condition: { urlFilter: `||${site}`, resourceTypes: ["main_frame"] }
  }));

  await chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: rules.map(rule => rule.id),
    addRules: rules
  });
}
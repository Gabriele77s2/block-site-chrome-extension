let blockedSites = [];

chrome.storage.sync.get(['blockedSites'], function(result) {
  blockedSites = result.blockedSites || [];
});

chrome.webRequest.onBeforeRequest.addListener(
  function(details) {
    if (blockedSites.some(site => details.url.indexOf(site) !== -1)) {
      return {cancel: true};
    }
    return {cancel: false};
  },
  {urls: ["<all_urls>"]},
  ["blocking"]
);

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.action === "blockSite") {
      if (!blockedSites.includes(request.site)) {
        blockedSites.push(request.site);
        chrome.storage.sync.set({blockedSites: blockedSites});
        sendResponse({status: "blocked", sites: blockedSites});
      }
    } else if (request.action === "unblockSite") {
      blockedSites = blockedSites.filter(site => site !== request.site);
      chrome.storage.sync.set({blockedSites: blockedSites});
      sendResponse({status: "unblocked", sites: blockedSites});
    } else if (request.action === "getBlockedSites") {
      sendResponse({sites: blockedSites});
    }
    return true; // Keeps the message channel open for sendResponse
  }
);
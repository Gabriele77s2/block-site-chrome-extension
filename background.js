let blockedSite = '';

chrome.storage.sync.get(['blockedSite'], function(result) {
  blockedSite = result.blockedSite || '';
});

chrome.webRequest.onBeforeRequest.addListener(
  function(details) {
    if (blockedSite && details.url.indexOf(blockedSite) !== -1) {
      return {cancel: true};
    }
    return {cancel: false};
  },
  {urls: ["<all_urls>"]},
  ["blocking"]
);

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.action === "updateBlockedSite") {
      blockedSite = request.site;
      chrome.storage.sync.set({blockedSite: blockedSite});
    }
  }
);
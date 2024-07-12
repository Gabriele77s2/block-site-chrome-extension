const blockForm = document.getElementById('blockForm');
const siteInput = document.getElementById('site');
const blockedSitesList = document.getElementById('blockedSites');

async function updateBlockedSitesList() {
  try {
    const { sites } = await chrome.runtime.sendMessage({ action: "getBlockedSites" });
    blockedSitesList.innerHTML = sites.map(site => `
      <li class="site-item">
        <span>${site}</span>
        <button class="unblockBtn" data-site="${site}">Unblock</button>
      </li>
    `).join('');

    document.querySelectorAll('.unblockBtn').forEach(btn => {
      btn.addEventListener('click', handleUnblock);
    });
  } catch (error) {
    console.error('Error updating blocked sites list:', error);
  }
}

async function handleBlock(event) {
  event.preventDefault();
  const site = new URL(siteInput.value).hostname;
  try {
    await chrome.runtime.sendMessage({ action: "blockSite", site });
    siteInput.value = '';
    updateBlockedSitesList();
  } catch (error) {
    console.error('Error blocking site:', error);
  }
}

async function handleUnblock(event) {
  const site = event.target.dataset.site;
  try {
    await chrome.runtime.sendMessage({ action: "unblockSite", site });
    updateBlockedSitesList();
  } catch (error) {
    console.error('Error unblocking site:', error);
  }
}

blockForm.addEventListener('submit', handleBlock);
document.addEventListener('DOMContentLoaded', updateBlockedSitesList);
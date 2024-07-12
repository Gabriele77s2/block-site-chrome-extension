document.getElementById('blockBtn').addEventListener('click', () => {
  const website = document.getElementById('website').value.trim();
  if (website) {
    chrome.storage.sync.get('blockedSites', (data) => {
      const blockedSites = data.blockedSites || [];
      if (!blockedSites.includes(website)) {
        blockedSites.push(website);
        chrome.storage.sync.set({ blockedSites }, updateBlockedList);
      }
    });
  }
  document.getElementById('website').value = '';
});

function updateBlockedList() {
  chrome.storage.sync.get('blockedSites', (data) => {
    const blockedList = document.getElementById('blockedList');
    blockedList.innerHTML = '';
    const blockedSites = data.blockedSites || [];
    blockedSites.forEach(site => {
      const li = document.createElement('li');
      li.textContent = site;
      const removeBtn = document.createElement('span');
      removeBtn.textContent = 'Remove';
      removeBtn.classList.add('removeBtn');
      removeBtn.addEventListener('click', () => {
        removeBlockedSite(site);
      });
      li.appendChild(removeBtn);
      blockedList.appendChild(li);
    });
  });
}

function removeBlockedSite(site) {
  chrome.storage.sync.get('blockedSites', (data) => {
    let blockedSites = data.blockedSites || [];
    blockedSites = blockedSites.filter(s => s !== site);
    chrome.storage.sync.set({ blockedSites }, updateBlockedList);
  });
}

document.addEventListener('DOMContentLoaded', updateBlockedList);

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
        blockedList.appendChild(li);
      });
    });
  }
  
  document.addEventListener('DOMContentLoaded', updateBlockedList);
  
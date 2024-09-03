chrome.runtime.onInstalled.addListener((details) => {
  chrome.contextMenus.create({
    title: 'Accessibility guidelines',
    id: 'contextMenu1',
    contexts: ['all', 'page', 'selection'],
  })
  chrome.contextMenus.onClicked.addListener(() => {
    chrome.tabs.create({
      url: 'https://www.w3.org/WAI/standards-guidelines/',
    })
  })
})

console.log('background script running')

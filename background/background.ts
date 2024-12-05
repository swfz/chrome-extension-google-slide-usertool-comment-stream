let subscriberTabId;
let streamTabId;

chrome.runtime.onMessage.addListener((req, sender, sendResponse) => {
  if (req.command === 'Load') {
    if (req.from === 'subscriber') {
      subscriberTabId = req.tabId;
    }
    if (req.from === 'stream') {
      streamTabId = req.tabId;
    }
  }

  if (req.command === 'SendSubscribedComments') {
    console.log(streamTabId);
    chrome.tabs.sendMessage(streamTabId, { command: req.command, comments: req.comments });
    chrome.tabs.sendMessage(subscriberTabId, { command: 'debug subscriber', comments: req.comments });
  }

  console.log(req);
  // console.log(sender);
  // console.log(sendResponse);
});

console.log('background script');

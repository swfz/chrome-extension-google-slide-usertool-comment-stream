import { messageHandler } from '../lib/util';

let subscriberTabId;
let streamTabId;

chrome.runtime.onMessage.addListener((req, sender, sendResponse) => {
  console.log(req);
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
    // chrome.tabs.sendMessage(subscriberTabId, { command: 'debug subscriber', comments: req.comments });
  }

  if (req.command === 'SakuraComment') {
    console.log('sakura', req);
    chrome.tabs.sendMessage(subscriberTabId, { command: req.command, comment: req.comment }, messageHandler);
    sendResponse({ message: 'send' });
  }

  // console.log(sender);
  // console.log(sendResponse);
  return true;
});

console.log('background script');

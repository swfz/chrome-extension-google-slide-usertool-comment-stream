import { info, messageHandler } from '../lib/util';

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
  }

  if (req.command === 'SakuraComment') {
    info('sakura', req);
    // console.log('sakura', req);
    chrome.tabs.sendMessage(subscriberTabId, { command: req.command, comment: req.comment }, messageHandler);
    sendResponse({ message: 'send' });
  }

  return true;
});

console.log('background script');

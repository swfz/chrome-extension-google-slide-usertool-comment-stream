import { subscribeComments, commentExtractConfig, extractAllComments } from '../lib/subscriber';

console.log('loaded google slide comment stream');
let commentSubscribed = false;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.command === 'Load') {
    const platform = message.platform;
    console.log(message);

    const observeElement = commentExtractConfig[platform].listNodeExtractFn();

    if (observeElement === null) {
      sendResponse({ screenType: 'subscriber', message: `Error: not found comment node...` });
      return;
    }

    if (!commentSubscribed) {
      subscribeComments(platform, observeElement, sendResponse);
      commentSubscribed = true;
      console.log('subscribe presenter usertool started');
      chrome.runtime.sendMessage({ command: 'Load', from: 'subscriber', tabId: message.tabId });
    }
  } else if (message.command === 'Download') {
    extractAllComments(sendResponse);
  }
});

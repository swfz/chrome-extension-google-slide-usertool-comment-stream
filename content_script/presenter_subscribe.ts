import { postSakuraComment } from '../lib/sakura';
import { subscribeComments, commentExtractConfig, extractAllComments } from '../lib/subscriber';
import { messageHandler } from '../lib/util';

console.log('loaded google slide comment stream');
let observer = { disconnect: () => {} };

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log(message);

  if (message.command === 'Load') {
    const platform = message.platform;
    console.log(message);

    const observeElement = commentExtractConfig[platform].listNodeExtractFn();

    if (observeElement === null) {
      sendResponse({ screenType: 'subscriber', message: `Error: not found comment node...` });
      return;
    }

    observer.disconnect();
    observer = subscribeComments(platform, observeElement, sendResponse);
    console.log('subscribe comment list started');
    chrome.runtime.sendMessage({ command: 'Load', from: 'subscriber', tabId: message.tabId }, messageHandler);
  } else if (message.command === 'Download') {
    extractAllComments(sendResponse);
  } else if (message.command === 'SakuraComment') {
    postSakuraComment(message.comment, sendResponse);
  }
});

import { addSubscribePageNumber } from '../lib/sakura';
import { clapElementStyle, addComment, renderClaps, removelinkBar } from '../lib/streamer';

console.log('loaded google slide comment stream');
let slidePageSubscribed = false;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log(message);

  const iframeElement: HTMLIFrameElement | null = document.querySelector('.punch-present-iframe');
  if (iframeElement === null || iframeElement.contentWindow === null) {
    sendResponse({ screenType: 'slide', message: 'Error: Not found slide element...' });
    return;
  }

  if (message.command === 'Load') {
    removelinkBar(iframeElement);
    chrome.runtime.sendMessage({ command: 'Load', from: 'stream', tabId: message.tabId });
    if (!slidePageSubscribed) {
      console.log('subscribe page number');
      addSubscribePageNumber(iframeElement);
      slidePageSubscribed = true;
    }
    sendResponse({ screenType: 'slide', message: 'A listener has been added to the SLIDE side.' });
  }

  if (message.command === 'SendSubscribedComments') {
    const boxElement = iframeElement.contentWindow.document.querySelector('.punch-viewer-content');

    if (boxElement === null) {
      sendResponse({ screenType: 'slide', message: 'Error: Not found slide element...' });
      return;
    }

    const clapElement = document.createElement('div');

    const beltPerContainer = 0.12;
    const containerHeight = boxElement.clientHeight * (1 - beltPerContainer);
    const containerWidth = boxElement.clientWidth;

    // 右1割、下1割
    const clapElementBottom = boxElement.clientHeight * 0.1;
    const clapElementRight = containerWidth * 0.1;

    const p = document.createElement('p');
    p.style.margin = '0';

    const img = document.createElement('img');
    const imageUrl = chrome.runtime.getURL('images/sign_language_black_24dp.svg');
    img.src = imageUrl;

    clapElement.appendChild(p);
    clapElement.appendChild(img);
    boxElement.appendChild(clapElement);

    const clapElementStyles = clapElementStyle(clapElementBottom, clapElementRight);
    Object.entries(clapElementStyles).forEach(([k, v]) => (clapElement.style[k] = v));

    chrome.storage.sync.get(['config'], ({ config }) => {
      console.log('broadcast channnel');

      const claps = message.comments.reduce((n, comment) => n + comment.match(/[8８]/g)?.length, 0);
      const comments = message.comments.filter((comment) => !comment.match(/^[8８]+$/));

      if (claps > 0) {
        renderClaps(claps, p, clapElement, clapElementBottom, clapElementRight, config);
      }
      comments.forEach((comment) => addComment(comment, boxElement, containerHeight, config));
    });
  }
});

import { info, messageHandler } from './util';

// FIXME: 1ページで複数投稿があるとうまく投稿されないケースがある
const postSakuraComment = (comment: string, sendResponse) => {
  chrome.storage.sync.get(['config'], ({ config }) => {
    if (!config.plant) return;

    const iframeElement = document.querySelector<HTMLIFrameElement>('.pwa-webclient__iframe');
    if (iframeElement === null) {
      sendResponse({ message: 'Error: not found irfame...' });
      return;
    }

    const p = iframeElement?.contentWindow?.document.querySelector<HTMLElement>('.ProseMirror p');

    if (p === null || p === undefined) {
      sendResponse({ message: 'Error: not found p...' });
      return;
    }

    p.innerText = comment;

    const sendButton = iframeElement?.contentWindow?.document.querySelector<HTMLButtonElement>('.chat-rtf-box__send');
    sendButton?.click();

    sendResponse({ message: 'Success Sakura Post' });
  });
};

const addSubscribePageNumber = (iframeElement: HTMLIFrameElement) => {
  if (iframeElement === null) {
    return;
  }
  const observeElement = iframeElement.contentWindow?.document.querySelector<HTMLDivElement>(
    '.docs-material-menu-button-flat-default-caption',
  );

  if (observeElement === null || observeElement === undefined) {
    info('not exist observe element');
    return;
  }

  const observer = new MutationObserver(function (records) {
    const added = records.at(-1)?.addedNodes[0]?.textContent;
    const removed = records[0]?.removedNodes[0]?.textContent;

    if (added && removed && added > removed) {
      chrome.storage.sync.get(['sakura'], ({ sakura }) => {
        info(added, removed, sakura, records);

        const plantCommentRows = sakura[added];

        if (plantCommentRows !== undefined) {
          plantCommentRows.forEach((commentRow) => {
            setTimeout(() => {
              chrome.runtime.sendMessage({ command: 'SakuraComment', from: 'slide', comment: commentRow.comment }, messageHandler);
            }, commentRow.seconds * 1000);
          });
        }
      });
    }
  });

  observer.observe(observeElement, { subtree: true, childList: true });
};

export { addSubscribePageNumber, postSakuraComment };

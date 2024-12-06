import { info } from './util';

interface Extractor {
  commentNodeClassName: string; // migrationしたら不要
  listNodeSelector: string; // migrationしたら不要
  isTargetElement: (el: HTMLElement) => boolean;
  listNodeExtractFn: () => HTMLElement | null | undefined;
  commentExtractFn: (el: HTMLElement) => string | null | undefined;
}

type Platform = 'gslide' | 'zoom';
type CommentExtractorConfig = { [K in Platform]: Extractor };

const commentExtractConfig: CommentExtractorConfig = {
  gslide: {
    commentNodeClassName: 'punch-viewer-speaker-questions',
    listNodeSelector: '.punch-viewer-speaker-questions',
    isTargetElement: (el) => false,
    listNodeExtractFn: () => null,
    commentExtractFn: (el) => el.children[1].children[2]['innnerText'],
  },
  zoom: {
    commentNodeClassName: 'ReactVirtualized__Grid__innerScrollContainer',
    listNodeSelector: '.ReactVirtualized__Grid__innerScrollContainer',
    isTargetElement: (el) => {
      return ['ReactVirtualized__Grid__innerScrollContainer', 'eactVirtualized__Grid ReactVirtualized__List chat-virtualized-list'].some(
        (className) => {
          return el.className.match(className);
        },
      );
    },
    listNodeExtractFn: () => {
      const iframeElement = document.querySelector<HTMLIFrameElement>('.pwa-webclient__iframe');
      if (iframeElement === null) {
        return null;
      }

      return iframeElement.contentWindow?.document.querySelector('.chat-container__chat-list');
    },
    commentExtractFn: (el) => {
      const commentContainer = el.querySelector<HTMLElement>('.new-chat-message__container');
      if (commentContainer === null) return '';

      console.log(commentContainer);

      return commentContainer.getAttribute('aria-label')?.split(', ').at(-1);
    },
  },
};

const subscribeComments = (platform, observeElement, sendResponse) => {
  const extractComment = (mutationRecords: MutationRecord[]): string[] => {
    const nodes = mutationRecords
      .filter((record) => {
        const element = record.target as Element;

        return commentExtractConfig[platform].isTargetElement(element);
      })
      .map((record) => record.addedNodes[0]);

    const comments = Array.from(nodes).map((node) => commentExtractConfig[platform].commentExtractFn(node));
    info(comments);
    return comments;
  };

  const observer = new MutationObserver(function (records) {
    chrome.runtime.sendMessage({ command: 'SendSubscribedComments', comments: extractComment(records) });
  });

  observer.observe(observeElement, { subtree: true, childList: true });

  sendResponse({ screenType: 'presenter', message: 'A listener has been added to the Comment side.' });

  return observer;
};

// TODO: downloaderとかに移動
const extractAllComments = (sendResponse) => {
  const commentElements = document.querySelectorAll<HTMLDivElement>('.punch-qanda-question-content');

  const comments = Array.from(commentElements).map((commentElement) => {
    const userElem = commentElement.querySelector('.punch-qanda-question-user-name');
    const timeElem = commentElement.querySelector('.punch-qanda-question-time');
    const textElem = commentElement.querySelector('.punch-qanda-question-text');
    const prosElem = commentElement.querySelector('#\\:3b');
    const againstElem = commentElement.querySelector('#\\:3c');

    return {
      user: userElem?.textContent,
      time: timeElem?.textContent,
      text: textElem?.textContent,
      pros: prosElem?.textContent,
      against: againstElem?.textContent,
    };
  });

  sendResponse({ comments });
};

export { subscribeComments, commentExtractConfig, extractAllComments };

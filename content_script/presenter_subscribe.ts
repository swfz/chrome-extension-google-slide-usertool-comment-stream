console.log('loaded google slide comment stream');
let commentSubscribed = false;

const selectors = {
  gslide: {
    commentNodeClassName: 'punch-viewer-speaker-questions',
    listNodeSelector: '.punch-viewer-speaker-questions',
    extractFn: (el) => el.children[1].children[2],
  },
}

const subscribeComments = (platform, observeElement, sendResponse) => {
  const broadcastChannel = new BroadcastChannel('comment_channel');

  const extractComment = (mutationRecords: MutationRecord[]): string[] => {
    console.log(mutationRecords);
    const nodes = mutationRecords
      .filter((record) => {
        const element = record.target as Element;

        return element.className === selectors[platform].commentNodeClassName;
      })
      .map((record) => record.addedNodes[0]);
    const comments = Array.from(nodes).map((node) => {
      const element = node as HTMLElement;
      const commentElement = selectors[platform].extractFn(element) as HTMLElement;

      return commentElement.innerText;
    });
    console.log(comments);
    return comments;
  };

  const observer = new MutationObserver(function (records) {
    broadcastChannel.postMessage(extractComment(records));
  });

  observer.observe(observeElement, { subtree: true, childList: true });
  commentSubscribed = true;

  sendResponse({ screenType: 'presenter', message: 'A listener has been added to the PRESENTER side.' });
};

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

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  const platform = message.platform;
  const observeElement = document.querySelector<HTMLDivElement>(selectors[platform].listNodeSelector);

  if (observeElement === null) {
    return;
  }

  if (message.command === 'Load') {
    if (!commentSubscribed) {
      subscribeComments(platform, observeElement, sendResponse);
      console.log('subscribe presenter usertool started');
    }
  } else if (message.command === 'Download') {
    extractAllComments(sendResponse);
  }
});
